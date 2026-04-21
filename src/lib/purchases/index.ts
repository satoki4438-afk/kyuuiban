import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

export const ENTITLEMENT_ID = 'premium';
export const MONTHLY_PACKAGE_ID = '$rc_monthly';

export function initPurchases(userId: string) {
  const apiKey = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? ''
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '';
  if (!apiKey) return;
  Purchases.setLogLevel(LOG_LEVEL.ERROR);
  Purchases.configure({ apiKey, appUserID: userId });
}

export { Purchases };
