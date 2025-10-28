import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'admin' | 'department'>('citizen');
  const [district, setDistrict] = useState('');
  const [town, setTown] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password || !role) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (role === 'citizen' && (!district || !town)) {
      Alert.alert('Error', 'Please select district and town');
      return;
    }

    if (role === 'department' && !department) {
      Alert.alert('Error', 'Please select a department');
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginCredentials = {
        username,
        password,
        role,
        district: role === 'citizen' ? district : undefined,
        town: role === 'citizen' ? town : undefined,
        department: role === 'department' ? department : undefined,
      };

      await login(credentials);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>MapMyIssues</Text>
          <Text style={styles.subtitle}>Portal Login</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Role</Text>
          <View style={styles.roleContainer}>
            {(['citizen', 'admin', 'department'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleButton, role === r && styles.roleButtonActive]}
                onPress={() => setRole(r)}
              >
                <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {role === 'citizen' && (
            <>
              <Text style={styles.label}>District</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter district"
                value={district}
                onChangeText={setDistrict}
              />

              <Text style={styles.label}>Town</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter town"
                value={town}
                onChangeText={setTown}
              />
            </>
          )}

          {role === 'department' && (
            <>
              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter department code"
                value={department}
                onChangeText={setDepartment}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005fcc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#005fcc',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  roleTextActive: {
    color: 'white',
  },
  button: {
    backgroundColor: '#005fcc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a0c8ff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#005fcc',
    fontSize: 14,
  },
});
