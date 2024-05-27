import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const RegistierScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  
  const navigation = useNavigation();

  const handleRegister =  async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          image,
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
          setImage("");
          console.log("Rejestracja udana: ");

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
      colors={['#a8e063', '#56ab2f', '#004d00']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.Background}>

      <KeyboardAvoidingView>
        <View style={styles.Container}>
          
            <Text style={styles.Text1}>Greensenger </Text>

            <View style={styles.EmailContainer}>
            <Text style={styles.EmailText}>Nick</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder='Wprowadź nick'
              placeholderTextColor={'lightgreen'}
              style={styles.Input}
            />
          </View>

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
          <View style={styles.EmailContainer}>
            <Text style={styles.EmailText}>Logo</Text>
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              placeholder='Wprowadź logo'
              placeholderTextColor={'lightgreen'}
              style={styles.Input}
            />
          </View>
          
          <View style={styles.LoginButton}>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.LoginText}>Zarejestruj się </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'darkgreen',
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