import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utils/theme';

const StreakTracker = () => {
  const { theme } = useTheme();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    calculateStreak();
  }, []);

  const calculateStreak = async () => {
    try {
      const history = await AsyncStorage.getItem('quizStats');
      if (!history) return;

      const stats = JSON.parse(history);
      if (!stats.history || stats.history.length === 0) return;

      const uniqueDays = [
        ...new Set(stats.history.map((h) => new Date(h.date).toDateString())),
      ].map((d) => new Date(d));

      uniqueDays.sort((a, b) => b - a);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let currentStreak = 0;
      let checkDate = new Date(today);

      for (const day of uniqueDays) {
        day.setHours(0, 0, 0, 0);
        const diff = Math.round((checkDate - day) / (1000 * 60 * 60 * 24));
        if (diff === 0 || diff === 1) {
          currentStreak++;
          checkDate = day;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (e) {
      console.log('Streak error:', e);
    }
  };

  if (streak === 0) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.warning },
      ]}
    >
      <Text style={styles.emoji}>🔥</Text>
      <View>
        <Text style={[styles.streakText, { color: theme.text }]}>
          {streak} Day Streak!
        </Text>
        <Text style={[styles.subText, { color: theme.textSecondary }]}>
          Keep it up!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 15,
    elevation: 2,
  },
  emoji: { fontSize: 32, marginRight: 12 },
  streakText: { fontSize: 16, fontWeight: 'bold' },
  subText: { fontSize: 12 },
});

export default StreakTracker;