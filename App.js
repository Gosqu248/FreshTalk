import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import React from 'react';
import HomeScreen from './screens/HomeScreen';
import { UserContext } from './UserContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <UserContext>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;


function GradientHeaderBackground() {
  return (
    <LinearGradient
      colors={['#a8e063', '#56ab2f', '#004d00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}      style={{ flex: 1 }}
      
    />
  );
}
