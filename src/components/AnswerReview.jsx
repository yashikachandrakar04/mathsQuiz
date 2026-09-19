import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const AnswerReview = ({ answers, onClose }) => {
  const wrongAnswers = (answers || []).filter((a) => !a.isCorrect);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review ({wrongAnswers.length} wrong)</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {wrongAnswers.length === 0 ? (
          <Text style={styles.perfect}>🎉 Perfect score!</Text>
        ) : (
          wrongAnswers.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.question}>{item.question.text}</Text>
              <View style={styles.row}>
                <Text style={styles.wrong}>
                  Your answer: {item.selectedAnswer ?? 'Timeout'}
                </Text>
                <Text style={styles.correct}>
                  Correct: {item.question.correctOption}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeButton: { fontSize: 24, color: '#666' },
  list: { flex: 1 },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  wrong: { color: '#F44336', fontSize: 14 },
  correct: { color: '#4CAF50', fontSize: 14 },
  perfect: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4CAF50',
    marginTop: 40,
  },
});

export default AnswerReview;