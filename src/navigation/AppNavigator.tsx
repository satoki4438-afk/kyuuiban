import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import TodayScreen from '../screens/TodayScreen';
import CompassScreen from '../screens/CompassScreen';
import DestinyScreen from '../screens/DestinyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LuckySpotsScreen from '../screens/LuckySpotsScreen';
import PaywallScreen from '../screens/PaywallScreen';
import { useSubscription } from '../hooks/useSubscription';

const Tab = createBottomTabNavigator();

function GatedScreen({ Screen }: { Screen: React.ComponentType<any> }) {
  // TODO: テスト用 — リリース前に元に戻す
  const isSubscribed = true;
  const loading = false;
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgPrimary }}>
        <ActivityIndicator color={COLORS.gold} />
      </View>
    );
  }
  return isSubscribed ? <Screen /> : <PaywallScreen />;
}

const GatedCompass = () => <GatedScreen Screen={CompassScreen} />;
const GatedDestiny = () => <GatedScreen Screen={DestinyScreen} />;
const GatedSpots = () => <GatedScreen Screen={LuckySpotsScreen} />;

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
          component={GatedCompass}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🧭</Text> }}
        />
        <Tab.Screen
          name="宿命"
          component={GatedDestiny}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>★</Text> }}
        />
        <Tab.Screen
          name="スポット"
          component={GatedSpots}
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
