import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#77B5FE',
  },
});
