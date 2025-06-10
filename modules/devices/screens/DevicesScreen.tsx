import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DevicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dispositivos</Text>
          <Text style={styles.headerSubtitle}>Gestiona tus dispositivos conectados</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos Conectados</Text>
          <View style={styles.deviceCard}>
            <Text style={styles.deviceName}>SIAMP-G Sensor #001</Text>
            <Text style={styles.deviceStatus}>Estado: Conectado</Text>
            <Text style={styles.deviceInfo}>Última actualización: Hace 5 min</Text>
          </View>
          
          <View style={styles.deviceCard}>
            <Text style={styles.deviceName}>SIAMP-G Sensor #002</Text>
            <Text style={styles.deviceStatus}>Estado: Desconectado</Text>
            <Text style={styles.deviceInfo}>Última actualización: Hace 2 horas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionGrid}>
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Buscar Dispositivos</Text>
              <Text style={styles.actionSubtitle}>Escanear nuevos dispositivos</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Configurar WiFi</Text>
              <Text style={styles.actionSubtitle}>Configurar conexión</Text>
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
  deviceCard: {
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
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 4,
  },
  deviceInfo: {
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
