import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  onVerify: (code: string) => Promise<void>;
}

export default function VerificationForm({ onVerify }: Props) {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      Alert.alert('Error', 'Por favor ingresa el código completo');
      return;
    }

    setLoading(true);
    try {
      await onVerify(fullCode);
    } catch (error) {
      Alert.alert('Error', 'El código es incorrecto o hubo un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="paper-plane-outline" size={100} color="#007AFF" />
      </View>

      <View style={{ alignItems: 'center', width: '100%' }}>
        <Text style={styles.title}>Verifica tu cuenta</Text>
        
        <Text style={styles.subtitle}>
          Ingresa el código de 4 dígitos que enviamos a tu número de teléfono
        </Text>
      </View>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref }}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : null
            ]}
            value={digit}
            onChangeText={(value) => handleCodeChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>

      <Pressable 
        style={[styles.confirmButton, loading && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={loading || code.join('').length !== 4}
      >
        <Text style={styles.confirmButtonText}>
          {loading ? 'Verificando...' : 'Confirmar'}
        </Text>
      </Pressable>

      <Pressable style={styles.resendButton}>
        <Text style={styles.resendText}>¿No recibiste el código? Reenviar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center', // Centra verticalmente
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
  },
  codeInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});