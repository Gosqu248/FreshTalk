import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { UserType } from '../UserContext'


const LoginScreen = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {userId, setUserId} = useContext(UserType);

  const sateStates = () => {
    setEmail("");
    setPassword("");
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      if(userId) {
        navigation.replace("Home");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleLogin = async () => {

    const user = {
      email: email,
      password: password,
    };
    
    axios
      .post("http://192.168.0.30:8000/login", user)
      .then((response) => {
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
    
        Alert.alert("Logowanie udane", `Witamy Cię ${email}!`);
        console.log("Zalogowano: " + email);
        navigation.replace("Home");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data.message === "User not found") {
            Alert.alert("Logowanie nieudane", "Niezarejestrowany użytkownik");
          } else if (error.response.data.message === "Invalid credentials") {
            Alert.alert("Logowanie nieudane", "Nieprawidłowy email lub hasło");
          } else {
            Alert.alert("Logowanie nieudane", "Błąd logowania");
          }
          console.log("Nieudane logowanie: ", error.response.data.message);
        } else if (error.request) {
          Alert.alert("Błąd sieci", "Brak odpowiedzi serwera");
          console.log("Błąd sieci: ", error.request);
        } else {
          Alert.alert("Błąd", "Coś poszło nie tak");
          console.log("Inny błąd: ", error.message);
        }
        console.log("Błąd logowania: ", error);
      });
  };

  return (
    <LinearGradient
        colors={['#0A0A0A', '#131414', '#191919']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.Background}>
      <KeyboardAvoidingView>
        <View style={styles.Container}>
          
            <Text style={styles.Text1}>FreshTalk</Text>

          <View style={styles.EmailContainer}>
            <Text style={styles.EmailText}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder='Wprowadź email'
              placeholderTextColor={'#0FFFFF'}
              style={styles.Input}
            />
          </View>

          <View style={styles.EmailContainer}>
            <Text style={styles.EmailText}>Hasło</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder='Wprowadź hasło'
              secureTextEntry={true}
              placeholderTextColor={'#0FFFFF'}
              style={styles.Input}
            />
          </View>
          
          <LinearGradient
            colors={['#ADD8E6', '#0FFFFF']}
            style={styles.LoginButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} >
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.LoginText}>Zaloguj się </Text>
            </TouchableOpacity>
          </LinearGradient>

        </View>

        <View style={styles.Container2}>

        <Text style={styles.SignText1}>Lub zaloguj się za pomocą</Text>
          
                    <View style={styles.SignContainer}>
                        <Text style={styles.SignText1}> Nie masz konta?</Text>
                        <TouchableOpacity
                            onPress= {() => {
                              sateStates();
                              navigation.navigate('Register');
                            }}>

                            <Text style={styles.SignText2}> Zarejestruj się</Text>
                        </TouchableOpacity>
                    </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>

  );
}

export default LoginScreen

const styles = StyleSheet.create({
  Background: {
    flex:1,
    alignItems: 'center',
    padding: 10,
  },
  Container: {
    marginTop: hp('4'),
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'black',
    width: wp('80'),
    height: hp('52'),
  },
 
  Text1: {
    fontSize: wp('9%'),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp('3%'),
  },
  EmailContainer: {
    marginBottom: hp('3')
  },
  EmailText: {
    width: wp('50'),
    fontSize: wp('6'),
    color: 'white',
  },
  Input: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: hp('1'),
    width: wp('50'),
    height: hp('5'),
    color: '#0FFFFF',
    fontSize: hp('2.7')
  },
  LoginButton:{
    width: wp('50'),
    height: hp('7'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  LoginText: {
    fontSize: wp('6'),
    color: 'black',
    fontWeight: 'bold'
  },  
  Container2: {
    marginTop: hp('2'),
    alignItems: 'center',
    borderRadius: 30,
    width: wp('80'),
    height: hp('30'),
  },
  SignContainer:{
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 20,
},
SignText1:{
    color: 'white',
    fontSize: wp('5'),
},
SignText2:{
    color: '#0FFFFF',
    fontSize: wp('5'),
    fontWeight: 'bold',
},
GoogleButton: {
    width: wp('50'),
    height: hp('7'),
    borderRadius: 20,
    marginTop: hp('2')
}

})