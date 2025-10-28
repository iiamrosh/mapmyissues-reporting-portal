import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import { createIssue, uploadPhoto } from '../services/supabase';
import { ISSUE_TYPES, DEPARTMENTS } from '../constants/config';
import { isDuplicateNearby } from '../utils/helpers';

export const ReportIssueScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { issues, refreshIssues } = useIssues();
  
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required');
        return;
      }

      setLoading(true);
      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toFixed(6));
      setLongitude(loc.coords.longitude.toFixed(6));

      // Reverse geocode to get location name
      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const locationName = [addr.street, addr.city, addr.region]
          .filter(Boolean)
          .join(', ');
        setLocation(locationName || 'Current Location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!type || !description || !location || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Invalid coordinates');
      return;
    }

    const coords = { lat, lng };

    // Check for duplicates
    if (isDuplicateNearby(issues, type, coords)) {
      Alert.alert(
        'Duplicate Warning',
        'A similar issue exists nearby. Do you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => submitIssue(coords) },
        ]
      );
      return;
    }

    await submitIssue(coords);
  };

  const submitIssue = async (coords: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      let photo_url = '';
      if (photoUri) {
        photo_url = await uploadPhoto(photoUri, 'issue.jpg');
      }

      const payload = {
        type,
        description,
        location,
        latitude: coords.lat,
        longitude: coords.lng,
        photo_url,
        priority: 'low',
        status: 'recent',
        department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
        expense: Math.floor(Math.random() * 1000) + 100,
      };

      await createIssue(payload);
      await refreshIssues();

      Alert.alert('Success', 'Issue submitted successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);

      // Reset form
      setType('');
      setDescription('');
      setLocation('');
      setLatitude('');
      setLongitude('');
      setPhotoUri('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Issue Type *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter issue type (e.g., pothole, garbage)"
          value={type}
          onChangeText={setType}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue in detail..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.helperText}>
          {description.length}/500 characters
        </Text>

        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Latitude *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.000000"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Longitude *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.000000"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <Text style={styles.locationButtonText}>
            {loading ? 'Getting Location...' : '📍 Use Current Location'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Photo (Optional)</Text>
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Text style={styles.photoButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>🖼️ Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {photoUri && (
          <View style={styles.photoPreview}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() => setPhotoUri('')}
            >
              <Text style={styles.removePhotoText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Issue</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  form: {
    padding: 16,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  photoPreview: {
    marginTop: 12,
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removePhoto: {
    marginTop: 8,
    padding: 8,
  },
  removePhotoText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#005fcc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0c8ff',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
