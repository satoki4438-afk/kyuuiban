import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/lib/firebase/config';
import { initPurchases } from './src/lib/purchases';
import { registerNotifications } from './src/lib/notifications';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AppNavigator from './src/navigation/AppNavigator';
import type { Gender } from './src/lib/kyusei/types';

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) initPurchases(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    registerNotifications().catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('user_profile').then(v => {
      if (v) setOnboardingDone(true);
    });
  }, []);

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
