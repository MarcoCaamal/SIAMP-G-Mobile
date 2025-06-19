import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
          <TouchableOpacity style={styles.deviceCreateCard}>
            <Text style={styles.deviceCreateName}>Agregar Dispositivo+</Text>
          </TouchableOpacity>

          <View style={styles.deviceCard}>
            <Text style={styles.deviceName}>Dispositivo 1</Text>
            <Text style={styles.deviceStatus}>Estado: Conectado</Text>
            <Text style={styles.deviceInfo}>Última conexión: 2023-10-01</Text>
            <View style={styles.actionGrid}>
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Controlar</Text>
                <Text style={styles.actionSubtitle}>Encender / Apagar</Text>
              </View>
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Eliminar</Text>
                <Text style={styles.actionSubtitle}>Eliminar dispositivo</Text>
              </View>
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
  deviceCreateCard: {
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
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    color: '#bebebe',
  },
  deviceCreateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#130065',
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
