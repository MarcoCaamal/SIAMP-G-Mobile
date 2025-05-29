import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' }
});
