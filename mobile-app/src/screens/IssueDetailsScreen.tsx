import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import { addVote, updateIssue, deleteIssue } from '../services/supabase';
import { formatCurrency, formatCoords, formatDate, capitalize } from '../utils/helpers';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_ORDER } from '../constants/config';

export const IssueDetailsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { issueId } = route.params;
  const { user } = useAuth();
  const { issues, refreshIssues } = useIssues();
  const [loading, setLoading] = useState(false);

  const issue = issues.find((i) => i.id === issueId);

  if (!issue) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Issue not found</Text>
      </View>
    );
  }

  const hasVoted = issue.votedBy.includes(user?.username || '');
  const canVote =
    user?.role === 'citizen' &&
    ['recent', 'queue', 'inprogress'].includes(issue.status) &&
    !hasVoted;

  const handleVote = async () => {
    if (!canVote) return;

    setLoading(true);
    try {
      await addVote(issue.id, user?.username || '');
      await refreshIssues();
      Alert.alert('Success', 'Vote added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add vote');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async () => {
    const idx = STATUS_ORDER.indexOf(issue.status);
    if (idx < 0 || idx >= STATUS_ORDER.length - 1) return;
    const next = STATUS_ORDER[idx + 1];

    setLoading(true);
    try {
      await updateIssue(issue.id, { status: next });
      await refreshIssues();
      Alert.alert('Success', `Status updated to ${next}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this issue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteIssue(issue.id);
              await refreshIssues();
              Alert.alert('Success', 'Issue deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete issue');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.type}>{capitalize(issue.type)}</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: PRIORITY_COLORS[issue.priority] },
            ]}
          >
            <Text style={styles.badgeText}>
              {capitalize(issue.priority)}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[issue.status] },
          ]}
        >
          <Text style={styles.badgeText}>{capitalize(issue.status)}</Text>
        </View>

        <Text style={styles.description}>{issue.description}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📍 Location:</Text>
          <Text style={styles.value}>{issue.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📌 Coordinates:</Text>
          <Text style={styles.value}>{formatCoords(issue.coordinates)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>👍 Votes:</Text>
          <Text style={styles.value}>{issue.votes || 0}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🏢 Department:</Text>
          <Text style={styles.value}>{issue.department}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>💰 Estimated Cost:</Text>
          <Text style={styles.value}>{formatCurrency(issue.expense)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Created:</Text>
          <Text style={styles.value}>{formatDate(issue.createdAt)}</Text>
        </View>

        {issue.photo && (
          <Image source={{ uri: issue.photo }} style={styles.photo} />
        )}

        {canVote && (
          <TouchableOpacity
            style={[styles.button, styles.voteButton]}
            onPress={handleVote}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>👍 Upvote</Text>
            )}
          </TouchableOpacity>
        )}

        {user?.role === 'admin' && (
          <View style={styles.adminControls}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.advanceButton,
                issue.status === 'completed' && styles.buttonDisabled,
              ]}
              onPress={handleAdvanceStatus}
              disabled={loading || issue.status === 'completed'}
            >
              <Text style={styles.buttonText}>
                {issue.status === 'completed' ? 'Completed' : 'Advance Status'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Delete Issue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  type: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 140,
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  voteButton: {
    backgroundColor: '#007bff',
  },
  advanceButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminControls: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
