import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const RegistierScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigation = useNavigation();

  const handleRegister =  async () => {
    try {
      const response = await fetch("http://192.168.0.30:8000/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

        const data = await response.json();

        if (response.ok) {
          Alert.alert(
            "Rejestracja udana", 
            "Udało ci się zarejestrować"
          );
          setName("");
          setEmail("");
          setPassword("");
          console.log("Rejestracja udana: ");
          navigation.navigate("Login");

        } else {
          throw new Error('Nieudana rejestracja' + data.message);
        } 
        } catch (error) {
          Alert.alert(
            "Rejestracja nieudana", 
            "Spróbuj ponownie"
          );
          console.log("Rejestracja nieudana: " + error);
    }
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#131414', '#191919']}
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.Background}>

      <KeyboardAvoidingView>
        <View style={styles.Container}>
          
            <Text style={styles.Text1}>FreshTalk </Text>

            <View style={styles.EmailContainer}>
            <Text style={styles.EmailText}>Nazwa</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder='Wprowadź nazwę'
              placeholderTextColor={'#0FFFFF'}
              style={styles.Input}
            />
          </View>

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
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.LoginText}>Zarejestruj się </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.Container2}>
          
         <View style={styles.SignContainer}>
             <Text style={styles.SignText1}> Masz konto?</Text>
             <TouchableOpacity
                 onPress= {() => {
                   navigation.goBack();
                 }}>
                 <Text style={styles.SignText2}> Zaloguj się</Text>
             </TouchableOpacity>
         </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default RegistierScreen

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
    height: hp('75'),
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