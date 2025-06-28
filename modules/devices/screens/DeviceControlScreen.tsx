import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// Temporalmente usar el slider de React Native en lugar del paquete que podría no estar instalado
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPicker from 'react-native-wheel-color-picker';
import { TabParamList } from '../../../navigation/TabNavigator';
import { Device, DeviceControlRequest, deviceService, RGBColor } from '../services/deviceService';

type DeviceControlScreenRouteProp = RouteProp<TabParamList, 'DeviceControl'>;
type DeviceControlNavigationProp = StackNavigationProp<TabParamList>;

// Ya no usamos colores predefinidos, ahora utilizamos el ColorPicker

export default function DeviceControlScreen() {
  const navigation = useNavigation<DeviceControlNavigationProp>();
  const route = useRoute<DeviceControlScreenRouteProp>();
  // Acceder de forma segura a deviceId con valor por defecto en caso de que sea undefined
  const deviceId = route.params?.deviceId || '';

  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<Device | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [selectedColor, setSelectedColor] = useState<RGBColor>({ r: 255, g: 255, b: 255 });
  const [savingChanges, setSavingChanges] = useState(false);

  // Cargar información del dispositivo
  useEffect(() => {
    fetchDevice();
  }, [deviceId]);
  const fetchDevice = async () => {
    console.log('Cargando dispositivo con ID:', deviceId);
    if (!deviceId) {
      setLoading(false);
      Alert.alert('Error', 'ID de dispositivo no válido', [
        { text: 'Volver', onPress: () => navigation.goBack() }
      ]);
      return;
    }

    setLoading(true);
    try {
      const response = await deviceService.getDevice(deviceId);
      console.log('Respuesta del servidor al cargar dispositivo:', response);
      if (response._isSuccess && response._value) {
        const deviceData = response._value;
        setDevice(deviceData);

        // Acceder de forma segura a las propiedades
        const status = deviceData.status || {};
        const colorInfo = status.color || { mode: 'rgb', rgb: { r: 255, g: 255, b: 255 } };

        setIsOn(status.currentState === 'on');
        setBrightness(status.brightness || 50);
        setSelectedColor(colorInfo.rgb || { r: 255, g: 255, b: 255 });
      } else {
        Alert.alert('Error', 'No se pudo cargar la información del dispositivo');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al cargar dispositivo:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar información del dispositivo', [
        { text: 'Volver', onPress: () => navigation.goBack() }
      ]);
    }
    setLoading(false);
  };

  const handleTogglePower = async (value: boolean) => {
    setIsOn(value);
    await controlDevice({ on: value });
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
  };

  const handleBrightnessChangeComplete = async (value: number) => {
    await controlDevice({ brightness: Math.round(value) });
  };

  // Función para convertir hex a RGB
  const hexToRgb = (hex: string): RGBColor => {
    // Eliminar # si está presente
    hex = hex.replace('#', '');

    // Convertir a RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  // Función para convertir RGB a hex
  const rgbToHex = (color: RGBColor): string => {
    const toHex = (value: number): string => {
      const hex = Math.round(value).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  };

  // Manejador del cambio de color desde el color picker
  const onColorChangeComplete = useCallback((colorHex: string) => {
    const rgbColor = hexToRgb(colorHex);
    console.log('Color seleccionado:', rgbColor);
    setSelectedColor(rgbColor);
    controlDevice({
      color: {
        mode: 'rgb',
        rgb: rgbColor
      }
    });
  }, []);

  const controlDevice = async (controlData: DeviceControlRequest) => {
    if (!deviceId) {
      Alert.alert('Error', 'ID de dispositivo no válido');
      return;
    }
    console.log('Controlando dispositivo con ID:', deviceId, 'con datos:', controlData);
    console.log('Estado actual:', loading, savingChanges);

    // Solo actualizamos UI si el dispositivo no está cargando ni guardando
    if (loading || savingChanges) return;
    


    console.log('Controlando dispositivo con datos:', controlData);
    console.log('Estado actual:', { isOn, brightness, selectedColor });

    setSavingChanges(true);
    try {
      // Para mejorar la experiencia, optimismo UI: actualizar inmediatamente, luego revertir si falla
      if (controlData.on !== undefined) setIsOn(controlData.on);
      if (controlData.brightness !== undefined) setBrightness(controlData.brightness);
      if (controlData.color?.rgb) setSelectedColor(controlData.color.rgb);

      const response = await deviceService.controlDevice(deviceId, controlData);
      console.log('Respuesta del servidor al controlar dispositivo:', response);
      if (response._isSuccess && response._value?.success) {
        // Actualizar estados con la respuesta real del servidor solo para los valores modificados
        if (response._value.deviceStatus) {
          const status = response._value.deviceStatus;

          // Solo actualizar el estado de encendido si se envió explícitamente en la solicitud
          if (controlData.on !== undefined) {
            setIsOn(status.currentState === 'on');
          }

          // Solo actualizar el brillo si se envió en la solicitud
          if (controlData.brightness !== undefined) {
            // Si el brillo explícitamente se estableció en 0, mantenerlo en 0
            setBrightness(controlData.brightness === 0 ? 0 : (status.brightness || 50));
          }

          // Solo actualizar el color si se envió en la solicitud
          if (controlData.color?.rgb && status.color?.rgb) {
            setSelectedColor(status.color.rgb);
          }
        }
      } else {
        // Revertir los cambios optimistas si hubo error
        // y mostrar mensaje de error
        fetchDevice(); // Recargar el estado actual del dispositivo
        Alert.alert('Error', 'No se pudo controlar el dispositivo');
      }
    } catch (error) {
      console.error('Error al controlar dispositivo:', error);
      // Recargar datos para asegurar consistencia
      fetchDevice();
      Alert.alert('Error', 'Ocurrió un error al controlar el dispositivo');
    }
    setSavingChanges(false);
  };

  // Ya no necesitamos renderizar botones de colores individuales

  // Ya no necesitamos la función isBrightColor

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#130065" />
        <Text style={styles.loadingText}>Cargando información del dispositivo...</Text>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el dispositivo</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#130065" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{device.name}</Text>
          {savingChanges && (
            <ActivityIndicator size="small" color="#130065" style={styles.savingIndicator} />
          )}
        </View>

        <View style={styles.deviceImageContainer}>
          <View style={[styles.devicePreview, { backgroundColor: isOn ? `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${brightness / 100})` : '#333' }]}>
            <MaterialIcons name="lightbulb" size={60} color={isOn ? "#FFF" : "#555"} />
          </View>
        </View>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Encender / Apagar</Text>
          <View style={styles.powerControl}>
            <Text style={styles.controlLabel}>Estado</Text>
            <Switch
              value={isOn}
              onValueChange={handleTogglePower}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isOn ? '#130065' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
            <Text style={styles.controlValue}>{isOn ? 'Encendido' : 'Apagado'}</Text>
          </View>
        </View>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Brillo</Text>
          <View style={styles.sliderContainer}>
            <MaterialIcons name="brightness-low" size={24} color="#666" />
            <View style={styles.slider}>
              <View style={styles.brightnessButtons}>
                <TouchableOpacity
                  style={[styles.brightnessButton, !isOn && styles.disabledButton]}
                  onPress={() => {
                    if (isOn && brightness > 0) {
                      const newBrightness = Math.max(0, brightness - 10);
                      handleBrightnessChange(newBrightness);
                      handleBrightnessChangeComplete(newBrightness);
                    }
                  }}
                  disabled={!isOn}
                >
                  <Text style={styles.brightnessButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.brightnessValue}>{Math.round(brightness)}%</Text>
                <TouchableOpacity
                  style={[styles.brightnessButton, !isOn && styles.disabledButton]}
                  onPress={() => {
                    if (isOn && brightness < 100) {
                      const newBrightness = Math.min(100, brightness + 10);
                      handleBrightnessChange(newBrightness);
                      handleBrightnessChangeComplete(newBrightness);
                    }
                  }}
                  disabled={!isOn}
                >
                  <Text style={styles.brightnessButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <MaterialIcons name="brightness-high" size={24} color="#666" />
          </View>
        </View>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Colores</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={rgbToHex(selectedColor)}
              onColorChangeComplete={onColorChangeComplete}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
              disabled={!isOn}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información del dispositivo</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{device.deviceId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Modelo:</Text>
            <Text style={styles.infoValue}>{device.model}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Firmware:</Text>
            <Text style={styles.infoValue}>{device.firmwareVersion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ubicación:</Text>
            <Text style={styles.infoValue}>{device.habitatType || 'No especificada'}</Text>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130065',
    flex: 1,
    marginLeft: 12,
  },
  savingIndicator: {
    marginLeft: 8,
  },
  deviceImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  devicePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  controlSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  powerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    fontSize: 16,
    color: '#555',
  },
  controlValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  }, slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  brightnessValue: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
  },
  brightnessButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  brightnessButton: {
    width: 40,
    height: 40,
    backgroundColor: '#130065',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brightnessButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  colorPickerContainer: {
    height: 220,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#130065',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
