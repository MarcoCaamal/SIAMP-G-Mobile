import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Programaciones</Text>
          <Text style={styles.headerSubtitle}>Gestiona tus horarios automatizados</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programaciones Activas</Text>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleName}>Riego Matutino</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Activo</Text>
              </View>
            </View>
            <Text style={styles.scheduleTime}>06:00 AM - Todos los días</Text>
            <Text style={styles.scheduleDescription}>Riego automático por 15 minutos</Text>
          </View>

          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleName}>Riego Vespertino</Text>
              <View style={[styles.statusBadge, styles.statusInactive]}>
                <Text style={[styles.statusText, styles.statusInactiveText]}>Inactivo</Text>
              </View>
            </View>
            <Text style={styles.scheduleTime}>18:00 PM - Lun, Mie, Vie</Text>
            <Text style={styles.scheduleDescription}>Riego automático por 10 minutos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Activaciones</Text>
          
          <View style={styles.upcomingCard}>
            <Text style={styles.upcomingTime}>Hoy - 18:00 PM</Text>
            <Text style={styles.upcomingName}>Riego Vespertino</Text>
            <Text style={styles.upcomingCountdown}>En 2 horas 30 minutos</Text>
          </View>

          <View style={styles.upcomingCard}>
            <Text style={styles.upcomingTime}>Mañana - 06:00 AM</Text>
            <Text style={styles.upcomingName}>Riego Matutino</Text>
            <Text style={styles.upcomingCountdown}>En 14 horas 30 minutos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionGrid}>
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Nueva Programación</Text>
              <Text style={styles.actionSubtitle}>Crear horario</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Historial</Text>
              <Text style={styles.actionSubtitle}>Ver actividades</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});
