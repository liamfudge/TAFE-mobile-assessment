import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppStore } from '../store/AppContext';
import { playFeedbackSound } from './audioService';

export default function SearchBar({ searchQuery, onSearchChange }) {
  const { soundEnabled } = useAppStore();

  const handleClear = () => {
    playFeedbackSound(soundEnabled);
    onSearchChange('');
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBarWrapper}>
        <MaterialIcons name="search" size={20} color="#757575" style={styles.searchIcon} />
        
        <TextInput style={styles.inputField} placeholder="Search staff name..." placeholderTextColor="#9E9E9E" value={searchQuery} onChangeText={(text) => { playFeedbackSound(soundEnabled); onSearchChange(text); }} autoCapitalize="none" autoCorrect={false} />

        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <MaterialIcons name="cancel" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: { padding: 4 },
});