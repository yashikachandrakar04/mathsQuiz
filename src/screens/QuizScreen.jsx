import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateQuiz } from '../utils/questionGenerator';
import { useTheme } from '../utils/theme';
import {
  loadSounds,
  playCorrect,
  playWrong,
  releaseSounds,
} from '../utils/soundEffects';
import { hapticSuccess, hapticError } from '../utils/haptics';

const QuizScreen = ({ navigation, route }) => {
  const { type, difficulty, numberOfQuestions } = route.params;
  const { theme } = useTheme();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  const scoreRef = useRef(0);
  const answersRef = useRef([]);

  useEffect(() => {
    const quiz = generateQuiz(type, numberOfQuestions, difficulty);
    setQuestions(quiz);
    loadSounds();
    return () => releaseSounds();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Quit Quiz?',
          'Are you sure you want to quit? Your progress will be lost.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Quit', onPress: () => navigation.navigate('Home') },
          ],
        );
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeOut();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedAnswer(null);

    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [
      ...answersRef.current,
      {
        question: currentQuestion,
        selectedAnswer: null,
        isCorrect: false,
        timeSpent: 30,
      },
    ];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    playWrong();
    hapticError();

    setTimeout(() => handleNext(), 2000);
  };

  const handleAnswerSelect = answer => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctOption;

    if (isCorrect) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      playCorrect();
      hapticSuccess();
    } else {
      playWrong();
      hapticError();
    }

    const newAnswers = [
      ...answersRef.current,
      {
        question: currentQuestion,
        selectedAnswer: answer,
        isCorrect,
        timeSpent: 30 - timeLeft,
      },
    ];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    setTimeout(() => handleNext(), 1500);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const finalAnswers = answersRef.current;
    const finalScore = scoreRef.current;

    const quizResult = {
      type,
      difficulty,
      totalQuestions: numberOfQuestions,
      score: finalScore,
      percentage: (finalScore / numberOfQuestions) * 100,
      date: new Date().toISOString(),
      answers: finalAnswers,
    };

    await saveStats(quizResult);
    navigation.replace('Result', { result: quizResult });
  };

  const saveStats = async result => {
    try {
      const existingStats = await AsyncStorage.getItem('quizStats');
      let stats = existingStats
        ? JSON.parse(existingStats)
        : {
            totalQuizzes: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            byType: {},
            history: [],
          };

      stats.totalQuizzes += 1;
      stats.totalQuestions += result.totalQuestions;
      stats.totalCorrect += result.score;

      if (!stats.byType[result.type]) {
        stats.byType[result.type] = { quizzes: 0, questions: 0, correct: 0 };
      }

      stats.byType[result.type].quizzes += 1;
      stats.byType[result.type].questions += result.totalQuestions;
      stats.byType[result.type].correct += result.score;

      stats.history.unshift({
        type: result.type,
        difficulty: result.difficulty,
        score: result.score,
        total: result.totalQuestions,
        percentage: result.percentage,
        date: result.date,
      });

      if (stats.history.length > 20) stats.history = stats.history.slice(0, 20);

      await AsyncStorage.setItem('quizStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  if (questions.length === 0) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.headerInfo}>
        <Text style={[styles.questionCounter, { color: theme.textSecondary }]}>
          Question {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <View
          style={[styles.timerContainer, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.timer, timeLeft <= 10 && styles.timerWarning]}>
            ⏱ {timeLeft}s
          </Text>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: theme.text }]}>
          Score: {score}
        </Text>
      </View>

      <View
        style={[styles.questionContainer, { backgroundColor: theme.surface }]}
      >
        <Text style={[styles.questionText, { color: theme.text }]}>
          {currentQuestion.text}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctOption;
          const showCorrect = isAnswered && isCorrect;
          const showWrong = isAnswered && isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
                showCorrect && styles.correctOption,
                showWrong && styles.wrongOption,
                isSelected && !isAnswered && styles.selectedOption,
              ]}
              onPress={() => handleAnswerSelect(option)}
              disabled={isAnswered}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: theme.text },
                  (showCorrect || showWrong) && styles.optionTextWhite,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isAnswered && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              selectedAnswer === currentQuestion.correctOption
                ? styles.correctFeedback
                : styles.wrongFeedback,
            ]}
          >
            {selectedAnswer === currentQuestion.correctOption
              ? '✓ Correct!'
              : `✗ Wrong! The answer is ${currentQuestion.correctOption}`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progressBarContainer: { height: 4, backgroundColor: '#e0e0e0' },
  progressBar: { height: '100%', backgroundColor: '#4A90E2' },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionCounter: { fontSize: 16, fontWeight: '600' },
  timerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
  },
  timer: { fontSize: 16, fontWeight: 'bold', color: '#4A90E2' },
  timerWarning: { color: '#F44336' },
  scoreContainer: { alignItems: 'center', marginBottom: 20 },
  scoreText: { fontSize: 18, fontWeight: '600' },
  questionContainer: {
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 15,
    elevation: 3,
    marginBottom: 30,
  },
  questionText: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  optionsContainer: { paddingHorizontal: 20 },
  optionButton: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 2,
  },
  selectedOption: { borderColor: '#4A90E2', backgroundColor: '#f0f8ff' },
  correctOption: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  wrongOption: { backgroundColor: '#F44336', borderColor: '#F44336' },
  optionText: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
  optionTextWhite: { color: '#fff' },
  feedbackContainer: { marginTop: 20, alignItems: 'center' },
  feedbackText: { fontSize: 18, fontWeight: '600' },
  correctFeedback: { color: '#4CAF50' },
  wrongFeedback: { color: '#F44336' },
});

export default QuizScreen;
