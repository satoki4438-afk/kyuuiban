import type { Gender } from '../lib/kyusei/types';

export interface UserProfile {
  uid?: string;
  name: string;
  birthDate: Date;
  gender: Gender;
  honmeiSei: number;
  getsumeiSei?: number | null;
}
