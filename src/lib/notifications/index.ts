import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerNotifications(): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-fortune', {
      name: '今日の運勢',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  await scheduleDailyFortune();
}

async function scheduleDailyFortune(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const alreadySet = scheduled.some(n => n.content.data?.type === 'daily-fortune');
  if (alreadySet) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '今日の運勢',
      body: '吉方位と今日の運気をチェックしましょう ✨',
      sound: 'default',
      data: { type: 'daily-fortune' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0,
    },
  });
}
