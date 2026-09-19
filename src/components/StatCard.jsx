import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ value, label, color = '#4A90E2' }) => {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  value: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  label: { fontSize: 12, color: '#fff', marginTop: 5, opacity: 0.9 },
});

export default StatCard;