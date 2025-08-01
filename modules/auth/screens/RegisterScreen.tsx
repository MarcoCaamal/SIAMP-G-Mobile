import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from '../components/RegisterForm';

export default function RegisterScreen() {
  return (
    <SafeAreaView>
      <RegisterForm />
    </SafeAreaView>
  );
}
