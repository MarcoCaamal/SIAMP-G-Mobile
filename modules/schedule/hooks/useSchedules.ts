import { useCallback, useEffect, useState } from 'react';
import { scheduleService } from '../services/schedule.service';
import {
    CreateScheduleRequest,
    Schedule,
    UpdateScheduleRequest
} from '../types/schedule.types';

export const useSchedules = (deviceId?: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await scheduleService.getSchedules(deviceId);
      
      if (response._isSuccess && response._value) {
        setSchedules(response._value);
      } else {
        setError(response._error || 'Error al cargar las programaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const createSchedule = async (scheduleData: CreateScheduleRequest): Promise<boolean> => {
    try {
      setError(null);
      const response = await scheduleService.createSchedule(scheduleData);
      
      if (response._isSuccess && response._value) {
        setSchedules(prev => [...prev, response._value!]);
        return true;
      } else {
        setError(response._error || 'Error al crear la programación');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      return false;
    }
  };

  const updateSchedule = async (id: string, scheduleData: UpdateScheduleRequest): Promise<boolean> => {
    try {
      setError(null);
      const response = await scheduleService.updateSchedule(id, scheduleData);
      
      if (response._isSuccess && response._value) {
        setSchedules(prev => 
          prev.map(schedule => schedule.id === id ? response._value! : schedule)
        );
        return true;
      } else {
        setError(response._error || 'Error al actualizar la programación');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      return false;
    }
  };

  const toggleScheduleStatus = async (id: string, activate: boolean): Promise<boolean> => {
    try {
      setError(null);
      const response = await scheduleService.toggleScheduleStatus(id, activate);
      
      if (response._isSuccess && response._value) {
        setSchedules(prev => 
          prev.map(schedule => schedule.id === id ? response._value! : schedule)
        );
        return true;
      } else {
        setError(response._error || 'Error al cambiar el estado de la programación');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      return false;
    }
  };

  const deleteSchedule = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await scheduleService.deleteSchedule(id);
      
      if (response._isSuccess) {
        setSchedules(prev => prev.filter(schedule => schedule.id !== id));
        return true;
      } else {
        setError(response._error || 'Error al eliminar la programación');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      return false;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    toggleScheduleStatus,
    deleteSchedule,
  };
};

export const useSchedule = (id: string) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await scheduleService.getScheduleById(id);
      
      if (response._isSuccess && response._value) {
        setSchedule(response._value);
      } else {
        setError(response._error || 'Error al cargar la programación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    fetchSchedule,
  };
};
