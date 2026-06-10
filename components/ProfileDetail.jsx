import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppStore } from '../store/AppContext';
import { playFeedbackSound } from './audioService';

export default function ProfileDetail({ onNavigate, profileId }) {
  const { profiles, departments, textSizeMultiplier, soundEnabled } = useAppStore();

  const staff = profiles.find(p => p.id === profileId);

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'General';
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}</Text>
          </View>
          <Text style={[styles.nameText, { fontSize: 22 * textSizeMultiplier }]}>{staff.name}</Text>
          <Text style={[styles.deptText, { fontSize: 14 * textSizeMultiplier }]}>{getDepartmentName(staff.departmentId)}</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionLabel}>Contact Details</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#0288D1" style={{ marginRight: 12, marginTop: 2 }} />
            <Text style={[styles.infoValueText, { fontSize: 15 * textSizeMultiplier }]}>{staff.phone}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionLabel}>Company Address</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={20} color="#0288D1" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={styles.addressBlock}>
              <Text style={[styles.infoValueText, { fontSize: 15 * textSizeMultiplier }]}>{staff.address.street}</Text>
              <Text style={[styles.infoValueText, { fontSize: 15 * textSizeMultiplier }]}>{staff.address.city}, {staff.address.state} {staff.address.zip}</Text>
              <Text style={[styles.infoValueText, { fontSize: 15 * textSizeMultiplier }]}>{staff.address.country}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => { playFeedbackSound(soundEnabled); onNavigate('FORM', { mode: 'EDIT', id: staff.id }) }} activeOpacity={0.8}>
          <Text style={styles.editButtonText}>Edit Profile Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' 
  },
  scrollContent: {
    padding: 20,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  deptText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0288D1',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressBlock: {
    flex: 1,
  },
  infoValueText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: '#0288D1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})