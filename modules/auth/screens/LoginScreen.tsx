import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <LoginForm />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fb',
  },
});

export default LoginPage;
