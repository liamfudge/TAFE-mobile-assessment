import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppStore } from '../store/AppContext';
import { playFeedbackSound } from './audioService';
import SearchBar from './SearchBar';

export default function DirectoryList({ onNavigate, profileId }) {
  const [searchQuery, setSearchQuery] = useState('');

  const { profiles, departments, textSizeMultiplier, soundEnabled } = useAppStore();

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'General';
  }

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <FlatList data={filteredProfiles} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, {borderColor: profileId === item.id ? '#ACCEDF' : '#E0E0E0', backgroundColor:  profileId === item.id ? '#F2F9FF' : '#FFFFFF'}]}  onPress={() => { playFeedbackSound(soundEnabled); onNavigate('DETAIL', { id: item.id }) }} activeOpacity={0.7}>
            <View style={styles.cardInfo}>
              <Text style={[styles.nameText, { fontSize: 16 * textSizeMultiplier}]}>{item.name}</Text>
              <Text style={[styles.deptText, { fontSize: 13 * textSizeMultiplier}]}>{getDepartmentName(item.departmentId)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={profileId === item.id ? '#000000' : '#DFDFDF'} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { playFeedbackSound(soundEnabled); onNavigate('FORM', { mode: 'ADD' }) }} activeOpacity={0.8}>
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  listContent: {
    padding: 16,
    paddingBottom: 80
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2
  },
  deptText: {
    fontSize: 13,
    color: '#757575'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
})