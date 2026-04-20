import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types/user';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('user_profile').then(json => {
      if (!json) return;
      const data = JSON.parse(json);
      setProfile({ ...data, birthDate: new Date(data.birthDate) });
    });
  }, []);

  return profile;
}
