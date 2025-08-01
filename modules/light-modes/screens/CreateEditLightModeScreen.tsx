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
  SequenceStep,
  UpdateLightModeDto,
  lightModeService
} from '../services/lightModeService';

type CreateEditLightModeRouteProp = RouteProp<TabParamList, 'CreateLightMode'> | RouteProp<TabParamList, 'EditLightMode'>;
type CreateEditLightModeNavigationProp = BottomTabNavigationProp<TabParamList>;

export default function CreateEditLightModeScreen() {
  const navigation = useNavigation<CreateEditLightModeNavigationProp>();
  const route = useRoute<CreateEditLightModeRouteProp>();

  const lightModeId = 'params' in route && route.params?.lightModeId;
  const isEditing = !!lightModeId;

  // Estado básico
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [habitatType, setHabitatType] = useState<'terrarium' | 'aquarium' | 'garden' | 'greenhouse'>('terrarium');

  // Estado de secuencia
  const [sequence, setSequence] = useState<SequenceStep[]>([
    {
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
    },
  ]);

  useEffect(() => {
    if (isEditing) {
      loadLightMode();
    }
  }, [isEditing]);

  const loadLightMode = async () => {
    try {
      setLoading(true);
      const response = await lightModeService.getLightModeById(lightModeId as string);

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
        response = await lightModeService.updateLightMode(lightModeId as string, data as UpdateLightModeDto);
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
          <ActivityIndicator size="large" color="#007AFF" />
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
              </Picker>
            </View>
          </View>
        </View>

        {/* Secuencia de Iluminación */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleInHeader}>Secuencia de Iluminación</Text>
            <TouchableOpacity onPress={addSequenceStep} style={styles.addButton}>
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Agregar Paso</Text>
            </TouchableOpacity>
          </View>

          {sequence.map((step, index) => (
            <View key={index} style={styles.sequenceStep}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Paso {index + 1}</Text>
                {sequence.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeSequenceStep(index)} 
                    style={styles.removeButton}
                  >
                    <MaterialIcons name="remove-circle" size={20} color="#dc3545" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Duración */}
              <View style={styles.field}>
                <Text style={styles.label}>Duración (segundos): {step.duration}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={300}
                  value={step.duration}
                  onValueChange={(value) => updateSequenceStep(index, 'duration', Math.round(value))}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#007AFF"
                />
              </View>

              {/* Estado de Encendido */}
              <View style={styles.field}>
                <Text style={styles.label}>Estado</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={step.state.power}
                    onValueChange={(value) => updateSequenceStep(index, 'state.power', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Encendido" value="on" />
                    <Picker.Item label="Apagado" value="off" />
                  </Picker>
                </View>
              </View>

              {step.state.power === 'on' && (
                <>
                  {/* Brillo */}
                  <View style={styles.field}>
                    <Text style={styles.label}>Brillo: {step.state.brightness}%</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={1}
                      maximumValue={100}
                      value={step.state.brightness}
                      onValueChange={(value) => updateSequenceStep(index, 'state.brightness', Math.round(value))}
                      minimumTrackTintColor="#007AFF"
                      maximumTrackTintColor="#ddd"
                      thumbTintColor="#007AFF"
                    />
                  </View>

                  {/* Modo de Color */}
                  <View style={styles.field}>
                    <Text style={styles.label}>Modo de Color</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={step.state.color.mode}
                        onValueChange={(value) => updateSequenceStep(index, 'state.color.mode', value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="RGB" value="rgb" />
                        <Picker.Item label="Temperatura" value="temperature" />
                      </Picker>
                    </View>
                  </View>

                  {step.state.color.mode === 'rgb' ? (
                    <>
                      {/* Color RGB */}
                      <View style={styles.field}>
                        <Text style={styles.label}>Color RGB</Text>
                        <View 
                          style={[
                            styles.colorPreview, 
                            { backgroundColor: `rgb(${step.state.color.rgb.r}, ${step.state.color.rgb.g}, ${step.state.color.rgb.b})` },
                          ]}
                        >
                          <Text style={styles.colorText}>
                            RGB({step.state.color.rgb.r}, {step.state.color.rgb.g}, {step.state.color.rgb.b})
                          </Text>
                        </View>

                        <View style={styles.rgbControls}>
                          <Text style={styles.label}>Rojo: {step.state.color.rgb.r}</Text>
                          <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={255}
                            value={step.state.color.rgb.r}
                            onValueChange={(value) => {
                              const newRgb = { ...step.state.color.rgb, r: Math.round(value) };
                              updateSequenceStep(index, 'state.color.rgb', newRgb);
                            }}
                            minimumTrackTintColor="#ff0000"
                            maximumTrackTintColor="#ddd"
                            thumbTintColor="#ff0000"
                          />

                          <Text style={styles.label}>Verde: {step.state.color.rgb.g}</Text>
                          <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={255}
                            value={step.state.color.rgb.g}
                            onValueChange={(value) => {
                              const newRgb = { ...step.state.color.rgb, g: Math.round(value) };
                              updateSequenceStep(index, 'state.color.rgb', newRgb);
                            }}
                            minimumTrackTintColor="#00ff00"
                            maximumTrackTintColor="#ddd"
                            thumbTintColor="#00ff00"
                          />

                          <Text style={styles.label}>Azul: {step.state.color.rgb.b}</Text>
                          <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={255}
                            value={step.state.color.rgb.b}
                            onValueChange={(value) => {
                              const newRgb = { ...step.state.color.rgb, b: Math.round(value) };
                              updateSequenceStep(index, 'state.color.rgb', newRgb);
                            }}
                            minimumTrackTintColor="#0000ff"
                            maximumTrackTintColor="#ddd"
                            thumbTintColor="#0000ff"
                          />
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      {/* Temperatura de Color */}
                      <View style={styles.field}>
                        <Text style={styles.label}>Temperatura: {step.state.color.temperature}K</Text>
                        <Slider
                          style={styles.slider}
                          minimumValue={2700}
                          maximumValue={6500}
                          value={step.state.color.temperature}
                          onValueChange={(value) => updateSequenceStep(index, 'state.color.temperature', Math.round(value))}
                          minimumTrackTintColor="#FFA500"
                          maximumTrackTintColor="#ddd"
                          thumbTintColor="#FFA500"
                        />
                      </View>
                    </>
                  )}
                </>
              )}

              {/* Transición */}
              <View style={styles.field}>
                <Text style={styles.label}>Tipo de Transición</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={step.transition.type}
                    onValueChange={(value) => updateSequenceStep(index, 'transition.type', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Desvanecimiento" value="fade" />
                    <Picker.Item label="Instantáneo" value="instant" />
                  </Picker>
                </View>
              </View>

              {step.transition.type === 'fade' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Duración de Transición: {step.transition.duration}s</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={30}
                    value={step.transition.duration}
                    onValueChange={(value) => updateSequenceStep(index, 'transition.duration', Math.round(value))}
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#007AFF"
                  />
                </View>
              )}
            </View>
          ))}
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
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitleInHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
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
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
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
  slider: {
    width: '100%',
    height: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 14,
  },
  sequenceStep: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  colorPreview: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 12,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  rgbControls: {
    marginTop: 8,
  },
});
