import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabParamList } from '../../../navigation/TabNavigator';
import { Device, deviceService } from '../services/deviceService';

export default function DevicesScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState({ total: 0, connectedCount: 0, disconnectedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await deviceService.getDevices();

      if (response._isSuccess && response._value) {
        setDevices(response._value.devices);
        setStats({
          total: response._value.total,
          connectedCount: response._value.connectedCount,
          disconnectedCount: response._value.disconnectedCount
        });
      } else {
        Alert.alert('Error', 'No se pudieron cargar los dispositivos');
      }
    } catch (error) {
      console.error('Error al cargar dispositivos:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar los dispositivos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDevices();
  };

  const onAddDevice = () => {
    navigation.navigate('WifiScan');
  }
  
  // Función para manejar la eliminación de dispositivos
  const handleDeleteDevice = (device: Device) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro que desea eliminar el dispositivo "${device.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await deviceService.deleteDevice(device.deviceId);
              
              if (response._isSuccess) {
                Alert.alert('Éxito', 'El dispositivo ha sido eliminado con éxito');
                fetchDevices(); // Refrescar la lista de dispositivos
              } else {
                Alert.alert('Error', response._error || 'No se pudo eliminar el dispositivo');
                setLoading(false);
              }
            } catch (error) {
              console.error('Error al eliminar dispositivo:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar el dispositivo');
              setLoading(false);
            }
          }
        }
      ]
    );
  }
  // Función para formatear la fecha
  const formatDate = (dateString: Date | string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy HH:mm", { locale: es });
    } catch (error) {
      return "Fecha desconocida";
    }
  };

  // Función para determinar el color del estado
  const getStatusColor = (device: Device) => {
    if (!device.status.isConnected) return '#dc3545'; // Rojo para desconectado
    return device.status.currentState === 'on' ? '#28a745' : '#ffc107'; // Verde para encendido, amarillo para apagado pero conectado
  };

  // Función para renderizar un dispositivo
  const renderDevice = (device: Device) => {
    return (
      <View key={device.id} style={styles.deviceCard}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={[
          styles.deviceStatus,
          { color: getStatusColor(device) }
        ]}>
          Estado: {device.status.isConnected ?
            (device.status.currentState === 'on' ? 'Encendido' : 'Apagado') :
            'Desconectado'}
        </Text>
        <Text style={styles.deviceInfo}>
          Última conexión: {formatDate(device.status.lastConnectedAt)}
        </Text>
        {device.status.isConnected && (
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceDetailText}>Brillo: {device.status.brightness}%</Text>
            <Text style={styles.deviceDetailText}>
              Color RGB: ({device.status.color.rgb.r}, {device.status.color.rgb.g}, {device.status.color.rgb.b})
            </Text>
            <Text style={styles.deviceDetailText}>
              Tipo de hábitat: {device.habitatType || 'No especificado'}
            </Text>
          </View>
        )}        
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('DeviceControl', { deviceId: device.deviceId })}
          >
            <Text style={styles.actionTitle}>Controlar</Text>
            <Text style={styles.actionSubtitle}>Encender / Apagar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCard, styles.editAction]}
            onPress={() => navigation.navigate('DeviceEdit', { deviceId: device.deviceId })}
          >
            <Text style={styles.actionTitle}>Editar</Text>
            <Text style={styles.actionSubtitle}>Modificar detalles</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCard, styles.deleteAction]}
            onPress={() => handleDeleteDevice(device)}
          >
            <Text style={styles.actionTitle}>Eliminar</Text>
            <Text style={styles.actionSubtitle}>Eliminar dispositivo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#130065']}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dispositivos</Text>
          <Text style={styles.headerSubtitle}>
            Gestiona tus dispositivos conectados ({stats.connectedCount} conectados, {stats.disconnectedCount} desconectados)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos ({stats.total})</Text>

          <TouchableOpacity style={styles.deviceCreateCard} onPress={onAddDevice}>
            <Text style={styles.deviceCreateName}>Agregar Dispositivo+</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#130065" />
              <Text style={styles.loadingText}>Cargando dispositivos...</Text>
            </View>
          ) : devices.length > 0 ? (
            devices.map(renderDevice)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes dispositivos registrados</Text>
              <Text style={styles.emptySubtext}>Toca "Agregar Dispositivo+" para comenzar</Text>
            </View>
          )}
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
    marginBottom: 8,
  },
  deviceDetails: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  deviceDetailText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#8EC5FC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: '#ff4757',
  },
  editAction: {
    backgroundColor: '#2196F3',
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
