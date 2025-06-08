import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '../modules/shared/components/HapticTab';
import { IconSymbol } from '../modules/shared/components/ui/IconSymbol';
import TabBarBackground from '../modules/shared/components/ui/TabBarBackground';
import { Colors } from '../modules/shared/constants/Colors';
import { useColorScheme } from '../modules/shared/hooks/useColorScheme';
import ExploreScreen from '../modules/shared/screens/ExploreScreen';
import HomeScreen from '../modules/shared/screens/HomeScreen';

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
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
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
