import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [currentButton, setCurrentButton] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      // Android için client ID'yi google-services.json dosyasından otomatik alır
    });
  }, []);

  const validateWithBackend = async (credential, type) => {
    try {
      let payload;
      let endpoint;

      if (type === 'apple') {
        payload = {
          identityToken: credential.identityToken,
          authorizationCode: credential.authorizationCode,
        };
        
        if (credential.fullName?.familyName || credential.fullName?.givenName) {
          payload.appleName = `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim();
        }
        
        endpoint = 'http://localhost:5040/Nexus/Api/User/AppleTokenValidate';
      } else if (type === 'google') {
        payload = {
          idToken: credential.idToken,
          user: {
            email: credential.user.email,
            name: credential.user.name,
          }
        };
        
        endpoint = 'YOUR_GOOGLE_VALIDATION_ENDPOINT'; // Backend'deki Google doğrulama endpoint'i
      }

      // Detaylı log
      console.log(`\n=== ${type.toUpperCase()} SIGN IN DATA ===`);
      console.log('Credential:', credential);
      console.log('\n=== REQUEST PAYLOAD ===');
      console.log(JSON.stringify(payload, null, 2));
      console.log('\n========================');

      try {
        const response = await fetch(endpoint, {
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
      setCurrentButton('apple');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });
      
      const validationResult = await validateWithBackend(credential, 'apple');
      console.log('Validation result:', validationResult);

    } catch (error) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.log('User canceled Apple Sign In');
      } else {
        console.log('Apple Sign In error:', error);
      }
    } finally {
      setLoading(false);
      setCurrentButton(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setCurrentButton('google');
      
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      
      // Detaylı Google Sign In logları
      console.log('\n=== GOOGLE SIGN IN DETAILS ===');
      console.log('ID Token:', tokens.idToken);
      console.log('Access Token:', tokens.accessToken);
      
      const currentUser = await GoogleSignin.getCurrentUser();
      console.log('User Info:', {
        email: currentUser?.email,
        name: currentUser?.name,
        familyName: currentUser?.familyName,
        givenName: currentUser?.givenName,
        id: currentUser?.id,
        photo: currentUser?.photo
      });
      console.log('\n========================');
      
      const validationResult = await validateWithBackend({
        idToken: tokens.idToken,
        user: currentUser
      }, 'google');
      console.log('Validation result:', validationResult);

    } catch (error) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('User canceled Google Sign In');
      } else {
        console.log('Google Sign In error:', error);
      }
    } finally {
      setLoading(false);
      setCurrentButton(null);
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
          {loading && currentButton === 'apple' ? (
            <ActivityIndicator color="white" style={styles.buttonIcon} />
          ) : (
            <AntDesign name="apple1" size={24} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>Apple ile Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading && currentButton === 'google' ? (
            <ActivityIndicator color="white" style={styles.buttonIcon} />
          ) : (
            <AntDesign name="google" size={24} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>Google ile Giriş Yap</Text>
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
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: '#4285F4',
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