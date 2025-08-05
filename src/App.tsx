import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';
import ArScreen from './screens/ArScreen';
import FriendsScreen from './screens/FriendsScreen';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import {GodotProvider} from 'react-native-godot';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="AR" component={ArScreen} />
    <Tab.Screen name="Friends" component={FriendsScreen} />
  </Tab.Navigator>
);

const RootNavigator: React.FC = () => {
  const {user} = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="Main" component={Tabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <GodotProvider>
      <AuthProvider>
        <SafeAreaView style={{flex: 1}}>
          <RootNavigator />
        </SafeAreaView>
      </AuthProvider>
    </GodotProvider>
  );
};

export default App;