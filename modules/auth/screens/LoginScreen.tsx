import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {

  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fb',
  },
});

export default LoginPage;
