import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import VerificationForm from '../components/VerificationForm';

export default function VerificationPage() {
  const navigation = useNavigation();

  const handleVerify = async (code: string) => {
    try {
      // Aquí va la URL de tu API para verificar el código
      const response = await fetch('api aqui ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Código incorrecto');
      }

      console.log('¡Cuenta verificada exitosamente!');
    } catch (error) {
      throw error; 
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </Pressable>
      </View>

      <VerificationForm onVerify={handleVerify} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});