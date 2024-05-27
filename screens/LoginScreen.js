import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';


const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();


  useEffect(() => {
    checkLoginStatus();
  }, []);


  const sateStates = () => {
    setEmail("");
    setPassword("");
  }

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        navigation.replace("Home");
      } else {
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
      .post("http://10.0.2.2:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
    
        Alert.alert("Logowanie udane", `Witamy Cię ${email}!`);
        console.log("Zalogowano: " + email);
        setEmail("");
        setPassword("");
        navigation.replace("Home");
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
      colors={['#a8e063', '#56ab2f', '#004d00']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.Background}>

      <KeyboardAvoidingView>
        <View style={styles.Container}>
          
            <Text style={styles.Text1}>Greensenger </Text>

          <View style={styles.EmailContainer}>
            <Text style={styles.EmailText}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder='Wprowadź email'
              placeholderTextColor={'lightgreen'}
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
              placeholderTextColor={'lightgreen'}
              style={styles.Input}
            />
          </View>
          
          <View style={styles.LoginButton}>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.LoginText}>Zaloguj się </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'darkgreen',
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
    color: 'lightgreen',
    fontSize: hp('2.7')
  },
  LoginButton:{
    backgroundColor: 'lightgreen',
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
    color: 'lightgreen',
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