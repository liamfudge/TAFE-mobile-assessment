import { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { AppStateProvider, useAppStore } from './store/AppContext';

import NavBar from './components/NavBar';
import DirectoryList from './components/DirectoryList';
import ProfileDetail from './components/ProfileDetail';
import ProfileForm from './components/ProfileForm';

function MainAppRouter() {
  const [ currentScreen, setCurrentScreen ] = useState('LIST');
  const [ navigationParams, setNavigationParams ] = useState({});
  
  const { appBrightness } = useAppStore();

  const navigateTo = (screenName, params = {}) => {
    setNavigationParams(params);
    setCurrentScreen(screenName);
  }

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'LIST': return 'Staff Directory';
      case 'DETAIL': return 'Profile Details';
      case 'FORM': return navigationParams.mode === 'EDIT' ? 'Edit Profile' : 'Register New Staff';
      default: return 'Directory';
    }
  }

  const handleBackNavigation = () => {
    if(currentScreen === 'FORM' && navigationParams.mode === 'EDIT'){
      navigateTo('DETAIL', { id: navigationParams.id });
    } else {
      navigateTo('LIST');
    }
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'LIST': return <DirectoryList onNavigate={navigateTo} />;
      case 'DETAIL': return <ProfileDetail onNavigate={navigateTo} profileId={navigationParams.id} />;
      case 'FORM': return <ProfileForm onNavigate={navigateTo} formState={navigationParams} />;
      default: return <DirectoryList onNavigate={navigateTo} />;
    }
  }

  return (
    <View style={styles.blackUnderlay}>
      <View style={[styles.appViewContainer, { opacity: appBrightness }]}>
        <NavBar title={getScreenTitle()} currentScreen={currentScreen} onBack={handleBackNavigation} />
        <View style={{ flex: 1 }}>{renderActiveScreen()}</View>
      </View>
    </View>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <SafeAreaView style={styles.appWrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#01579B" />
        <MainAppRouter />
      </SafeAreaView>
    </AppStateProvider>
  )
}

const styles = StyleSheet.create({
  appWrapper: { flex: 1, backgroundColor: '#0288D1' },
  blackUnderlay: { flex: 1, backgroundColor: '#1A1A1A' },
  appViewContainer: { flex: 1, backgroundColor: '#FAFAFA' }
})