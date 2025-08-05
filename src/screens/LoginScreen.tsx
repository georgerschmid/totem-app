import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useAuth} from '../contexts/AuthContext';

/**
 * LoginScreen provides a simple interface for users to either log in or
 * register using an email address and password.  The GodotFirebase plugin
 * demonstrates similar functions (`login_with_email_and_password` and
 * `signup_with_email_and_password`) for GDScript【661707396329274†L185-L238】.
 */
const LoginScreen: React.FC = () => {
  const {signInWithEmail, signUpWithEmail} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handlePress = async () => {
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: any) {
      Alert.alert('Authentication error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Totem App</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={mode === 'login' ? 'Log In' : 'Register'} onPress={handlePress} />
      <View style={{marginTop: 12}}>
        <Button
          title={mode === 'login' ? 'Need an account? Register' : 'Have an account? Log In'}
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default LoginScreen;