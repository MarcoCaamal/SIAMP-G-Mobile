import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
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

const VerifyEmailScreen = ({ navigation, route }: any) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [email, setEmail] = useState(route?.params?.email || 'example@correo.com');
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      Alert.alert('Error', 'Por favor ingresa el código completo de 4 dígitos');
      return;
    }
    // Aquí implementarías la lógica de verificación
    console.log('Código ingresado:', fullCode);
    // navigation.navigate('NewPassword') o la siguiente pantalla
  };

  const handleResendCode = () => {
    Alert.alert('Código reenviado', 'Se ha enviado un nuevo código a tu correo');
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isCodeComplete = code.every(digit => digit !== '');

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
            <Ionicons name="lock-closed" size={40} color="#666" />
          </View>
          {/* Título */}
          <Text style={styles.title}>Verifica tu email</Text>
          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Por favor ingresa el código de 4 dígitos{"\n"}
            enviado al correo <Text style={styles.emailText}>{email}</Text>
          </Text>
          {/* Campos de código */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { inputRefs.current[index] = ref; }}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>
          {/* Enlace de reenvío */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendQuestion}>¿No recibiste el correo? </Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Reenviar</Text>
            </TouchableOpacity>
          </View>
          {/* Botón de confirmar */}
          <TouchableOpacity 
            style={[
              styles.confirmButton, 
              !isCodeComplete && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirm}
            disabled={!isCodeComplete}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    marginBottom: 40,
  },
  emailText: {
    color: '#333',
    fontWeight: '500',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 32,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  codeInputFilled: {
    borderColor: '#7BB3FF',
    backgroundColor: '#f8fbff',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendQuestion: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#7BB3FF',
    fontWeight: '500',
  },
  confirmButton: {
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
  confirmButtonDisabled: {
    backgroundColor: '#b8d1ff',
    elevation: 0,
    shadowOpacity: 0,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerifyEmailScreen;
