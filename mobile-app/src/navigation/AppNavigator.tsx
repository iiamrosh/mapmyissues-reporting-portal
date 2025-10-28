import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ReportIssueScreen } from '../screens/ReportIssueScreen';
import { IssueDetailsScreen } from '../screens/IssueDetailsScreen';
import { IssueListScreen } from '../screens/IssueListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#005fcc',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#005fcc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          title: 'MapMyIssues Dashboard',
        }}
      />
      {user?.role === 'citizen' && (
        <Tab.Screen
          name="ReportIssue"
          component={ReportIssueScreen}
          options={{
            tabBarLabel: 'Report',
            title: 'Report an Issue',
          }}
        />
      )}
      <Tab.Screen
        name="Issues"
        component={IssueListScreen}
        options={{
          tabBarLabel: 'Issues',
          title: 'All Issues',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="IssueDetails"
      component={IssueDetailsScreen}
      options={{
        title: 'Issue Details',
        headerStyle: {
          backgroundColor: '#005fcc',
        },
        headerTintColor: '#fff',
      }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
