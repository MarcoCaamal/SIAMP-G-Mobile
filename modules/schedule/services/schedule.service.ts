import { API_CONFIG } from '../../shared/config/api.config';
import axios from '../../shared/utils/axios';
import {
    CreateScheduleRequest,
    DayOfWeek,
    Schedule,
    ScheduleType,
    UpdateScheduleRequest
} from '../types/schedule.types';

// Respuesta estándar de la API
export interface ApiResponse<T> {
  _isSuccess: boolean;
  _value?: T;
  _error?: string;
}

class ScheduleService {
  private readonly baseUrl = `${API_CONFIG.BASE_URL}/schedules`;

  // Transformar datos del frontend al formato del backend
  private transformToBackendFormat(scheduleData: CreateScheduleRequest | UpdateScheduleRequest): any {
    const { scheduleType, time, daysOfWeek, intensity, color, duration, ...rest } = scheduleData as CreateScheduleRequest;
    
    // Convertir array de días a objeto de días
    const daysOfWeekObj = {
      monday: daysOfWeek?.includes(DayOfWeek.MONDAY) || false,
      tuesday: daysOfWeek?.includes(DayOfWeek.TUESDAY) || false,
      wednesday: daysOfWeek?.includes(DayOfWeek.WEDNESDAY) || false,
      thursday: daysOfWeek?.includes(DayOfWeek.THURSDAY) || false,
      friday: daysOfWeek?.includes(DayOfWeek.FRIDAY) || false,
      saturday: daysOfWeek?.includes(DayOfWeek.SATURDAY) || false,
      sunday: daysOfWeek?.includes(DayOfWeek.SUNDAY) || false,
    };

    // Determinar el tipo de recurrencia
    let recurrenceType: 'once' | 'daily' | 'weekly' | 'custom' = 'once';
    if (daysOfWeek && daysOfWeek.length > 0) {
      if (daysOfWeek.length === 7) {
        recurrenceType = 'daily';
      } else if (daysOfWeek.length === 1) {
        recurrenceType = 'weekly';
      } else {
        recurrenceType = 'custom';
      }
    }

    // Generar un deviceId válido si no es un ObjectId válido
    let validDeviceId = rest.deviceId;
    if (!validDeviceId || validDeviceId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(validDeviceId)) {
      // Generar un ObjectId temporal válido (esto debería reemplazarse con un deviceId real)
      validDeviceId = '507f1f77bcf86cd799439011'; // ObjectId de ejemplo
      console.warn('Using temporary deviceId. Please ensure you have valid device IDs from the devices module.');
    }

    return {
      ...rest,
      deviceId: validDeviceId,
      scheduledTime: time,
      timezone: 'America/Mexico_City', // Zona horaria por defecto
      scheduledAction: {
        state: intensity && intensity > 0 ? 'on' : 'off',
        brightness: intensity || 0,
        lightingModeId: scheduleType === ScheduleType.LIGHTING ? null : undefined
      },
      recurrence: {
        type: recurrenceType,
        daysOfWeek: recurrenceType === 'custom' || recurrenceType === 'weekly' ? daysOfWeekObj : undefined,
        endDate: null
      }
    };
  }

