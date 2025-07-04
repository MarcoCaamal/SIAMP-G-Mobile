import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';

import WifiScanScreen from '@/modules/devices/screens/WifiScanScreen';
import DeviceConfigScreen from '../modules/devices/screens/DeviceConfigScreen';
import DeviceControlScreen from '../modules/devices/screens/DeviceControlScreen';
import DeviceEditScreen from '../modules/devices/screens/DeviceEditScreen';
import DevicesScreen from '../modules/devices/screens/DevicesScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
import ScheduleScreen from '../modules/schedule/screens/ScheduleScreen';
import { HapticTab } from '../modules/shared/components/HapticTab';
import TabBarBackground from '../modules/shared/components/ui/TabBarBackground';
import { Colors } from '../modules/shared/constants/Colors';
import { useColorScheme } from '../modules/shared/hooks/useColorScheme';
import HomeScreen from '../modules/shared/screens/HomeScreen';

export type TabParamList = {
  Home: undefined;
  Devices: undefined;
  Schedule: undefined;
  Profile: undefined;
  WifiScan: undefined;
  DeviceConfig: { ssid: string; capabilities: string };
  DeviceControl: { deviceId: string };
  DeviceEdit: { deviceId: string };
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
        }),
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          title: 'Dispositivos',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="devices" color={color} />,
        }}
      />
      <Tab.Screen
        name="WifiScan"
        component={WifiScanScreen}
        options={{
          title: 'Buscar WiFi',
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="DeviceConfig"
        component={DeviceConfigScreen}
        options={{
          title: 'Configurar Dispositivo',
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="DeviceControl"
        component={DeviceControlScreen}
        options={{
          title: 'Control de Dispositivo',
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="DeviceEdit"
        component={DeviceEditScreen}
        options={{
          title: 'Editar Dispositivo',
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Programaciones',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="schedule" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="account-circle" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
