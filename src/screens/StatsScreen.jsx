import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utils/theme';

const StatsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await AsyncStorage.getItem('quizStats');
      if (statsData) setStats(JSON.parse(statsData));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const clearStats = () => {
    Alert.alert(
      'Clear Statistics',
      'Are you sure you want to clear all statistics? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('quizStats');
            setStats(null);
          },
        },
      ],
    );
  };

  const getTypeName = type => {
    const types = {
      addition: 'Addition',
      subtraction: 'Subtraction',
      multiplication: 'Multiplication',
      division: 'Division',
      bodmas: 'BODMAS',
    };
    return types[type] || type;
  };

  const getTypeIcon = type => {
    const icons = {
      addition: '➕',
      subtraction: '➖',
      multiplication: '✖️',
      division: '➗',
      bodmas: '🧮',
    };
    return icons[type] || '📝';
  };

  if (!stats) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Statistics Yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Complete a quiz to see your statistics here!
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.emptyButtonText}>Start a Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const overallAccuracy =
    stats.totalQuestions > 0
      ? (stats.totalCorrect / stats.totalQuestions) * 100
      : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.tabContainer, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'overview' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === 'overview' ? '#fff' : theme.textSecondary,
                },
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'history' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setSelectedTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === 'history' ? '#fff' : theme.textSecondary,
                },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'overview' ? (
          <>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#4A90E2' }]}>
                <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
                <Text style={styles.statLabel}>Quizzes Taken</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.statValue}>{stats.totalCorrect}</Text>
                <Text style={styles.statLabel}>Correct Answers</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
                <Text style={styles.statValue}>{stats.totalQuestions}</Text>
                <Text style={styles.statLabel}>Total Questions</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
                <Text style={styles.statValue}>
                  {overallAccuracy.toFixed(0)}%
                </Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Performance by Category
              </Text>
              {Object.entries(stats.byType).map(([type, data]) => {
                const accuracy = (data.correct / data.questions) * 100;
                return (
                  <View
                    key={type}
                    style={[
                      styles.typeStatsCard,
                      { backgroundColor: theme.surface },
                    ]}
                  >
                    <View style={styles.typeHeader}>
                      <Text style={styles.typeIcon}>{getTypeIcon(type)}</Text>
                      <Text style={[styles.typeName, { color: theme.text }]}>
                        {getTypeName(type)}
                      </Text>
                    </View>
                    <View style={styles.typeDetails}>
                      <Text
                        style={[
                          styles.typeStat,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Quizzes: {data.quizzes}
                      </Text>
                      <Text
                        style={[
                          styles.typeStat,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Accuracy: {accuracy.toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.typeProgressContainer}>
                      <View
                        style={[
                          styles.typeProgress,
                          {
                            width: `${accuracy}%`,
                            backgroundColor:
                              accuracy >= 70
                                ? '#4CAF50'
                                : accuracy >= 50
                                ? '#FF9800'
                                : '#F44336',
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={clearStats}>
              <Text style={styles.clearButtonText}>Clear All Statistics</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Quizzes
            </Text>
            {stats.history && stats.history.length > 0 ? (
              stats.history.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.historyCard,
                    { backgroundColor: theme.surface },
                  ]}
                >
                  <View style={styles.historyHeader}>
                    <Text style={[styles.historyType, { color: theme.text }]}>
                      {getTypeIcon(item.type)} {getTypeName(item.type)}
                    </Text>
                    <Text
                      style={[
                        styles.historyScore,
                        item.percentage >= 70
                          ? styles.goodScore
                          : item.percentage >= 50
                          ? styles.okScore
                          : styles.badScore,
                      ]}
                    >
                      {item.score}/{item.total}
                    </Text>
                  </View>
                  <View style={styles.historyFooter}>
                    <Text
                      style={[
                        styles.historyDifficulty,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.difficulty.charAt(0).toUpperCase() +
                        item.difficulty.slice(1)}
                    </Text>
                    <Text
                      style={[styles.historyDate, { color: theme.textMuted }]}
                    >
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.noHistoryText, { color: theme.textMuted }]}>
                No quiz history yet
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  emptyButton: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 },
  emptyButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
    elevation: 2,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabText: { fontSize: 16, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  typeStatsCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  typeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  typeIcon: { fontSize: 24, marginRight: 10 },
  typeName: { fontSize: 18, fontWeight: '600' },
  typeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeStat: { fontSize: 14 },
  typeProgressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  typeProgress: { height: '100%', borderRadius: 3 },
  clearButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F44336',
    marginTop: 10,
  },
  clearButtonText: { fontSize: 16, fontWeight: '600', color: '#F44336' },
  historyCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: { fontSize: 16, fontWeight: '600' },
  historyScore: { fontSize: 18, fontWeight: 'bold' },
  goodScore: { color: '#4CAF50' },
  okScore: { color: '#FF9800' },
  badScore: { color: '#F44336' },
  historyFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  historyDifficulty: { fontSize: 14 },
  historyDate: { fontSize: 14 },
  noHistoryText: { fontSize: 16, textAlign: 'center', padding: 20 },
});

export default StatsScreen;
