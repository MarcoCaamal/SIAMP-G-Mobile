import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleCard } from '../components/ScheduleCard';
import { ScheduleForm } from '../components/ScheduleForm';
import { useSchedules } from '../hooks/useSchedules';
import { CreateScheduleRequest, Schedule, UpdateScheduleRequest } from '../types/schedule.types';

// Mock devices - En una app real, esto vendría de un hook o contexto
const mockDevices = [
  { id: '507f1f77bcf86cd799439011', name: 'Acuario Principal' },
  { id: '507f1f77bcf86cd799439012', name: 'Terrario Tropical' },
  { id: '507f1f77bcf86cd799439013', name: 'Pecera Secundaria' },
];

export default function ScheduleScreen() {
  const {
    schedules,
    loading,
    error,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    toggleScheduleStatus,
    deleteSchedule,
  } = useSchedules();

  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchedules();
    setRefreshing(false);
  };

  const handleCreateSchedule = () => {
    setEditingSchedule(undefined);
    setShowForm(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: CreateScheduleRequest | UpdateScheduleRequest) => {
    let success = false;
    
    if (editingSchedule) {
      success = await updateSchedule(editingSchedule.id, data as UpdateScheduleRequest);
    } else {
      success = await createSchedule(data as CreateScheduleRequest);
    }
    
    return success;
  };

  const handleToggleSchedule = async (id: string, activate: boolean) => {
    await toggleScheduleStatus(id, activate);
  };

  const handleDeleteSchedule = async (id: string) => {
    await deleteSchedule(id);
  };

  const handleViewHistory = () => {
    Alert.alert(
      'Historial de Programaciones',
      'Esta función estará disponible próximamente. Podrás ver el historial completo de ejecuciones y estadísticas de tus programaciones.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const getActiveSchedules = () => schedules.filter(s => s.isActive);
  const getInactiveSchedules = () => schedules.filter(s => !s.isActive);

  const getNextSchedule = () => {
    const activeSchedules = getActiveSchedules();
    if (activeSchedules.length === 0) return null;
    
    // Por simplicidad, retornamos el primero
    // En una implementación real, calcularíamos el próximo en ejecutarse
    return activeSchedules[0];
  };

  if (loading && schedules.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8EC5FC" />
          <Text style={styles.loadingText}>Cargando programaciones...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8EC5FC']}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Programaciones</Text>
            <Text style={styles.headerSubtitle}>
              Gestiona tus horarios automatizados
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateSchedule}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={24} color="#dc3545" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchSchedules}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Próxima programación */}
        {getNextSchedule() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próxima Activación</Text>
            <View style={styles.nextScheduleCard}>
              <View style={styles.nextScheduleHeader}>
                <Ionicons name="time-outline" size={20} color="#8EC5FC" />
                <Text style={styles.nextScheduleTime}>
                  Hoy - {getNextSchedule()!.time}
                </Text>
              </View>
              <Text style={styles.nextScheduleName}>
                {getNextSchedule()!.name}
              </Text>
              <Text style={styles.nextScheduleCountdown}>
                En 2 horas 30 minutos
              </Text>
            </View>
          </View>
        )}

        {/* Programaciones activas */}
        {getActiveSchedules().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Programaciones Activas ({getActiveSchedules().length})
            </Text>
            
            {getActiveSchedules().map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggle={handleToggleSchedule}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))}
          </View>
        )}

        {/* Programaciones inactivas */}
        {getInactiveSchedules().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Programaciones Inactivas ({getInactiveSchedules().length})
            </Text>
            
            {getInactiveSchedules().map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggle={handleToggleSchedule}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))}
          </View>
        )}

        {/* Estado vacío */}
        {schedules.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay programaciones</Text>
            <Text style={styles.emptyText}>
              Crea tu primera programación automática para gestionar tus dispositivos
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleCreateSchedule}
            >
              <Text style={styles.emptyButtonText}>Crear Programación</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Acciones rápidas */}
        {schedules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleCreateSchedule}
              >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.actionTitle}>Nueva Programación</Text>
                <Text style={styles.actionSubtitle}>Crear horario</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleViewHistory}
              >
                <Ionicons name="analytics-outline" size={24} color="#fff" />
                <Text style={styles.actionTitle}>Historial</Text>
                <Text style={styles.actionSubtitle}>Próximamente</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal del formulario */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ScheduleForm
          schedule={editingSchedule}
          devices={mockDevices}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#130065',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8EC5FC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#dc3545',
    marginLeft: 12,
    marginRight: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#8EC5FC',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  nextScheduleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8EC5FC',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextScheduleTime: {
    fontSize: 16,
    color: '#8EC5FC',
    fontWeight: '600',
    marginLeft: 8,
  },
  nextScheduleName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  nextScheduleCountdown: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#8EC5FC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusInactive: {
    backgroundColor: '#6c757d',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  statusInactiveText: {
    color: '#fff',
  },
  scheduleTime: {
    fontSize: 16,
    color: '#8EC5FC',
    fontWeight: '500',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#666',
  },
  upcomingCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8EC5FC',
  },
  upcomingTime: {
    fontSize: 14,
    color: '#8EC5FC',
    fontWeight: '600',
  },
  upcomingName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  upcomingCountdown: {
    fontSize: 12,
    color: '#666',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#8EC5FC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});
