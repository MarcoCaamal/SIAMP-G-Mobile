import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginPage from './auth/pages/LoginPage';
import RegisterPage from './auth/pages/RegisterPage';


const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginPage} 
          
          options={{
            headerShown: false,
             headerTitle: () => (
            <Text style={{ color: '#77B5FE', fontWeight: 'bold', fontSize: 20, letterSpacing: 2 }}>SIAMP-G</Text>
          ) }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterPage} 
          options={{ 
            headerShown: false, 
            headerTitle: () => (
              <Text style={{ color: '#77B5FE', fontWeight: 'bold', fontSize: 20, letterSpacing: 2 }}>SIAMP-G</Text>
            )
          }}
        />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