  // Transformar datos del backend al formato del frontend
  private transformFromBackendFormat(backendData: any): Schedule {
    const { scheduledTime, scheduledAction, recurrence, ...rest } = backendData;
    
    // Convertir objeto de días a array
    const daysOfWeek: DayOfWeek[] = [];
    if (recurrence?.daysOfWeek) {
      if (recurrence.daysOfWeek.monday) daysOfWeek.push(DayOfWeek.MONDAY);
      if (recurrence.daysOfWeek.tuesday) daysOfWeek.push(DayOfWeek.TUESDAY);
      if (recurrence.daysOfWeek.wednesday) daysOfWeek.push(DayOfWeek.WEDNESDAY);
      if (recurrence.daysOfWeek.thursday) daysOfWeek.push(DayOfWeek.THURSDAY);
      if (recurrence.daysOfWeek.friday) daysOfWeek.push(DayOfWeek.FRIDAY);
      if (recurrence.daysOfWeek.saturday) daysOfWeek.push(DayOfWeek.SATURDAY);
      if (recurrence.daysOfWeek.sunday) daysOfWeek.push(DayOfWeek.SUNDAY);
    }

    // Determinar el tipo de programación basado en la acción
    let scheduleType = ScheduleType.LIGHTING; // Por defecto
    if (scheduledAction?.lightingModeId) {
      scheduleType = ScheduleType.LIGHTING;
    }

    return {
      ...rest,
      time: scheduledTime,
      scheduleType: scheduleType,
      daysOfWeek: daysOfWeek,
      intensity: scheduledAction?.brightness || 0,
      color: undefined, // No se usa por ahora
      duration: undefined, // No se usa por ahora
      isActive: rest.status === 'active'
    };
  }

  // Obtener todas las programaciones del usuario
  async getSchedules(deviceId?: string): Promise<ApiResponse<Schedule[]>> {
    try {
      const params = deviceId ? { deviceId } : {};
      const response = await axios.get(this.baseUrl, { params });
      
      if (response.data.success && response.data.data) {
        const schedules = response.data.data.schedules || response.data.data || [];
        const transformedSchedules = schedules.map((schedule: any) => this.transformFromBackendFormat(schedule));
        return {
          _isSuccess: true,
          _value: transformedSchedules
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al obtener las programaciones'
        };
      }
    } catch (error: any) {
      console.error('Error fetching schedules:', error);
      console.error('Respuesta de error:', error.response?.data);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Obtener una programación por ID
  async getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      
      if (response.data.success) {
        const transformedSchedule = this.transformFromBackendFormat(response.data.data);
        return {
          _isSuccess: true,
          _value: transformedSchedule
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al obtener la programación'
        };
      }
    } catch (error: any) {
      console.error('Error fetching schedule:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Crear una nueva programación
  async createSchedule(scheduleData: CreateScheduleRequest): Promise<ApiResponse<Schedule>> {
    try {
      const transformedData = this.transformToBackendFormat(scheduleData);
      console.log('Enviando datos transformados para crear programación:', JSON.stringify(transformedData, null, 2));
      
      const response = await axios.post(this.baseUrl, transformedData);
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        const transformedSchedule = this.transformFromBackendFormat(response.data.data);
        return {
          _isSuccess: true,
          _value: transformedSchedule
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al crear la programación'
        };
      }
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      console.error('Respuesta de error:', error.response?.data);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Actualizar una programación
  async updateSchedule(id: string, scheduleData: UpdateScheduleRequest): Promise<ApiResponse<Schedule>> {
    try {
      const transformedData = this.transformToBackendFormat(scheduleData);
      const response = await axios.put(`${this.baseUrl}/${id}`, transformedData);
      
      if (response.data.success) {
        const transformedSchedule = this.transformFromBackendFormat(response.data.data);
        return {
          _isSuccess: true,
          _value: transformedSchedule
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al actualizar la programación'
        };
      }
    } catch (error: any) {
      console.error('Error updating schedule:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Activar/desactivar una programación
  async toggleScheduleStatus(id: string, activate: boolean): Promise<ApiResponse<Schedule>> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/toggle?activate=${activate}`);
      
      if (response.data.success) {
        const transformedSchedule = this.transformFromBackendFormat(response.data.data);
        return {
          _isSuccess: true,
          _value: transformedSchedule
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al cambiar el estado de la programación'
        };
      }
    } catch (error: any) {
      console.error('Error toggling schedule status:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }

  // Eliminar una programación
  async deleteSchedule(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`);
      
      if (response.data.success) {
        return {
          _isSuccess: true
        };
      } else {
        return {
          _isSuccess: false,
          _error: response.data.message || 'Error al eliminar la programación'
        };
      }
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      return {
        _isSuccess: false,
        _error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
}

export const scheduleService = new ScheduleService();
