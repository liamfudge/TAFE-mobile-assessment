import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, TouchableWithoutFeedback, Modal } from 'react-native';
import { useAppStore } from '../store/AppContext';
import { MaterialIcons } from '@expo/vector-icons';

import { playFeedbackSound } from './audioService';

export default function NavBar({ title, currentScreen, onBack }) {
  const { textSizeMultiplier, setTextSizeMultiplier, appBrightness, setAppBrightness, soundEnabled, setSoundEnabled } = useAppStore();

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false);

  const closeMenu = () => {
    playFeedbackSound(soundEnabled);
    setIsDropdownVisible(false);
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.mainBar}>
        {currentScreen !== 'LIST'
          ? <TouchableOpacity style={styles.navButton} onPress={() => { playFeedbackSound(soundEnabled); onBack(); }}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          : <View style={styles.emptySlot} />
        }
        <Text style={[styles.headerTitle, { fontSize: 18 * textSizeMultiplier }]} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.navButton} onPress={() => { playFeedbackSound(soundEnabled); setIsDropdownVisible(!isDropdownVisible); }}>
          <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <Modal visible={isDropdownVisible} transparent={true} animationType="none" onRequestClose={closeMenu}>

          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.modalOverlayBackdrop}>

              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={styles.floatingCardMenu}>
                  <Text style={styles.dropdownTitle}>Accessibility Controls</Text>
                  
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Text Size</Text>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity style={[styles.pill, textSizeMultiplier === 1.0 && styles.activePill]} onPress={() => { setTextSizeMultiplier(1.0); playFeedbackSound(soundEnabled); }}>
                        <Text style={[styles.pillText, textSizeMultiplier === 1.0 && styles.activeText]}>1.0x</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.pill, textSizeMultiplier === 1.25 && styles.activePill]} onPress={() => { setTextSizeMultiplier(1.25); playFeedbackSound(soundEnabled); }}>
                        <Text style={[styles.pillText, textSizeMultiplier === 1.25 && styles.activeText]}>1.2x</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.pill, textSizeMultiplier === 1.45 && styles.activePill]} onPress={() => { setTextSizeMultiplier(1.45); playFeedbackSound(soundEnabled); }}>
                        <Text style={[styles.pillText, textSizeMultiplier === 1.45 && styles.activeText]}>1.4x</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Brightness</Text>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity style={[styles.pill, appBrightness === 1.0 && styles.activePill]} onPress={() => { setAppBrightness(1.0); playFeedbackSound(soundEnabled); }}>
                        <Text style={[styles.pillText, appBrightness === 1.0 && styles.activeText]}>Full</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.pill, appBrightness === 0.6 && styles.activePill]} onPress={() => { setAppBrightness(0.6); playFeedbackSound(soundEnabled); }}>
                        <Text style={[styles.pillText, appBrightness === 0.6 && styles.activeText]}>Dim</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Audio Cues</Text>
                    <Switch value={soundEnabled} onValueChange={(val) => { setSoundEnabled(val); if(val) console.log("🔈 Audio feedback enabled."); }} />
                  </View>

                  <TouchableOpacity style={styles.closeCardButton} onPress={closeMenu}>
                    <Text style={styles.closeCardText}>Close Menu</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>

            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: '#0288D1', elevation: 6 },
  mainBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  navButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4 },
  headerTitle: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', flex: 1 },
  emptySlot: { width: 65 },
  
  modalOverlayBackdrop: { flex: 1, backgroundColor: 'transparent', position: 'relative' },
  
  floatingCardMenu: {
    position: 'absolute',
    top: 60,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    width: 280,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownTitle: { fontSize: 11, fontWeight: '700', color: '#0288D1', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  controlLabel: { fontSize: 13, color: '#333333', fontWeight: '600' },
  buttonGroup: { flexDirection: 'row', gap: 4 },
  pill: { backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0' },
  activePill: { backgroundColor: '#0288D1', borderColor: '#0288D1' },
  pillText: { fontSize: 11, fontWeight: '600', color: '#555555' },
  activeText: { color: '#FFFFFF' },
  closeCardButton: { marginTop: 14, backgroundColor: '#EEEEEE', padding: 8, borderRadius: 6, alignItems: 'center' },
  closeCardText: { fontSize: 12, color: '#666666', fontWeight: 'bold' }
})