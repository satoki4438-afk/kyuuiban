import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants/colors';
import TodayScreen from '../screens/TodayScreen';
import CompassScreen from '../screens/CompassScreen';
import DestinyScreen from '../screens/DestinyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LuckySpotsScreen from '../screens/LuckySpotsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.bgSecondary,
            borderTopColor: '#3A2870',
          },
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        <Tab.Screen
          name="今日"
          component={TodayScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>☀</Text> }}
        />
        <Tab.Screen
          name="方位"
          component={CompassScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🧭</Text> }}
        />
        <Tab.Screen
          name="宿命"
          component={DestinyScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>★</Text> }}
        />
        <Tab.Screen
          name="スポット"
          component={LuckySpotsScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📍</Text> }}
        />
        <Tab.Screen
          name="設定"
          component={SettingsScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
