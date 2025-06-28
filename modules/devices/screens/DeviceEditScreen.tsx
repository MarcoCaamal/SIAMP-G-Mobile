import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Device, deviceService } from '../services/deviceService';

// Define el tipo para los parámetros de la ruta
type DeviceEditRouteParams = {
  deviceId: string;
};

// Define el tipo para los parámetros de navegación
type DeviceEditNavigationProp = StackNavigationProp<any>;

export default function DeviceEditScreen() {
  const navigation = useNavigation<DeviceEditNavigationProp>();
  const route = useRoute<RouteProp<Record<string, DeviceEditRouteParams>, string>>();
  
  const { deviceId } = route.params;
  const [device, setDevice] = useState<Device | null>(null);
  const [name, setName] = useState('');
  const [habitatType, setHabitatType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Lista predefinida de tipos de hábitats
  const habitatTypes = [
    'dormitorio',
    'cocina',
    'sala',
    'comedor',
    'estudio',
    'baño',
    'jardín',
    'garaje',
    'patio',
    'oficina',
    'otro'
  ];

  useEffect(() => {
    // Cargar los datos del dispositivo cuando se monta el componente
    fetchDeviceData();
  }, [deviceId]);

  const fetchDeviceData = async () => {
    try {
      setLoading(true);
      const response = await deviceService.getDevice(deviceId);
      
      if (response._isSuccess && response._value) {
        const deviceData = response._value;
        setDevice(deviceData);
        setName(deviceData.name);
        setHabitatType(deviceData.habitatType || '');
      } else {
        Alert.alert('Error', 'No se pudo cargar la información del dispositivo');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al cargar el dispositivo:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar la información del dispositivo');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validación básica
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del dispositivo es obligatorio');
      return;
    }

    try {
      setSaving(true);
      const updateData = {
        name: name.trim(),
        habitatType: habitatType.trim() || undefined,
      };

      const response = await deviceService.updateDevice(deviceId, updateData);
      
      if (response._isSuccess) {
        Alert.alert('Éxito', 'La información del dispositivo se ha actualizado correctamente', [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]);
      } else {
        Alert.alert('Error', response._error || 'No se pudo actualizar la información del dispositivo');
      }
    } catch (error) {
      console.error('Error al actualizar el dispositivo:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar la información del dispositivo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#130065" />
        <Text style={styles.loadingText}>Cargando información del dispositivo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Dispositivo</Text>
          <Text style={styles.headerSubtitle}>
            Modifica los detalles del dispositivo
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre del dispositivo</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ingrese un nombre para el dispositivo"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de hábitat</Text>
            <TextInput
              style={styles.input}
              value={habitatType}
              onChangeText={setHabitatType}
              placeholder="Seleccione o ingrese el tipo de hábitat"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.habitatTypesContainer}>
            <Text style={styles.habitatTypesTitle}>Tipos de hábitat sugeridos:</Text>
            <View style={styles.habitatTypesList}>
              {habitatTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.habitatTypeChip,
                    habitatType === type && styles.selectedHabitatType
                  ]}
                  onPress={() => setHabitatType(type)}
                >
                  <Text
                    style={[
                      styles.habitatTypeText,
                      habitatType === type && styles.selectedHabitatTypeText
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.deviceDetails}>
            <Text style={styles.deviceDetailsTitle}>Información del dispositivo</Text>
            <Text style={styles.deviceDetailsText}>ID: {device?.deviceId}</Text>
            <Text style={styles.deviceDetailsText}>Modelo: {device?.model}</Text>
            <Text style={styles.deviceDetailsText}>Versión firmware: {device?.firmwareVersion}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar</Text>
              )}
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
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
  formContainer: {
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  habitatTypesContainer: {
    marginBottom: 20,
  },
  habitatTypesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  habitatTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitatTypeChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedHabitatType: {
    backgroundColor: '#130065',
  },
  habitatTypeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedHabitatTypeText: {
    color: '#fff',
  },
  deviceDetails: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  deviceDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  deviceDetailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#130065',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
