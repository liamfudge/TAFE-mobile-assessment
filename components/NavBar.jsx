import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, TouchableWithoutFeedback, Modal, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppStore } from '../store/AppContext';
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

              <TouchableWithoutFeedback onPress={(e) => {e.stopPropagation()}}>
                <View style={styles.floatingCardMenu}>
                  <Text style={styles.dropdownTitle}>Accessibility Controls</Text>

                  <View style={styles.controlBlock}>
                    <View style={styles.sliderLabelRow}>
                      <Text style={styles.controlLabel}>Text Size</Text>
                    </View>

                    {Platform.OS === 'web'
                      ? <input type="range" min={1} max={2} step={0.05} value={textSizeMultiplier} onChange={(e) => setTextSizeMultiplier(e.target.value)} onMouseUp={()=>{ playFeedbackSound(soundEnabled)}} style={{ width: '100%', height: '40px', cursor: 'pointer', accentColor: '#0288D1' }} />
                      : <View style={styles.stepperContainer}>
                        <TouchableOpacity style={styles.stepButton} onPress={() => { if(textSizeMultiplier > 1.0) setTextSizeMultiplier(textSizeMultiplier - 0.05); playFeedbackSound(soundEnabled); }}>
                          <Text style={styles.stepButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.stepperValueText}>Tap to Scale</Text>
                        <TouchableOpacity style={styles.stepButton} onPress={() => { if(textSizeMultiplier < 1.5) setTextSizeMultiplier(textSizeMultiplier + 0.05); playFeedbackSound(soundEnabled); }}>
                          <Text style={styles.stepButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    }

                  </View>
                  
                  {/*<br/>*/}
                  
                  <View style={styles.controlBlock}>
                    <View style={styles.sliderLabelRow}>
                      <Text style={styles.controlLabel}>Brightness</Text>
                    </View>

                    {
                      Platform.OS === 'web'
                        ? <input type="range" min={0.1} max={1} step={0.05} value={appBrightness} onChange={(e) => {setAppBrightness(e.target.value)}} onMouseUp={() => playFeedbackSound(soundEnabled)} style={{ width: '100%', height: '40px', cursor: 'pointer', accentColor: '#0288D1' }} />
                        : <View style={styles.stepperContainer}>
                          <TouchableOpacity style={styles.stepButton} onPress={() => { if(appBrightness > 0.4) setAppBrightness(appBrightness - 0.05); playFeedbackSound(soundEnabled); }}>
                            <Text style={styles.stepButtonText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.stepperValueText}>Adjust Intensity</Text>
                          <TouchableOpacity style={styles.stepButton} onPress={() => { if(appBrightness < 1.0) setAppBrightness(appBrightness + 0.05); playFeedbackSound(soundEnabled); }}>
                            <Text style={styles.stepButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                    }
                  </View>

                  {/*<br/>*/}

                  <View style={styles.controlBlock}>
                    <View style={styles.sliderLabelRow}><Text style={styles.controlLabel}>Audio Cues</Text></View>
                    {/*<br/>*/}
                    <Switch value={soundEnabled} onValueChange={(val) => { setSoundEnabled(val); if(val) console.log("🔈 Audio feedback enabled."); }} />
                  </View>

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
  controlLabel: { fontSize: 13, color: '#333333', fontWeight: '600' },

  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 4,
    marginTop: 6
  },
  stepButton: {
    backgroundColor: '#0288D1',
    width: 44,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  stepperValueText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600'
  }
})