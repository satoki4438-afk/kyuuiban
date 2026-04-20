import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { calculateHonmeiSei } from '../lib/kyusei';
import type { Gender } from '../lib/kyusei/types';

interface Props {
  onComplete: (data: {
    name: string;
    birthDate: Date;
    gender: Gender;
    honmeiSei: number;
  }) => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const honmeiSei = calculateHonmeiSei(birthDate);
    onComplete({ name, birthDate, gender: gender!, honmeiSei });
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return year.length === 4 && month.length > 0 && day.length > 0;
    if (step === 3) return gender !== null;
    if (step === 4) return name.length > 0;
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>九気盤</Text>
        <Text style={styles.stepLabel}>{step} / 4</Text>

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>ようこそ</Text>
            <Text style={styles.subtitle}>
              九星気学に基づいた本格占いで{'\n'}今日の運気を可視化します
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>生年月日を入力</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={[styles.input, styles.inputYear]}
                placeholder="1990"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                maxLength={4}
                value={year}
                onChangeText={setYear}
              />
              <Text style={styles.dateLabel}>年</Text>
              <TextInput
                style={[styles.input, styles.inputShort]}
                placeholder="1"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                maxLength={2}
                value={month}
                onChangeText={setMonth}
              />
              <Text style={styles.dateLabel}>月</Text>
              <TextInput
                style={[styles.input, styles.inputShort]}
                placeholder="1"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                maxLength={2}
                value={day}
                onChangeText={setDay}
              />
              <Text style={styles.dateLabel}>日</Text>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>性別を選択</Text>
            {(['male', 'female', 'other'] as Gender[]).map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                  {g === 'male' ? '男性' : g === 'female' ? '女性' : 'その他'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>お名前を入力</Text>
            <TextInput
              style={styles.input}
              placeholder="さとき"
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canNext()}
        >
          <Text style={styles.nextBtnText}>
            {step === 4 ? 'はじめる' : '次へ'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 28,
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 8,
  },
  stepLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 48,
  },
  stepContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lavender,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    backgroundColor: COLORS.bgSecondary,
  },
  inputYear: {
    width: 80,
  },
  inputShort: {
    width: 48,
  },
  dateLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  genderBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lavender,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.bgSecondary,
  },
  genderBtnActive: {
    borderColor: COLORS.gold,
    backgroundColor: '#2D1E5A',
  },
  genderText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  genderTextActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    marginTop: 'auto',
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextBtnText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
