import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AnswerReview from '../components/AnswerReview';
import { useTheme } from '../utils/theme';

const ResultScreen = ({ navigation, route }) => {
  const { result } = route.params;
  const { theme } = useTheme();
  const [showReview, setShowReview] = useState(false);

  const getGrade = percentage => {
    if (percentage >= 90)
      return { grade: 'A+', color: '#4CAF50', message: 'Outstanding!' };
    if (percentage >= 80)
      return { grade: 'A', color: '#8BC34A', message: 'Excellent!' };
    if (percentage >= 70)
      return { grade: 'B', color: '#FFC107', message: 'Good job!' };
    if (percentage >= 60)
      return { grade: 'C', color: '#FF9800', message: 'Keep practicing!' };
    if (percentage >= 50)
      return { grade: 'D', color: '#FF5722', message: 'You can do better!' };
    return { grade: 'F', color: '#F44336', message: 'Need more practice!' };
  };

  const gradeInfo = getGrade(result.percentage);

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultHeader}>
          <View
            style={[
              styles.gradeCircle,
              { borderColor: gradeInfo.color, backgroundColor: theme.surface },
            ]}
          >
            <Text style={[styles.gradeText, { color: gradeInfo.color }]}>
              {gradeInfo.grade}
            </Text>
          </View>
          <Text style={[styles.message, { color: theme.text }]}>
            {gradeInfo.message}
          </Text>
        </View>

        <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.scoreTitle, { color: theme.textSecondary }]}>
            Your Score
          </Text>
          <Text style={[styles.scoreValue, { color: theme.text }]}>
            {result.score}/{result.totalQuestions}
          </Text>
          <Text style={[styles.percentage, { color: theme.primary }]}>
            {result.percentage.toFixed(0)}%
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${result.percentage}%`,
                  backgroundColor: gradeInfo.color,
                },
              ]}
            />
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.detailsTitle, { color: theme.text }]}>
            Quiz Details
          </Text>

          <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Quiz Type:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {getTypeName(result.type)}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Difficulty:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {result.difficulty.charAt(0).toUpperCase() +
                result.difficulty.slice(1)}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Correct:
            </Text>
            <Text style={[styles.detailValue, styles.correctText]}>
              {result.score}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Wrong:
            </Text>
            <Text style={[styles.detailValue, styles.wrongText]}>
              {result.totalQuestions - result.score}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Date:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {new Date(result.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Try Another Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.reviewButton]}
            onPress={() => setShowReview(true)}
          >
            <Text style={[styles.buttonText, styles.reviewButtonText]}>
              Review Answers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.surface,
                borderWidth: 2,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={[styles.buttonText, { color: theme.primary }]}>
              View Statistics
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showReview && (
        <View style={StyleSheet.absoluteFill}>
          <AnswerReview
            answers={result.answers || []}
            onClose={() => setShowReview(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  resultHeader: { alignItems: 'center', marginBottom: 30 },
  gradeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  gradeText: { fontSize: 48, fontWeight: 'bold' },
  message: { fontSize: 20, fontWeight: '600' },
  scoreCard: { padding: 25, borderRadius: 15, marginBottom: 20, elevation: 3 },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreValue: { fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
  percentage: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 5 },
  detailsCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  detailsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: 16 },
  detailValue: { fontSize: 16, fontWeight: '600' },
  correctText: { color: '#4CAF50' },
  wrongText: { color: '#F44336' },
  actionButtons: { marginTop: 10 },
  button: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#fff' },
  reviewButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  reviewButtonText: { color: '#FF9800' },
});

export default ResultScreen;
