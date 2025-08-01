import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    CreateScheduleRequest,
    DayOfWeek,
    getDayLabel,
    getScheduleTypeLabel,
    Schedule,
    ScheduleType,
    UpdateScheduleRequest,
} from '../types/schedule.types';

interface ScheduleFormProps {
  schedule?: Schedule;
  devices: Array<{ id: string; name: string }>;
  onSubmit: (data: CreateScheduleRequest | UpdateScheduleRequest) => Promise<boolean>;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  devices,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: schedule?.name || '',
    description: schedule?.description || '',
    deviceId: schedule?.deviceId || (devices[0]?.id || ''),
    scheduleType: schedule?.scheduleType || ScheduleType.LIGHTING,
    time: schedule?.time || '09:00',
    daysOfWeek: schedule?.daysOfWeek || [DayOfWeek.MONDAY],
    intensity: schedule?.intensity || 75,
    color: schedule?.color || '#ffffff',
    duration: schedule?.duration || 30,
    isActive: schedule?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const allDays = Object.values(DayOfWeek);
  const allTypes = Object.values(ScheduleType);

  const toggleDay = (day: DayOfWeek) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const selectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: formData.daysOfWeek.length === allDays.length ? [] : allDays
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (formData.daysOfWeek.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un día');
      return;
    }

    // Validar formato de hora
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.time)) {
      Alert.alert('Error', 'Formato de hora inválido (use HH:MM)');
      return;
    }

    try {
      setLoading(true);
      const submitData = schedule
        ? { ...formData }
        : {
            name: formData.name,
            description: formData.description || undefined,
            deviceId: formData.deviceId,
            scheduleType: formData.scheduleType,
            time: formData.time,
            daysOfWeek: formData.daysOfWeek,
            intensity: formData.scheduleType === ScheduleType.LIGHTING ? formData.intensity : undefined,
            color: formData.scheduleType === ScheduleType.LIGHTING ? formData.color : undefined,
            duration: formData.duration,
          };

      const success = await onSubmit(submitData as any);
      if (success) {
        onCancel();
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar la programación');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDevice = () => {
    return devices.find(d => d.id === formData.deviceId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {schedule ? 'Editar Programación' : 'Nueva Programación'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        {/* Nombre */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Ej: Riego matutino"
            placeholderTextColor="#999"
          />
        </View>

        {/* Descripción */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Descripción opcional"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Dispositivo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Dispositivo *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDevicePicker(!showDevicePicker)}
          >
            <Text style={styles.pickerText}>
              {getSelectedDevice()?.name || 'Seleccionar dispositivo'}
            </Text>
            <Ionicons 
              name={showDevicePicker ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {showDevicePicker && (
            <View style={styles.pickerOptions}>
              {devices.map(device => (
                <TouchableOpacity
                  key={device.id}
                  style={[
                    styles.pickerOption,
                    device.id === formData.deviceId && styles.pickerOptionSelected
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, deviceId: device.id }));
                    setShowDevicePicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    device.id === formData.deviceId && styles.pickerOptionTextSelected
                  ]}>
                    {device.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tipo de programación */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de programación *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTypePicker(!showTypePicker)}
          >
            <Text style={styles.pickerText}>
              {getScheduleTypeLabel(formData.scheduleType)}
            </Text>
            <Ionicons 
              name={showTypePicker ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {showTypePicker && (
            <View style={styles.pickerOptions}>
              {allTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    type === formData.scheduleType && styles.pickerOptionSelected
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, scheduleType: type }));
                    setShowTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    type === formData.scheduleType && styles.pickerOptionTextSelected
                  ]}>
                    {getScheduleTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Hora */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hora (HH:MM) *</Text>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={20} color="#8EC5FC" />
            <TextInput
              style={styles.timeInput}
              value={formData.time}
              onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
              placeholder="09:00"
              placeholderTextColor="#999"
              maxLength={5}
            />
          </View>
          <Text style={styles.hint}>Formato: 24 horas (ej: 09:00, 18:30)</Text>
        </View>

        {/* Días de la semana */}
        <View style={styles.formGroup}>
          <View style={styles.daysHeader}>
            <Text style={styles.label}>Días de la semana *</Text>
            <TouchableOpacity onPress={selectAllDays}>
              <Text style={styles.selectAllText}>
                {formData.daysOfWeek.length === allDays.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.daysContainer}>
            {allDays.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  formData.daysOfWeek.includes(day) && styles.dayButtonActive
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[
                  styles.dayButtonText,
                  formData.daysOfWeek.includes(day) && styles.dayButtonTextActive
                ]}>
                  {getDayLabel(day)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duración */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Duración (minutos)</Text>
          <TextInput
            style={styles.input}
            value={formData.duration?.toString()}
            onChangeText={(text) => setFormData(prev => ({ 
              ...prev, 
              duration: parseInt(text) || 0 
            }))}
            placeholder="30"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Campos específicos para iluminación */}
        {formData.scheduleType === ScheduleType.LIGHTING && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Intensidad: {formData.intensity}%</Text>
              <TextInput
                style={styles.input}
                value={formData.intensity?.toString()}
                onChangeText={(text) => {
                  const value = Math.min(100, Math.max(0, parseInt(text) || 0));
                  setFormData(prev => ({ ...prev, intensity: value }));
                }}
                placeholder="75"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Text style={styles.hint}>Valor entre 0 y 100</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Color (hex)</Text>
              <TextInput
                style={styles.input}
                value={formData.color}
                onChangeText={(text) => setFormData(prev => ({ ...prev, color: text }))}
                placeholder="#ffffff"
                placeholderTextColor="#999"
                maxLength={7}
              />
              <Text style={styles.hint}>Formato: #ffffff</Text>
            </View>
          </>
        )}

        {/* Estado activo (solo para edición) */}
        {schedule && (
          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Programación activa</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value }))}
                trackColor={{ false: '#e0e0e0', true: '#8EC5FC' }}
                thumbColor={formData.isActive ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Guardando...' : (schedule ? 'Actualizar' : 'Crear')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#130065',
    flex: 1,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptions: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#8EC5FC',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  timeInput: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectAllText: {
    color: '#8EC5FC',
    fontSize: 14,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 45,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#8EC5FC',
    borderColor: '#8EC5FC',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#8EC5FC',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
