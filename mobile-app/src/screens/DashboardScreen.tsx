import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import { IssueCard } from '../components/IssueCard';
import { InsightsCard } from '../components/InsightsCard';
import { sortIssuesByColumn } from '../utils/helpers';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { issues, loading, refreshIssues } = useIssues();

  const recentIssues = sortIssuesByColumn(issues, 'recent').slice(0, 5);
  const queueIssues = sortIssuesByColumn(issues, 'queue').slice(0, 5);
  const inprogressIssues = sortIssuesByColumn(issues, 'inprogress').slice(0, 5);
  const completedIssues = sortIssuesByColumn(issues, 'completed').slice(0, 5);

  const renderSection = (title: string, items: any[], status: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title} ({sortIssuesByColumn(issues, status).length})
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Issues', { status })}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>No issues in this category</Text>
      ) : (
        items.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onPress={() => navigation.navigate('IssueDetails', { issueId: issue.id })}
          />
        ))
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshIssues} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome, {user?.username}
        </Text>
        <Text style={styles.role}>
          Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </Text>
      </View>

      {user?.role === 'citizen' && <InsightsCard issues={issues} />}

      {renderSection('Recent', recentIssues, 'recent')}
      {renderSection('Queue', queueIssues, 'queue')}
      {renderSection('In Progress', inprogressIssues, 'inprogress')}
      {renderSection('Completed', completedIssues, 'completed')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#005fcc',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#005fcc',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
