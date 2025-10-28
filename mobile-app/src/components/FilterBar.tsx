import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { FilterOptions } from '../types';
import { DEPARTMENTS } from '../constants/config';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(tempFilters);
    setModalVisible(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      status: '',
      priority: '',
      department: '',
      sortOrder: 'createdAt_desc',
    };
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
    setModalVisible(false);
  };

  const activeFilterCount = [
    filters.status,
    filters.priority,
    filters.department,
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>
          🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.optionGroup}>
                {['', 'recent', 'queue', 'inprogress', 'completed'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.option,
                      tempFilters.status === status && styles.optionActive,
                    ]}
                    onPress={() =>
                      setTempFilters({ ...tempFilters, status })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempFilters.status === status && styles.optionTextActive,
                      ]}
                    >
                      {status || 'All'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.optionGroup}>
                {['', 'low', 'medium', 'immediate', 'urgent'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.option,
                      tempFilters.priority === priority && styles.optionActive,
                    ]}
                    onPress={() =>
                      setTempFilters({ ...tempFilters, priority })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempFilters.priority === priority && styles.optionTextActive,
                      ]}
                    >
                      {priority || 'All'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionGroup}>
                {[
                  { label: 'Newest First', value: 'createdAt_desc' },
                  { label: 'Oldest First', value: 'createdAt_asc' },
                  { label: 'Priority High to Low', value: 'priority_desc' },
                  { label: 'Priority Low to High', value: 'priority_asc' },
                  { label: 'Votes High to Low', value: 'votes_desc' },
                  { label: 'Votes Low to High', value: 'votes_asc' },
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort.value}
                    style={[
                      styles.option,
                      tempFilters.sortOrder === sort.value && styles.optionActive,
                    ]}
                    onPress={() =>
                      setTempFilters({ ...tempFilters, sortOrder: sort.value })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempFilters.sortOrder === sort.value &&
                          styles.optionTextActive,
                      ]}
                    >
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    backgroundColor: '#005fcc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: '#005fcc',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  optionTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resetButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  applyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#005fcc',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
