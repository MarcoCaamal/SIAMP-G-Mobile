import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';

import DevicesScreen from '../modules/devices/screens/DevicesScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
import ScheduleScreen from '../modules/schedule/screens/ScheduleScreen';
import { HapticTab } from '../modules/shared/components/HapticTab';
import { IconSymbol } from '../modules/shared/components/ui/IconSymbol';
import TabBarBackground from '../modules/shared/components/ui/TabBarBackground';
import { Colors } from '../modules/shared/constants/Colors';
import { useColorScheme } from '../modules/shared/hooks/useColorScheme';
import HomeScreen from '../modules/shared/screens/HomeScreen';

export type TabParamList = {
  Home: undefined;
  Devices: undefined;
  Schedule: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          title: 'Dispositivos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cpu" color={color} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Programaciones',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
