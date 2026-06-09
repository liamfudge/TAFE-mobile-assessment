import { createContext, useContext, useState } from 'react';

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

  const addProfile = (newProfile) => {
    const nextId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
    setProfiles([...profiles, { ...newProfile, id: nextId }]);
  }

  const updateProfile = (id, updatedFields) => {
    setProfiles(profiles.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  }

  return (
    <AppStateContext.Provider value={{  profiles, departments, addProfile, updateProfile, textSizeMultiplier, setTextSizeMultiplier, appBrightness, setAppBrightness, soundEnabled, setSoundEnabled }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppStore() {
  return useContext(AppStateContext);
}