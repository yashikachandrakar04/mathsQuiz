import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StreakTracker from '../components/StreakTracker';
import { useTheme } from '../utils/theme';
import { playClick } from '../utils/soundEffects';
import { hapticLight } from '../utils/haptics';

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedQuestions, setSelectedQuestions] = useState(10);
  const [stats, setStats] = useState(null);

  const quizTypes = [
    { id: 'addition', name: 'Addition', icon: '➕', color: '#4CAF50' },
    { id: 'subtraction', name: 'Subtraction', icon: '➖', color: '#FF9800' },
    { id: 'multiplication', name: 'Multiplication', icon: '✖️', color: '#2196F3' },
    { id: 'division', name: 'Division', icon: '➗', color: '#9C27B0' },
    { id: 'bodmas', name: 'BODMAS', icon: '🧮', color: '#F44336' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', color: '#4CAF50' },
    { id: 'medium', name: 'Medium', color: '#FF9800' },
    { id: 'hard', name: 'Hard', color: '#F44336' },
  ];

  const questionCounts = [5, 10, 15, 20];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadStats);
    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    try {
      const statsData = await AsyncStorage.getItem('quizStats');
      if (statsData) setStats(JSON.parse(statsData));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTypeSelect = (id) => {
    playClick();
    hapticLight();
    setSelectedType(id);
  };

  const startQuiz = () => {
    if (!selectedType) {
      Alert.alert('Please select a quiz type');
      return;
    }
    playClick();
    hapticLight();
    navigation.navigate('Quiz', {
      type: selectedType,
      difficulty: selectedDifficulty,
      numberOfQuestions: selectedQuestions,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Text style={styles.themeIcon}>
          {theme.mode === 'dark' ? '☀️' : '🌙'}
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Math Quiz Challenge
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Test your math skills!
          </Text>
        </View>

        <StreakTracker />

        {stats && (
          <TouchableOpacity
            style={[styles.statsButton, { borderColor: theme.primary, backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={[styles.statsButtonText, { color: theme.primary }]}>
              📊 View Statistics
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Choose Quiz Type
          </Text>
          <View style={styles.gridContainer}>
            {quizTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  selectedType === type.id && {
                    borderColor: type.color,
                    backgroundColor: theme.mode === 'dark' ? '#1E2A3A' : '#f0f8ff',
                  },
                ]}
                onPress={() => handleTypeSelect(type.id)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeName,
                    { color: selectedType === type.id ? type.color : theme.textSecondary },
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Difficulty
          </Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty.id}
                style={[
                  styles.difficultyButton,
                  {
                    backgroundColor:
                      selectedDifficulty === difficulty.id
                        ? difficulty.color
                        : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => {
                  playClick();
                  hapticLight();
                  setSelectedDifficulty(difficulty.id);
                }}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: selectedDifficulty === difficulty.id ? '#fff' : theme.textSecondary },
                  ]}
                >
                  {difficulty.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Number of Questions
          </Text>
          <View style={styles.questionCountContainer}>
            {questionCounts.map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countButton,
                  {
                    backgroundColor:
                      selectedQuestions === count ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => {
                  playClick();
                  hapticLight();
                  setSelectedQuestions(count);
                }}
              >
                <Text
                  style={[
                    styles.countText,
                    { color: selectedQuestions === count ? '#fff' : theme.textSecondary },
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: selectedType ? theme.primary : '#ccc' },
          ]}
          onPress={startQuiz}
          disabled={!selectedType}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  themeToggle: { position: 'absolute', top: 10, right: 15, padding: 10, zIndex: 10 },
  themeIcon: { fontSize: 24 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16 },
  statsButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    elevation: 2,
  },
  statsButtonText: { fontSize: 16, fontWeight: '600' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    elevation: 2,
  },
  typeIcon: { fontSize: 32, marginBottom: 10 },
  typeName: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  difficultyContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  difficultyText: { fontSize: 14, fontWeight: '600' },
  questionCountContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  countButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  countText: { fontSize: 16, fontWeight: '600' },
  startButton: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  startButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});

export default HomeScreen;