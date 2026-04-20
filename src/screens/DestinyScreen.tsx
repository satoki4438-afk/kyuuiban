import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/colors';

export default function DestinyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>宿命（本命星）</Text>
        <Text style={styles.sub}>Week 3 で実装</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, color: COLORS.textPrimary, marginBottom: 8 },
  sub: { fontSize: 13, color: COLORS.textSecondary },
});
