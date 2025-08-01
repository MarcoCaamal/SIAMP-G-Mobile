import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';

import WifiScanScreen from '@/modules/devices/screens/WifiScanScreen';
import DeviceConfigScreen from '../modules/devices/screens/DeviceConfigScreen';
import DeviceControlScreen from '../modules/devices/screens/DeviceControlScreen';
import DeviceEditScreen from '../modules/devices/screens/DeviceEditScreen';
import DevicesScreen from '../modules/devices/screens/DevicesScreen';
import CreateEditLightModeScreen from '../modules/light-modes/screens/CreateEditLightModeScreen';
import LightModesScreen from '../modules/light-modes/screens/LightModesScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
import ScheduleScreen from '../modules/schedule/screens/ScheduleScreen';
import { HapticTab } from '../modules/shared/components/HapticTab';
import TabBarBackground from '../modules/shared/components/ui/TabBarBackground';
import { Colors } from '../modules/shared/constants/Colors';
import { useColorScheme } from '../modules/shared/hooks/useColorScheme';

export type TabParamList = {
  Devices: undefined;
  LightModes: undefined;
  Schedule: undefined;
  Profile: undefined;
  WifiScan: undefined;
  DeviceConfig: { ssid: string; capabilities: string };
  DeviceControl: { deviceId: string };
  DeviceEdit: { deviceId: string };
  CreateLightMode: undefined;
  EditLightMode: { lightModeId: string };
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
        name="Devices"
        component={DevicesScreen}
        options={{
          title: 'Dispositivos',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="devices" color={color} />,
        }}
      />
      <Tab.Screen
        name="LightModes"
        component={LightModesScreen}
        options={{
          title: 'Modos de Luz',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="lightbulb" color={color} />,
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
        name="CreateLightMode"
        component={CreateEditLightModeScreen}
        options={{
          title: 'Crear Modo de Luz',
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="EditLightMode"
        component={CreateEditLightModeScreen}
        options={{
          title: 'Editar Modo de Luz',
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
