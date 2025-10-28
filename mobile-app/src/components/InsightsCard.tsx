import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Issue } from '../types';
import { formatCurrency } from '../utils/helpers';

interface InsightsCardProps {
  issues: Issue[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ issues }) => {
  const completedIssues = issues.filter((i) => i.status === 'completed');
  const completedCount = completedIssues.length;
  const totalSpending = completedIssues.reduce((s, it) => s + (it.expense || 0), 0);

  const deptCounts: Record<string, number> = {};
  completedIssues.forEach((issue) => {
    deptCounts[issue.department] = (deptCounts[issue.department] || 0) + 1;
  });

  const topDept =
    Object.keys(deptCounts).length > 0
      ? Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'None';

  const priorityCounts = { low: 0, medium: 0, immediate: 0, urgent: 0 };
  completedIssues.forEach((issue) => {
    priorityCounts[issue.priority] = (priorityCounts[issue.priority] || 0) + 1;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Insights</Text>
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#e8f5e8' }]}>
          <Text style={styles.cardLabel}>Total Completed</Text>
          <Text style={styles.cardValue}>{completedCount}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#e3f2fd' }]}>
          <Text style={styles.cardLabel}>Top Department</Text>
          <Text style={styles.cardValueSmall} numberOfLines={2}>
            {topDept}
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#fff3e0' }]}>
          <Text style={styles.cardLabel}>Total Spending</Text>
          <Text style={styles.cardValue}>{formatCurrency(totalSpending)}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#f0f8ff' }]}>
          <Text style={styles.cardLabel}>By Priority</Text>
          <Text style={styles.cardValueSmall}>
            L:{priorityCounts.low} M:{priorityCounts.medium} I:
            {priorityCounts.immediate} U:{priorityCounts.urgent}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValueSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
