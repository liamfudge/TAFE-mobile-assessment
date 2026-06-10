import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Data
const initialPeople = [
  { id: 1, name: "Harry Potter", phone: "0456 789 123", departmentId: 1, address: { street: "23 Magic Street", city: "Hogwarts", state: "NSW", zip: "0100", country: "Australia" } },
  { id: 2, name: "Hermione Granger", phone: "0456 789 123", departmentId: 2, address: { street: "23 Magic Street", city: "Hogwarts", state: "QLD", zip: "1101", country: "Australia" } },
  { id: 3, name: "Ron Weasley", phone: "0456 789 123", departmentId: 3, address: { street: "23 Magic Street", city: "Hogwarts", state: "VIC", zip: "1001", country: "Australia" } },
  { id: 4, name: "Albus Dumbledore", phone: "0456 789 123", departmentId: 2, address: { street: "23 Magic Street", city: "Hogwarts", state: "NT", zip: "1010", country: "Australia" } },
  { id: 5, name: "Severus Snape", phone: "0456 789 123", departmentId: 3, address: { street: "23 Magic Street", city: "Hogwarts", state: "NSW", zip: "0110", country: "Australia" } },
]
const staticDepartments = [
  { id: 0, name: "General" },
  { id: 1, name: "Information Communications Technology" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Human Resources" }
]

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const [ profiles, setProfiles ] = useState(initialPeople);
  const [ departments, setDepartments ] = useState(staticDepartments);

  const [ textSizeMultiplier, setTextSizeMultiplier ] = useState(1.0);
  const [ appBrightness, setAppBrightness ] = useState(1.0);
  const [ soundEnabled, setSoundEnabled ] = useState(true);

  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    async function loadStoredAppState() {
      try {
        const [ savedProfiles, savedTextSize, savedBrightness, savedSound ] = await Promise.all([
          AsyncStorage.getItem('staff_profiles_stored'),
          AsyncStorage.getItem('text_size_preference_storage'),
          AsyncStorage.getItem('brightness_preference_storage'),
          AsyncStorage.getItem('sound_preference_storage')
        ]);

        if(savedProfiles !== null){
          setProfiles(JSON.parse(savedProfiles));
        } else {
          setProfiles(initialPeople);
          await AsyncStorage.setItem('staff_profiles_stored', JSON.stringify(initialPeople));
        }

        if (savedTextSize !== null) setTextSizeMultiplier(parseFloat(savedTextSize));
        if (savedBrightness !== null) setAppBrightness(parseFloat(savedBrightness));
        if (savedSound !== null) setSoundEnabled(savedSound === 'true');

      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredAppState();
  }, []);

  const saveToDisk = async (updatedProfiles) => {
    try {
      await AsyncStorage.setItem('staff_profiles_stored', JSON.stringify(updatedProfiles));
    } catch (error) {
      console.log(error);
    }
  };

  const addProfile = (newProfile) => {
    const nextId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
    const updated = [...profiles, { ...newProfile, id: nextId }];
    setProfiles(updated);
    saveToDisk(updated);
  }
  const updateProfile = (id, updatedFields) => {
    const updated = profiles.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProfiles(updated);
    saveToDisk(updated);
  }

  const persistTextSize = async (size) => {
    setTextSizeMultiplier(size);
    await AsyncStorage.setItem('text_size_preference_storage', size.toString());
  };
  const persistBrightness = async (level) => {
    setAppBrightness(level);
    await AsyncStorage.setItem('brightness_preference_storage', level.toString());
  };
  const persistSoundToggle = async (flag) => {
    setSoundEnabled(flag);
    await AsyncStorage.setItem('sound_preference_storage', flag.toString());
  };



  return (
    <AppStateContext.Provider value={{  profiles, departments, addProfile, updateProfile, textSizeMultiplier, setTextSizeMultiplier: persistTextSize, appBrightness, setAppBrightness: persistBrightness, soundEnabled, setSoundEnabled: persistSoundToggle }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppStore() {
  return useContext(AppStateContext);
}