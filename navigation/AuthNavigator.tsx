import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';

import ChangePasswordScreen from '../modules/auth/screens/ChangePasswordScreen';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';
import ResetPasswordScreen from '../modules/auth/screens/ResetPasswordScreen';
import VerificationScreen from '../modules/auth/screens/VerificationScreen';
import VerifyEmailScreen from '../modules/auth/screens/VerifyEmailScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Test: undefined;
  VerificationScreen: undefined;
  ResetPasswordScreen: undefined;
  VerifyEmailScreen: { email?: string } | undefined;
  ChangePasswordScreen: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

// Componente de prueba simple
function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Test Screen - App is working!</Text>
    </View>
  );
}

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
