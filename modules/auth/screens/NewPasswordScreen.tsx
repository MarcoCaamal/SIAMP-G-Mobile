import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AuthStackParamList } from '../../../navigation/AuthNavigator';

type NewPasswordScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'NewPasswordScreen'>;
};

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    // Validaciones básicas de contraseña
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return null;
  };

  const handleSubmit = () => {
    // Validar que las contraseñas no estén vacías
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar formato de contraseña
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Aquí implementarías la lógica para actualizar la contraseña
    console.log('Actualizando contraseña...');
    Alert.alert(
      'Éxito', 
      'Tu contraseña ha sido actualizada exitosamente',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isFormValid = newPassword.trim() && confirmPassword.trim() && newPassword === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7BB3FF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIAMP-G</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          {/* Icono de candado */}
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={40} color="#666" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Nueva contraseña</Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Crea una nueva contraseña segura para{"\n"}tu cuenta de SIAMP-G
          </Text>

          {/* Campo Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nueva Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Crea una contraseña segura"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons 
                  name={showNewPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Repite tu nueva contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicador de coincidencia de contraseñas */}
          {confirmPassword.length > 0 && (
            <View style={styles.passwordMatchContainer}>
              <Ionicons 
                name={newPassword === confirmPassword ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={newPassword === confirmPassword ? "#4CAF50" : "#F44336"} 
              />
              <Text style={[
                styles.passwordMatchText,
                { color: newPassword === confirmPassword ? "#4CAF50" : "#F44336" }
              ]}>
                {newPassword === confirmPassword ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              </Text>
            </View>
          )}

          {/* Requisitos de contraseña */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requisitos de contraseña:</Text>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={newPassword.length >= 8 ? "#4CAF50" : "#999"} 
              />
              <Text style={[styles.requirementText, { color: newPassword.length >= 8 ? "#4CAF50" : "#999" }]}>
                Al menos 8 caracteres
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={/(?=.*[a-z])/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={/(?=.*[a-z])/.test(newPassword) ? "#4CAF50" : "#999"} 
              />
              <Text style={[styles.requirementText, { color: /(?=.*[a-z])/.test(newPassword) ? "#4CAF50" : "#999" }]}>
                Una letra minúscula
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={/(?=.*[A-Z])/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={/(?=.*[A-Z])/.test(newPassword) ? "#4CAF50" : "#999"} 
              />
              <Text style={[styles.requirementText, { color: /(?=.*[A-Z])/.test(newPassword) ? "#4CAF50" : "#999" }]}>
                Una letra mayúscula
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={/(?=.*\d)/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={/(?=.*\d)/.test(newPassword) ? "#4CAF50" : "#999"} 
              />
              <Text style={[styles.requirementText, { color: /(?=.*\d)/.test(newPassword) ? "#4CAF50" : "#999" }]}>
                Al menos un número
              </Text>
            </View>
          </View>

          {/* Botón de actualizar */}
          <TouchableOpacity 
            style={[
              styles.updateButton, 
              !isFormValid && styles.updateButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.updateButtonText}>Actualizar contraseña</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7BB3FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 12,
    paddingRight: 16,
  },
  passwordMatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: -12,
  },
  passwordMatchText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  requirementsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    marginLeft: 8,
  },
  updateButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#7BB3FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 16,
  },
  updateButtonDisabled: {
    backgroundColor: '#b8d1ff',
    elevation: 0,
    shadowOpacity: 0,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewPasswordScreen;
