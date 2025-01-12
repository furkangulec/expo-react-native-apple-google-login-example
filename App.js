import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function App() {
  const [loading, setLoading] = useState(false);

  const validateWithBackend = async (appleCredential) => {
    try {
      const payload = {
        identityToken: appleCredential.identityToken,
        authorizationCode: appleCredential.authorizationCode,
      };

      // Eğer isim bilgisi varsa ekle
      if (appleCredential.fullName?.familyName || appleCredential.fullName?.givenName) {
        payload.appleName = `${appleCredential.fullName?.givenName || ''} ${appleCredential.fullName?.familyName || ''}`.trim();
      }

      // Detaylı log
      console.log('\n=== APPLE SIGN IN DATA ===');
      console.log('Identity Token:', appleCredential.identityToken);
      console.log('Authorization Code:', appleCredential.authorizationCode);
      console.log('Full Name:', appleCredential.fullName);
      console.log('Email:', appleCredential.email);
      console.log('\n=== REQUEST PAYLOAD ===');
      console.log(JSON.stringify(payload, null, 2));
      console.log('\n========================');

      try {
        const response = await fetch('http://localhost:5040/Nexus/Api/User/AppleTokenValidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Backend validation response:', data);
        return data;
      } catch (error) {
        console.log('Backend request failed. You can use the logged data above to make the request manually.');
        throw error;
      }
    } catch (error) {
      console.error('Backend validation error:', error);
      throw error;
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });
      
      // Handle successful sign in
      console.log('Apple Sign In success:', credential);
      
      // Validate with backend
      const validationResult = await validateWithBackend(credential);
      console.log('Validation result:', validationResult);

    } catch (error) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.log('User canceled Apple Sign In');
      } else {
        console.log('Apple Sign In error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Giriş Yap</Text>
        
        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" style={styles.buttonIcon} />
          ) : (
            <AntDesign name="apple1" size={24} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>Apple ile Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  appleButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 