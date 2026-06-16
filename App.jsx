import { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, useWindowDimensions, Text } from 'react-native';
import { AppStateProvider, useAppStore } from './store/AppContext';

import NavBar from './components/NavBar';
import DirectoryList from './components/DirectoryList';
import ProfileDetail from './components/ProfileDetail';
import ProfileForm from './components/ProfileForm';

function MainAppRouter() {
  const [ currentScreen, setCurrentScreen ] = useState('LIST');
  const [ navigationParams, setNavigationParams ] = useState({});
  const { appBrightness, textSizeMultiplier } = useAppStore();
  
  const { width } = useWindowDimensions();
  const isTabletLandscape = width >= 768;

  const navigateTo = (screenName, params = {}) => {
    setNavigationParams(params);
    setCurrentScreen(screenName);
  }

  const getScreenTitle = () => {
    if(isTabletLandscape) return 'Dashboard';
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


  if (isTabletLandscape) {
    return (
      <View style={styles.blackUnderlay}>
        <View style={[styles.appViewContainer, { opacity: appBrightness }]}>
          <NavBar title={getScreenTitle()} currentScreen="LIST" onBack={() => {}} />
          
          <View style={styles.dualPaneWrapper}>
            <View style={styles.leftPane}>
              <DirectoryList onNavigate={navigateTo} profileId={navigationParams.id} />
            </View>
            
            <View style={styles.rightPane}>
              {currentScreen === 'DETAIL' && (
                <ProfileDetail onNavigate={navigateTo} profileId={navigationParams.id} />
              )}
              {currentScreen === 'FORM' && (
                <ProfileForm onNavigate={navigateTo} formState={navigationParams} />
              )}
              {currentScreen === 'LIST' && (
                <View style={styles.emptyStateContainer}>
                  <Text style={[styles.emptyStateText, { fontSize: 16 * textSizeMultiplier }]}>Select an employee profile to see details.</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  const renderActivePhoneScreen = () => {
    switch (currentScreen) {
      case 'LIST': return <DirectoryList onNavigate={navigateTo} />;
      case 'DETAIL': return <ProfileDetail onNavigate={navigateTo} profileId={navigationParams.id} />;
      case 'FORM': return <ProfileForm onNavigate={navigateTo} formState={navigationParams} />;
      default: return <DirectoryList onNavigate={navigateTo} />;
    }
  };

  return (
    <View style={styles.blackUnderlay}>
      <View style={[styles.appViewContainer, { opacity: appBrightness }]}>
        <NavBar title={getScreenTitle()} currentScreen={currentScreen} onBack={handleBackNavigation} />
        <View style={{ flex: 1 }}>
          {renderActivePhoneScreen()}
        </View>
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
  appViewContainer: { flex: 1, backgroundColor: '#FAFAFA' },

  dualPaneWrapper: { flex: 1, flexDirection: 'row' },
  leftPane: { width: 340, borderRightWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' },
  rightPane: { flex: 1, backgroundColor: '#FAFAFA' },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyStateText: { fontSize: 16, color: '#9E9E9E', textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  staffProfilesHeader: {fontSize:16,textAlign:'center',padding:8,fontWeight:'bold'},
});


