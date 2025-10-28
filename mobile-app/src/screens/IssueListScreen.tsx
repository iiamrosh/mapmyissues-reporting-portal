import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useIssues } from '../context/IssueContext';
import { IssueCard } from '../components/IssueCard';
import { FilterBar } from '../components/FilterBar';
import { filterIssues, sortIssues, paginateIssues } from '../utils/helpers';
import { FilterOptions } from '../types';

export const IssueListScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { issues, loading, refreshIssues } = useIssues();
  const [filters, setFilters] = useState<FilterOptions>({
    status: route.params?.status || '',
    priority: '',
    department: '',
    sortOrder: 'createdAt_desc',
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredIssues = filterIssues(issues, filters);
  const sortedIssues = sortIssues(filteredIssues, filters.sortOrder || 'createdAt_desc');
  const paginatedIssues = paginateIssues(sortedIssues, page, pageSize);
  const totalPages = Math.ceil(sortedIssues.length / pageSize);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <FlatList
        data={paginatedIssues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={() => navigation.navigate('IssueDetails', { issueId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshIssues} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No issues found</Text>
        }
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
                onPress={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <Text style={styles.pageButtonText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                Page {page} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  list: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  pageButton: {
    backgroundColor: '#005fcc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
