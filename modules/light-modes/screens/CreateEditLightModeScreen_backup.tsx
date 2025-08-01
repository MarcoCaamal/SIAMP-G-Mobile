import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabParamList } from '../../../navigation/TabNavigator';
import {
  CreateLightModeDto,
  RGBColor,
  SequenceStep,
  UpdateLightModeDto,
  lightModeService
} from '../services/lightModeService';

type CreateEditLightModeRouteProp = RouteProp<TabParamList, 'CreateLightMode'> | RouteProp<TabParamList, 'EditLightMode'>;

export default function CreateEditLightModeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const route = useRoute<CreateEditLightModeRouteProp>();
  const lightModeId = (route.params as any)?.lightModeId;
  const isEditing = !!lightModeId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [habitatType, setHabitatType] = useState<'terrarium' | 'aquarium' | 'garden' | 'greenhouse'>('terrarium');
  
  // Sequence steps state
  const [sequence, setSequence] = useState<SequenceStep[]>([
    {
      duration: 30,
      state: {
        power: 'on',
        brightness: 75,
        color: {
          mode: 'rgb',
          rgb: { r: 255, g: 255, b: 255 },
          temperature: 5500,
        },
      },
      transition: {
        type: 'fade',
        duration: 2,
      },
    },
  ]);

  // Load existing light mode if editing
  useEffect(() => {
    if (isEditing && lightModeId) {
      loadLightMode();
    }
  }, [isEditing, lightModeId]);

  const loadLightMode = async () => {
    try {
      setLoading(true);
      const response = await lightModeService.getLightModeById(lightModeId!);

      if (response._isSuccess && response._value) {
        const lightMode = response._value;
        setName(lightMode.name);
        setDescription(lightMode.description || '');
        setHabitatType(lightMode.habitatType);
        
        // Load sequence steps
        if (lightMode.sequence && lightMode.sequence.length > 0) {
          setSequence(lightMode.sequence);
        }
      } else {
        Alert.alert('Error', response._error || 'No se pudo cargar el modo de iluminación');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al cargar modo:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar el modo de iluminación');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (sequence.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos un paso en la secuencia');
      return;
    }

    try {
      setSaving(true);

      const data: CreateLightModeDto | UpdateLightModeDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        habitatType,
        sequence,
      };

      let response;
      if (isEditing) {
        response = await lightModeService.updateLightMode(lightModeId!, data as UpdateLightModeDto);
      } else {
        response = await lightModeService.createLightMode(data as CreateLightModeDto);
      }

      if (response._isSuccess) {
        Alert.alert(
          'Éxito',
          `El modo de iluminación ha sido ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', response._error || 'No se pudo guardar el modo de iluminación');
      }
    } catch (error) {
      console.error('Error al guardar modo:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el modo de iluminación');
    } finally {
      setSaving(false);
    }
  };

  const addSequenceStep = () => {
    const newStep: SequenceStep = {
      duration: 30,
      state: {
        power: 'on',
        brightness: 100,
        color: {
          mode: 'rgb',
          rgb: { r: 255, g: 255, b: 255 },
          temperature: 6500,
        },
      },
      transition: {
        type: 'fade',
        duration: 5,
      },
    };
    setSequence([...sequence, newStep]);
  };

  const removeSequenceStep = (index: number) => {
    if (sequence.length > 1) {
      setSequence(sequence.filter((_, i) => i !== index));
    }
  };

  const updateSequenceStep = (index: number, field: string, value: any) => {
    const updated = [...sequence];
    const step = updated[index];
    
    if (field === 'duration') {
      step.duration = value;
    } else if (field === 'state.power') {
      step.state.power = value;
    } else if (field === 'state.brightness') {
      step.state.brightness = value;
    } else if (field === 'state.color.mode') {
      step.state.color.mode = value;
    } else if (field === 'state.color.rgb') {
      step.state.color.rgb = value;
    } else if (field === 'state.color.temperature') {
      step.state.color.temperature = value;
    } else if (field === 'transition.type') {
      step.transition.type = value;
    } else if (field === 'transition.duration') {
      step.transition.duration = value;
    }
    
    setSequence(updated);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#336075" />
          <Text style={styles.loadingText}>Cargando modo de iluminación...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Modo' : 'Crear Modo'}
        </Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre del modo de iluminación"
              maxLength={50}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción opcional"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tipo de Hábitat</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={habitatType}
                onValueChange={setHabitatType}
                style={styles.picker}
              >
                <Picker.Item label="Terrario" value="terrarium" />
                <Picker.Item label="Acuario" value="aquarium" />
                <Picker.Item label="Jardín" value="garden" />
                <Picker.Item label="Invernadero" value="greenhouse" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Configuración de color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          
          <View style={styles.colorPreviewContainer}>
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` },
              ]}
            />
            <Text style={styles.colorText}>
              RGB({color.r}, {color.g}, {color.b})
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Rojo: {color.r}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={255}
              value={color.r}
              onValueChange={(value) => setColor({ ...color, r: Math.round(value) })}
              minimumTrackTintColor="#ff6b6b"
              maximumTrackTintColor="#ddd"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Verde: {color.g}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={255}
              value={color.g}
              onValueChange={(value) => setColor({ ...color, g: Math.round(value) })}
              minimumTrackTintColor="#51cf66"
              maximumTrackTintColor="#ddd"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Azul: {color.b}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={255}
              value={color.b}
              onValueChange={(value) => setColor({ ...color, b: Math.round(value) })}
              minimumTrackTintColor="#339af0"
              maximumTrackTintColor="#ddd"
            />
          </View>
        </View>

        {/* Brillo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brillo</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Brillo: {brightness}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={brightness}
              onValueChange={(value) => setBrightness(Math.round(value))}
              minimumTrackTintColor="#336075"
              maximumTrackTintColor="#ddd"
            />
          </View>
        </View>

        {/* Configuración de Secuencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de Secuencia</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Estado</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={power}
                onValueChange={setPower}
                style={styles.picker}
              >
                <Picker.Item label="Encendido" value="on" />
                <Picker.Item label="Apagado" value="off" />
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Modo de Color</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={colorMode}
                onValueChange={setColorMode}
                style={styles.picker}
              >
                <Picker.Item label="RGB" value="rgb" />
                <Picker.Item label="Temperatura" value="temperature" />
              </Picker>
            </View>
          </View>

          {colorMode === 'temperature' && (
            <View style={styles.field}>
              <Text style={styles.label}>Temperatura: {temperature}K</Text>
              <Slider
                style={styles.slider}
                minimumValue={2700}
                maximumValue={6500}
                value={temperature}
                onValueChange={(value) => setTemperature(Math.round(value))}
                minimumTrackTintColor="#336075"
                maximumTrackTintColor="#ddd"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Duración: {duration} segundos</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={300}
              value={duration}
              onValueChange={(value) => setDuration(Math.round(value))}
              minimumTrackTintColor="#336075"
              maximumTrackTintColor="#ddd"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tipo de Transición</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={transitionType}
                onValueChange={setTransitionType}
                style={styles.picker}
              >
                <Picker.Item label="Fundido" value="fade" />
                <Picker.Item label="Instantáneo" value="instant" />
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Duración de Transición: {transitionDuration} segundos</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              value={transitionDuration}
              onValueChange={(value) => setTransitionDuration(Math.round(value))}
              minimumTrackTintColor="#336075"
              maximumTrackTintColor="#ddd"
            />
          </View>
        </View>

        {/* Programación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programación</Text>
          
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setScheduleEnabled(!scheduleEnabled)}
          >
            <Text style={styles.toggleLabel}>Habilitar programación</Text>
            <MaterialIcons
              name={scheduleEnabled ? 'toggle-on' : 'toggle-off'}
              size={24}
              color={scheduleEnabled ? '#336075' : '#ccc'}
            />
          </TouchableOpacity>

          {scheduleEnabled && (
            <>
              <View style={styles.timeRangesHeader}>
                <Text style={styles.label}>Horarios</Text>
                <TouchableOpacity onPress={addTimeRange} style={styles.addButton}>
                  <MaterialIcons name="add" size={20} color="#336075" />
                  <Text style={styles.addButtonText}>Agregar Horario</Text>
                </TouchableOpacity>
              </View>

              {timeRanges.map((timeRange, index) => (
                <View key={index} style={styles.timeRangeCard}>
                  <View style={styles.timeRangeHeader}>
                    <Text style={styles.timeRangeTitle}>Horario {index + 1}</Text>
                    <TouchableOpacity
                      onPress={() => removeTimeRange(index)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.timeRow}>
                    <View style={styles.timeField}>
                      <Text style={styles.timeLabel}>Inicio</Text>
                      <View style={styles.timeInputs}>
                        <TextInput
                          style={styles.timeInput}
                          value={timeRange.start.hour.toString().padStart(2, '0')}
                          onChangeText={(text) => {
                            const hour = Math.min(23, Math.max(0, parseInt(text) || 0));
                            updateTimeRange(index, 'start', { ...timeRange.start, hour });
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                        <Text>:</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={timeRange.start.minute.toString().padStart(2, '0')}
                          onChangeText={(text) => {
                            const minute = Math.min(59, Math.max(0, parseInt(text) || 0));
                            updateTimeRange(index, 'start', { ...timeRange.start, minute });
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                    </View>

                    <View style={styles.timeField}>
                      <Text style={styles.timeLabel}>Fin</Text>
                      <View style={styles.timeInputs}>
                        <TextInput
                          style={styles.timeInput}
                          value={timeRange.end.hour.toString().padStart(2, '0')}
                          onChangeText={(text) => {
                            const hour = Math.min(23, Math.max(0, parseInt(text) || 0));
                            updateTimeRange(index, 'end', { ...timeRange.end, hour });
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                        <Text>:</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={timeRange.end.minute.toString().padStart(2, '0')}
                          onChangeText={(text) => {
                            const minute = Math.min(59, Math.max(0, parseInt(text) || 0));
                            updateTimeRange(index, 'end', { ...timeRange.end, minute });
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#336075',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
  },
  colorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  slider: {
    height: 40,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeRangesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#336075',
    fontWeight: '500',
  },
  timeRangeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  timeRangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeRangeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timeField: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
    textAlign: 'center',
    width: 40,
    backgroundColor: '#fff',
  },
});
