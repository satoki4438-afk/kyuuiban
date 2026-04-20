import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AppNavigator from './src/navigation/AppNavigator';
import type { Gender } from './src/lib/kyusei/types';

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);

  const handleOnboardingComplete = async (data: {
    name: string;
    birthDate: Date;
    gender: Gender;
    honmeiSei: number;
  }) => {
    await AsyncStorage.setItem('user_profile', JSON.stringify({
      ...data,
      birthDate: data.birthDate.toISOString(),
    }));
    setOnboardingDone(true);
  };

  return (
    <>
      <StatusBar style="light" />
      {onboardingDone
        ? <AppNavigator />
        : <OnboardingScreen onComplete={handleOnboardingComplete} />
      }
    </>
  );
}
