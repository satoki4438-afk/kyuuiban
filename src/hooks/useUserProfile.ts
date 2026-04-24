import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types/user';
import { calculateHonmeiSei } from '../lib/kyusei';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('user_profile').then(json => {
      if (!json) return;
      const data = JSON.parse(json);
      const birthDate = new Date(data.birthDate);
      setProfile({ ...data, birthDate, honmeiSei: calculateHonmeiSei(birthDate) });
    });
  }, []);

  return profile;
}
