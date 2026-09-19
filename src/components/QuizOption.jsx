import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const QuizOption = ({
  option,
  onPress,
  isSelected,
  isCorrect,
  showResult,
  disabled,
}) => {
  const getOptionStyle = () => {
    if (!showResult) return isSelected ? styles.selectedOption : styles.option;
    if (isCorrect) return styles.correctOption;
    if (isSelected && !isCorrect) return styles.wrongOption;
    return styles.option;
  };

  const getTextStyle = () => {
    if (showResult && (isCorrect || isSelected)) return styles.optionTextWhite;
    return styles.optionText;
  };

  return (
    <TouchableOpacity
      style={[styles.base, getOptionStyle()]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{option}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  option: { backgroundColor: '#fff' },
  selectedOption: { backgroundColor: '#f0f8ff', borderColor: '#4A90E2' },
  correctOption: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  wrongOption: { backgroundColor: '#F44336', borderColor: '#F44336' },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  optionTextWhite: { color: '#fff' },
});

export default QuizOption;