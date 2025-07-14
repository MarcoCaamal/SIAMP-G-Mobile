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

type ResetPasswordScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'ResetPasswordScreen'>;
};

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Aquí implementarías la lógica para enviar el email de restablecimiento
      console.log('Enviando email a:', email);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navegar a la pantalla de verificación de email
      navigation.navigate('VerifyEmailScreen', { email });
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el correo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

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
          {/* Icono de email */}
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={40} color="#666" />
          </View>
          {/* Título */}
          <Text style={styles.title}>Restablece tu contraseña</Text>
          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Ingresa tu correo electrónico para recibir{"\n"}las instrucciones de recuperación
          </Text>
          
          {/* Campo de email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={[
                styles.textInput,
                !validateEmail(email) && email.length > 0 && styles.textInputError
              ]}
              placeholder="ejemplo@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
            {!validateEmail(email) && email.length > 0 && (
              <Text style={styles.errorText}>Ingresa un correo válido</Text>
            )}
          </View>
          
          {/* Información adicional */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={16} color="#7BB3FF" />
            <Text style={styles.infoText}>
              Te enviaremos un código de verificación de 4 dígitos
            </Text>
          </View>

          {/* Botón de enviar */}
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (!email.trim() || !validateEmail(email) || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendEmail}
            disabled={!email.trim() || !validateEmail(email) || isLoading}
          >
            {isLoading ? (
              <Text style={styles.sendButtonText}>Enviando...</Text>
            ) : (
              <Text style={styles.sendButtonText}>Enviar código</Text>
            )}
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
    width: 32, // Para balancear el header
  },
  content: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
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
    marginBottom: 48,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInputError: {
    borderColor: '#F44336',
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  infoText: {
    fontSize: 14,
    color: '#7BB3FF',
    marginLeft: 8,
    flex: 1,
  },
  sendButton: {
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
  },
  sendButtonDisabled: {
    backgroundColor: '#b8d1ff',
    elevation: 0,
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResetPasswordScreen;
