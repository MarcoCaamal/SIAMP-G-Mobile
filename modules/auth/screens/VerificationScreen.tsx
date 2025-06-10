import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSendVerificationCode, useVerifyEmailCode } from '../hooks/useAuth';

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sendVerificationCode, loading: resendLoading } = useSendVerificationCode();
  const { verifyEmailCode, loading: verifyLoading } = useVerifyEmailCode();
  
  // Get email from route params or use default
  const userEmail = (route.params as any)?.email || 'example@correo.com';
  
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleConfirm = async () => {
    const fullCode = code.join('');
    if (fullCode.length === 4) {
      try {
        const result = await verifyEmailCode(fullCode);
        
        if (result._success) {
          Alert.alert(
            'Verificación exitosa', 
            'Tu cuenta ha sido verificada correctamente',
            [
              {
                text: 'Continuar',
                onPress: () => {                  // Navegar al dashboard o pantalla principal
                  // Por ahora navegar de vuelta al login
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' as any }],
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Código inválido', 
            result._error?.message || 'El código ingresado es incorrecto. Verifica e intenta nuevamente.'
          );
        }
      } catch (error) {
        Alert.alert(
          'Error de conexión', 
          'Verifica tu conexión a internet e intenta nuevamente.'
        );
      }
    } else {
      Alert.alert('Error', 'Por favor ingresa el código completo de 4 dígitos');
    }
  };
  const handleResendCode = async () => {
    try {
      const result = await sendVerificationCode(userEmail);
      
      if (result._success) {
        Alert.alert(
          'Código reenviado', 
          'Se ha enviado un nuevo código de verificación a tu correo electrónico'
        );
      } else {
        Alert.alert(
          'Error', 
          result._error?.message || 'No se pudo reenviar el código. Intenta nuevamente.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Error de conexión', 
        'Verifica tu conexión a internet e intenta nuevamente.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#5B9BD5" barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Navegar al stack de autenticación y pantalla Login correctamente
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth', params: { screen: 'Login' } }],
              });
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIAMP-G</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="send" size={32} color="#666" />
        </View>
        {/* Title */}
        <Text style={styles.title}>Verifica tu cuenta</Text>        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Por favor ingresa el código de 4 dígitos{"\n"}
          enviado al correo {userEmail}
        </Text>
        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputRefs.current[index] = ref; }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
              returnKeyType="next"
            />
          ))}
        </View>        {/* Resend Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>¿No recibiste el correo? </Text>
          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={resendLoading}
            style={[styles.resendButton, resendLoading && styles.resendButtonDisabled]}
          >
            <Text style={[styles.resendLink, resendLoading && styles.resendLinkDisabled]}>
              {resendLoading ? 'Reenviando...' : 'Reenviar'}
            </Text>
          </TouchableOpacity>
        </View>        {/* Confirm Button */}
        <TouchableOpacity 
          style={[styles.confirmButton, verifyLoading && styles.confirmButtonDisabled]} 
          onPress={handleConfirm}
          disabled={verifyLoading}
        >
          <Text style={styles.confirmButtonText}>
            {verifyLoading ? 'Verificando...' : 'Confirmar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#5B9BD5',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 32,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    backgroundColor: 'white',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },  resendLink: {
    fontSize: 14,
    color: '#5B9BD5',
    fontWeight: '500',
  },
  resendButton: {
    padding: 4,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendLinkDisabled: {
    color: '#999',
  },  confirmButton: {
    backgroundColor: '#5B9BD5',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#999',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerificationScreen;
