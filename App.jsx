import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { UserContext } from './UserContext';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import FriendsScreen from './screens/FriendsScreen';
import ChatsScreen from './screens/ChatsScreen';
import MessagesScreen from './screens/MessagesScreen';
import CameraScreen from './screens/CameraScreen';
import ImageScreen from './screens/ImageScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <UserContext>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
              <Stack.Screen name="Home" component={HomeScreen}  />
              <Stack.Screen name="Friends" component={FriendsScreen} />
              <Stack.Screen name="Chats" component={ChatsScreen} />
              <Stack.Screen name="Messages" component={MessagesScreen} />
              <Stack.Screen name="Camera" component={CameraScreen} />
              <Stack.Screen name="Image" component={ImageScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131414',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

