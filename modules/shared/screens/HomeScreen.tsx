import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>¡Bienvenido a SIAMP-G!</Text>
          <Text style={styles.headerSubtitle}>Sistema Inteligente de Automatización y Monitoreo para Plantas</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Dispositivos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Programaciones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Días Activo</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del Sistema</Text>
          <View style={styles.systemCard}>
            <View style={styles.systemStatus}>
              <View style={[styles.statusDot, styles.statusOnline]}></View>
              <Text style={styles.systemStatusText}>Sistema Operativo</Text>
            </View>
            <Text style={styles.systemInfo}>Última actualización: Hace 2 minutos</Text>
            <Text style={styles.systemInfo}>Próximo riego: Hoy 18:00 PM</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          
          <View style={styles.activityCard}>
            <Text style={styles.activityTime}>15:30</Text>
            <Text style={styles.activityText}>Riego automático completado</Text>
            <Text style={styles.activityDetail}>Sensor #001 - 15 minutos</Text>
          </View>
          
          <View style={styles.activityCard}>
            <Text style={styles.activityTime}>12:00</Text>
            <Text style={styles.activityText}>Datos de humedad sincronizados</Text>
            <Text style={styles.activityDetail}>Todos los sensores</Text>
          </View>
          
          <View style={styles.activityCard}>
            <Text style={styles.activityTime}>09:45</Text>
            <Text style={styles.activityText}>Dispositivo conectado</Text>
            <Text style={styles.activityDetail}>Sensor #002</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.quickActions}>
            <View style={styles.actionButton}>
              <Text style={styles.actionText}>Riego Manual</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionText}>Ver Sensores</Text>
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130065',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#8EC5FC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
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
  systemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusOnline: {
    backgroundColor: '#28a745',
  },
  systemStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  systemInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8EC5FC',
  },
  activityTime: {
    fontSize: 12,
    color: '#8EC5FC',
    fontWeight: '600',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#8EC5FC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
