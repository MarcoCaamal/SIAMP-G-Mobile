import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';

import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';
import ResetPasswordScreen from '../modules/auth/screens/ResetPasswordScreen';
import VerificationScreen from '../modules/auth/screens/VerificationScreen';
import WifiScanScreen from '../modules/devices/screens/WifiScanScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Test: undefined;
  VerificationScreen: undefined;
  ResetPasswordScreen: undefined;
  WifiScan: undefined;
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
      initialRouteName="WifiScan" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WifiScan" component={WifiScanScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
