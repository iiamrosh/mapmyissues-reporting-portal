import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Issue } from '../types';
import { formatCurrency, formatDate, capitalize } from '../utils/helpers';
import { PRIORITY_COLORS, STATUS_COLORS } from '../constants/config';

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: PRIORITY_COLORS[issue.priority], borderLeftWidth: 4 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.type}>{capitalize(issue.type)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[issue.status] },
          ]}
        >
          <Text style={styles.badgeText}>{capitalize(issue.status)}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {issue.description}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.location}>📍 {issue.location}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.votes}>👍 {issue.votes || 0}</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: PRIORITY_COLORS[issue.priority] },
            ]}
          >
            <Text style={styles.badgeText}>{capitalize(issue.priority)}</Text>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(issue.createdAt)}</Text>
      </View>

      {issue.photo && (
        <Image source={{ uri: issue.photo }} style={styles.photo} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votes: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  photo: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
});
