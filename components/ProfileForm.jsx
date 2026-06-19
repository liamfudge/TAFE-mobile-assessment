import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Platform, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppStore } from '../store/AppContext';
import { playFeedbackSound } from './audioService';

export default function ProfileForm({ onNavigate, formState }) {
  const { profiles, departments, addProfile, updateProfile, soundEnabled } = useAppStore();
  
  const isEditMode = formState.mode === 'EDIT';
  const targetId = formState.id;

  const [ originalProfile, setOriginalProfile ] = useState(null);
  const [ name, setName ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ departmentId, setDepartmentId ] = useState(0);
  const [ street, setStreet ] = useState('');
  const [ city, setCity ] = useState('');
  const [ state, setState ] = useState('');
  const [ zip, setZip ] = useState('');
  const [ country, setCountry ] = useState('Australia');

  const [ isSuccessModalVisible, setIsSuccessModalVisible ] = useState(false);

  const [ isIosPickerVisible, setIsIosPickerVisible ] = useState(false);

  useEffect(() => {
    if(isEditMode && targetId){
      const existingStaff = profiles.find(p => p.id === targetId);
      if(existingStaff){
        setOriginalProfile(existingStaff);
        setName(existingStaff.name);
        setPhone(existingStaff.phone);
        setDepartmentId(existingStaff.departmentId);
        setStreet(existingStaff.address.street);
        setCity(existingStaff.address.city);
        setState(existingStaff.address.state);
        setZip(existingStaff.address.zip);
        setCountry(existingStaff.address.country);
      }
    }
  }, [isEditMode, targetId, profiles]);

  const isSaveDisabled = (() => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedStreet = street.trim();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    const trimmedZip = zip.trim();
    const trimmedCountry = country.trim();
    if (!trimmedName || !trimmedPhone || !trimmedStreet || !trimmedCity || !trimmedState || !trimmedZip || !trimmedCountry) {
      return true;
    }
    if (isEditMode && originalProfile) {
      const hasNoChanges =
        trimmedName === originalProfile.name &&
        trimmedPhone === originalProfile.phone &&
        parseInt(departmentId, 10) === originalProfile.departmentId &&
        trimmedStreet === originalProfile.address.street &&
        trimmedCity === originalProfile.address.city &&
        trimmedState === originalProfile.address.state &&
        trimmedZip === originalProfile.address.zip &&
        trimmedCountry === originalProfile.address.country;
      return hasNoChanges;
    }
    return false;
  })();

  const handleExit = () => {
    playFeedbackSound(soundEnabled);
    if(isEditMode){
      onNavigate('DETAIL', { id: targetId });
    } else {
      onNavigate('LIST');
    }
  };

  const handleSave = () => {
    if (isSaveDisabled) return;

    playFeedbackSound(soundEnabled);
    const profileData = {
      name: name.trim(),
      phone: phone.trim(),
      departmentId: parseInt(departmentId, 10),
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.toUpperCase().trim(),
        zip: zip.trim(),
        country: country.trim()
      }
    };

    if(isEditMode){
      updateProfile(targetId, profileData);
    } else {
      addProfile(profileData);
    }

    setIsSuccessModalVisible(true);
  }

  const handleModalClose = () => {
    playFeedbackSound(soundEnabled);
    setIsSuccessModalVisible(false);
    if(isEditMode){
      onNavigate('DETAIL', { id: targetId });
    } else {
      onNavigate('LIST');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollForm}>
        <Text style={styles.fieldSectionLabel}>NAME</Text>
        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#9E9E9E" value={name} onChangeText={(e)=>{ playFeedbackSound(soundEnabled); setName(e) }} />

        <Text style={styles.fieldSectionLabel}>PHONE</Text>
        <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#9E9E9E" value={phone} onChangeText={(e)=>{ playFeedbackSound(soundEnabled); setPhone(e) }} keyboardType="phone-pad" />

        <Text style={styles.fieldSectionLabel}>ROLE</Text>
        {Platform.OS === 'ios' ? (
          <View>
            <TouchableOpacity style={styles.input} onPress={() => { playFeedbackSound(soundEnabled); setIsIosPickerVisible(true); }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#333333', fontSize: 15 }}>
                  {departments.find(d => d.id === parseInt(departmentId, 10))?.name || "Select Role"}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#0288D1" />
              </View>
            </TouchableOpacity>

            {/* modal for selecting an option on iOS */}
            <Modal visible={isIosPickerVisible} transparent={true} animationType="fade">
              <TouchableWithoutFeedback onPress={() => {setIsIosPickerVisible(false)}}>
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalCard, { maxWidth: 300, padding: 16 }]}>
                    <Text style={[styles.modalTitle, { fontSize: 16, color: '#0288D1', marginBottom: 14 }]}>
                      Select Department Role
                    </Text>
                    
                    {departments.map((dept) => {
                      const isSelected = parseInt(departmentId, 10) === dept.id;
                      return (
                        <TouchableOpacity key={dept.id} style={[styles.iosSelector,{backgroundColor: isSelected ? '#E1F5FE' : 'transparent', }]} onPress={() => { playFeedbackSound(soundEnabled); setDepartmentId(dept.id); setIsIosPickerVisible(false); }}>
                          <Text style={{fontSize: 14, fontWeight: isSelected ? '700' : '500',color: isSelected ? '#0288D1' : '#333333' }}>
                            {dept.name}
                          </Text>
                          {isSelected && <MaterialIcons name="check" size={18} color="#0288D1" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={departmentId} onValueChange={(itemValue) => { playFeedbackSound(soundEnabled); setDepartmentId(itemValue); }} style={styles.picker}>
              {departments.map((dept) => (
                <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.fieldSectionLabel}>Address</Text>
        <TextInput style={styles.input} placeholder="Street Address" placeholderTextColor="#9E9E9E" value={street} onChangeText={(e)=>{ playFeedbackSound(soundEnabled); setStreet(e) }} />
        <TextInput style={styles.input} placeholder="City" placeholderTextColor="#9E9E9E" value={city} onChangeText={(e)=>{ playFeedbackSound(soundEnabled); setCity(e) }} />
        
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="State (NSW)" placeholderTextColor="#9E9E9E" value={state} onChangeText={(e)=>{ playFeedbackSound(soundEnabled); setState(e) }} autoCapitalize="characters" />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Post Code" placeholderTextColor="#9E9E9E" value={zip} onChangeText={(e)=>{ playFeedbackSound(soundEnabled);  setZip(e) }} keyboardType="numeric" />
        </View>
        <TextInput style={styles.input} placeholder="Country" placeholderTextColor="#9E9E9E" value={country} onChangeText={(e)=>{ playFeedbackSound(soundEnabled); setCountry(e) }} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleExit}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[ styles.button, styles.saveButton, isSaveDisabled && styles.disabledButton ]} onPress={handleSave} disabled={isSaveDisabled} activeOpacity={0.7}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal animationType="fade" transparent={true} visible={isSuccessModalVisible} onRequestClose={handleModalClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconCircle}>
              <MaterialIcons name="check" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.modalTitle}>Action Successful</Text>
            <Text style={styles.modalBodyText}>The staff contact record has been successfully written and persisted to memory storage.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollForm: { padding: 20 },
  fieldSectionLabel: { fontSize: 11, fontWeight: '700', color: '#0288D1', textTransform: 'uppercase', marginTop: 14, marginBottom: 6, letterSpacing: 0.5 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, padding: 12, fontSize: 15, color: '#333333', marginBottom: 10 },
  pickerWrapper: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, marginBottom: 10, justifyContent: 'center' },
  picker: { height: 50, width: '100%', borderRadius: 6, borderColor: '#E0E0E0' },
  row: { flexDirection: 'row', gap: 10 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 40 },
  button: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  saveButton: { backgroundColor: '#4CAF50' },
  disabledButton: { backgroundColor: '#A5D6A7', opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#C62828' },
  cancelButtonText: { color: '#C62828', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 24, width: '100%', maxWidth: 340, alignItems: 'center', elevation: 24 },
  successIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E8F5E9', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  modalBodyText: { fontSize: 14, color: '#666666', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalButton: { backgroundColor: '#0288D1', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 6, width: '100%', alignItems: 'center' },
  modalButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  iosSelector: {width: '100%',paddingVertical: 12, paddingHorizontal: 10, borderRadius: 6, flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center', marginBottom: 4}
})