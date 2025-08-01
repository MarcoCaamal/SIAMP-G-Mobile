import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Schedule,
    getDayLabel,
    getScheduleTypeIcon,
    getScheduleTypeLabel
} from '../types/schedule.types';

interface ScheduleCardProps {
  schedule: Schedule;
  onToggle: (id: string, activate: boolean) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const formatDays = (days: string[]): string => {
    if (days.length === 7) return 'Todos los días';
    if (days.length === 5 && !days.includes('saturday') && !days.includes('sunday')) {
      return 'Días laborales';
    }
    if (days.length === 2 && days.includes('saturday') && days.includes('sunday')) {
      return 'Fines de semana';
    }
    return days.map(day => getDayLabel(day as any)).join(', ');
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar programación',
      `¿Estás seguro de que quieres eliminar "${schedule.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => onDelete(schedule.id)
        },
      ]
    );
  };

  const getNextExecution = (): string => {
    // Esta función calcularía la próxima ejecución basada en time y daysOfWeek
    // Por simplicidad, mostramos un placeholder
    return 'Próxima: Hoy 18:00';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getScheduleTypeIcon(schedule.scheduleType) as any} 
              size={24} 
              color="#8EC5FC" 
            />
          </View>
          <View style={styles.titleInfo}>
            <Text style={styles.title}>{schedule.name}</Text>
            <Text style={styles.type}>
              {getScheduleTypeLabel(schedule.scheduleType)}
            </Text>
          </View>
        </View>
        
        <Switch
          value={schedule.isActive}
          onValueChange={(value) => onToggle(schedule.id, value)}
          trackColor={{ false: '#e0e0e0', true: '#8EC5FC' }}
          thumbColor={schedule.isActive ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.time}>{schedule.time}</Text>
        </View>
        
        <Text style={styles.days}>{formatDays(schedule.daysOfWeek)}</Text>
        
        {schedule.description && (
          <Text style={styles.description}>{schedule.description}</Text>
        )}

        {schedule.isActive && (
          <Text style={styles.nextExecution}>{getNextExecution()}</Text>
        )}

        {schedule.duration && (
          <View style={styles.durationContainer}>
            <Ionicons name="timer-outline" size={16} color="#666" />
            <Text style={styles.duration}>Duración: {schedule.duration} min</Text>
          </View>
        )}

        {schedule.intensity && (
          <View style={styles.intensityContainer}>
            <Ionicons name="sunny-outline" size={16} color="#666" />
            <Text style={styles.intensity}>Intensidad: {schedule.intensity}%</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(schedule)}
        >
          <Ionicons name="pencil-outline" size={18} color="#8EC5FC" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color="#dc3545" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  type: {
    fontSize: 14,
    color: '#8EC5FC',
    fontWeight: '500',
  },
  content: {
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  days: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  nextExecution: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  intensity: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#f0f8ff',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
  editButtonText: {
    color: '#8EC5FC',
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButtonText: {
    color: '#dc3545',
    fontWeight: '500',
    marginLeft: 4,
  },
});
