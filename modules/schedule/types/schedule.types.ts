export interface Schedule {
  id: string;
  name: string;
  description?: string;
  deviceId: string;
  isActive: boolean;
  scheduleType: ScheduleType;
  time: string; // HH:mm format
  daysOfWeek: DayOfWeek[];
  intensity?: number; // 0-100 for lighting intensity
  color?: string; // hex color for lighting
  duration?: number; // duration in minutes
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  name: string;
  description?: string;
  deviceId: string;
  scheduleType: ScheduleType;
  time: string;
  daysOfWeek: DayOfWeek[];
  intensity?: number;
  color?: string;
  duration?: number;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  isActive?: boolean;
}

export enum ScheduleType {
  LIGHTING = 'lighting',
  WATERING = 'watering',
  FEEDING = 'feeding',
  TEMPERATURE = 'temperature',
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface ScheduleListResponse {
  success: boolean;
  message: string;
  data: Schedule[];
  total?: number;
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}

export interface ApiError {
  success: false;
  message: string;
  error: {
    message: string;
    statusCode?: number;
  };
}

// Helper functions for days
export const getDayLabel = (day: DayOfWeek): string => {
  const labels = {
    [DayOfWeek.MONDAY]: 'Lun',
    [DayOfWeek.TUESDAY]: 'Mar',
    [DayOfWeek.WEDNESDAY]: 'Mié',
    [DayOfWeek.THURSDAY]: 'Jue',
    [DayOfWeek.FRIDAY]: 'Vie',
    [DayOfWeek.SATURDAY]: 'Sáb',
    [DayOfWeek.SUNDAY]: 'Dom',
  };
  return labels[day];
};

export const getScheduleTypeLabel = (type: ScheduleType): string => {
  const labels = {
    [ScheduleType.LIGHTING]: 'Iluminación',
    [ScheduleType.WATERING]: 'Riego',
    [ScheduleType.FEEDING]: 'Alimentación',
    [ScheduleType.TEMPERATURE]: 'Temperatura',
  };
  return labels[type];
};

export const getScheduleTypeIcon = (type: ScheduleType): string => {
  const icons = {
    [ScheduleType.LIGHTING]: 'lightbulb-outline',
    [ScheduleType.WATERING]: 'water-outline',
    [ScheduleType.FEEDING]: 'fish-outline',
    [ScheduleType.TEMPERATURE]: 'thermometer-outline',
  };
  return icons[type];
};
