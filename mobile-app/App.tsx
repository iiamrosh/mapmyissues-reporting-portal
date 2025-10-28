import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { IssueProvider } from './src/context/IssueContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </IssueProvider>
    </AuthProvider>
  );
}
