import { Image, Pressable, StyleSheet, Text, View, Modal, Button, TextInput, Alert } from 'react-native'
import React, { useEffect, useContext, useState, useLayoutEffect} from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";


const ProfileScreen = () => {
    const {userId, setUserId} = useContext(UserType);
    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageChange, setIsImageChange] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); 
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(null);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);


const showDialog = () => {
  setDialogVisible(true);
};

const showDeleteSuccess = () => {
  setDeleteSuccessVisible(true);
};

const handleCancel = () => {
  setDialogVisible(false);
};


    useLayoutEffect(() => {
      navigation.setOptions({
          headerStyle: {backgroundColor: "black"},
          headerTintColor: '#fff', // This sets the color of the header title to white
          headerTitleAlign: 'center',

      });    
  }, []); 

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.30:8000/user/${userId}`
      );

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.log("error retrieving details", error);
    }
  };


  useEffect(() => {
    fetchUserData();
    setIsImageChange(false);
  }, [userData]);
  


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
  
    if (!result.canceled) {
      const newImage = result.assets[0].uri;

      fetch(`http://192.168.0.30:8000/user/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: newImage
          })
        })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      setIsImageChange(true);
    }
  };

  const changePasswordHandle = () => {
    setModalVisible(true);
    setOldPassword("");
     setNewPassword("")
  };

  const changePassword = async () => {
    

    fetch(`http://192.168.0.30:8000/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oldPassword: oldPassword, 
        newPassword: newPassword
      })
    })
    .then(response => {
      console.log('response received', response);
      if (response.ok) {
        Alert.alert(
          "Zmieniono hasło",
          "Pomyślnie udało się zmienić hasło.",
          [
            { text: "OK" }
          ]
        );
      } else {
        Alert.alert(
          "Błąd",
          "Nie udało się zmienić hasła. Spróbuj ponownie.",
          [
            { text: "OK" }
          ]
        );
      }

      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
    });

    setNewPassword("");
    setOldPassword("");

  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://192.168.0.30:8000/user/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setUserId(null);
        navigation.replace("Login");
        showDeleteSuccess();
      } else {
        console.log("error deleting account", response.status.message);
      }
    } catch (error) {
      console.log("error deleting account", error);
    }
    setDialogVisible(false);
  };
  
  const deleteAccount = () => {
    showDialog();
  };
        



  const handleLogoutCancel = () => {
    setLogoutDialogVisible(false);
  };
  
  const handleLogoutConfirm = async () => {
    try {
      setUserId(null);
      navigation.replace("Login");
      setLogoutDialogVisible(false);
    } catch (error) {
      console.error('Error removing authToken:', error);
    }
  };
        
    
  return (
    <View style={styles.Container}>
      <Image source={{uri: userData.image}} style={styles.ImageContainer} />
      <Text style={styles.NameText}> {userData.name} </Text>
      <View style={styles.OptionsContainer}>
        <Modal
            backgroundColor='black'
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={{width: wp('100%'), height: hp('100%')}}>
              <View style={styles.ModalContainer}>
                <Ionicons name="arrow-back" size={hp(8)} color="lightgrey" style={{marginBottom: hp(4) }} onPress={() => setModalVisible(!modalVisible)}/>
                <View style={styles.PressContainer} >
                  <TextInput
                      style={{fontSize: wp(5), color: 'lightgrey'}}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Wprowadź nowe hasło"
                      placeholderTextColor={'lightgrey'}
                      color= {'#fff'}
                  />
                </View>

                <View style={styles.PressContainer} >
                  <TextInput
                      style={{fontSize: wp(5), color: 'lightgrey'}}
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      placeholder="Wprowadź stare hasło"
                      placeholderTextColor={'lightgrey'}
                      color= {'#fff'}
                  />
                </View>

                <Pressable style={styles.ButtonContainer} onPress={changePassword}>
                  <Text style={styles.Text2}>Zmień hasło</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

        <Pressable style={styles.PressContainer} onPress={pickImage}>
          <Text style={styles.Text}>Zmień zdjęcie</Text>
          <FontAwesome name="photo" size={wp(8)} color="lightgrey" />
        </Pressable>

        <Pressable style={styles.PressContainer} onPress={changePasswordHandle}>
          <Text style={styles.Text}>Zmień hasło</Text>
          <MaterialIcons name="password" size={wp(8)} color="lightgrey" />
        </Pressable>

        <Pressable style={styles.PressContainer} onPress={deleteAccount}>
          <Text style={styles.Text}>Usuń konto</Text>
          <AntDesign name="deleteuser" size={wp(8)} color="lightgrey" />
        </Pressable>

        <Pressable style={styles.PressContainer} onPress={() => setLogoutDialogVisible(true)}>
          <Text style={styles.Text}>Wyloguj się</Text>
          <Entypo name="log-out" size={wp(8)} color="lightgrey" />
        </Pressable>
      </View>

       {/* Alert dialog for deleting account */}
       <Dialog.Container 
          visible={dialogVisible}
          contentStyle={{ backgroundColor: '#282a36', borderRadius: 20, alignItems: 'center'}}
        >
          <Dialog.Title style={{ color: '#ff5555' }}>Usuwanie konta</Dialog.Title>
          <Dialog.Description style={{ color: 'white' }}>
            Czy na pewno chcesz usunąć swoje konto?
          </Dialog.Description>
          <Dialog.Button label="Anuluj" color="white" onPress={handleCancel}  style={{paddingRight: wp(20), fontSize: wp(4), fontWeight: 'bold'}}/>
          <Dialog.Button label="Usuń" color="#ff5555" onPress={handleDelete} style={{paddingRight: wp(0), fontSize: wp(4), fontWeight: 'bold'}}/>
        </Dialog.Container>

        {/* Alert dialog for logging out */}
        <Dialog.Container 
          visible={logoutDialogVisible}
          contentStyle={{ backgroundColor: '#282a36', borderRadius: 20, alignItems: 'center'}}
        >
          <Dialog.Title style={{ color: '#ff5555' }}>Wylogowywanie</Dialog.Title>
          <Dialog.Description style={{ color: 'white' }}>
            Czy na pewno chcesz się wylogować?
          </Dialog.Description>
          <Dialog.Button 
            label="Anuluj" 
            color="white" 
            onPress={handleLogoutCancel}  
            style={{paddingRight: wp(20), fontSize: wp(4), fontWeight: 'bold'}}
          />
          <Dialog.Button 
            label="Wyloguj" 
            color="#ff5555" 
            onPress={handleLogoutConfirm} 
            style={{paddingRight: wp(0), fontSize: wp(4), fontWeight: 'bold'}}
          />
        </Dialog.Container>

    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#131414',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ImageContainer: {
    marginTop: hp('1'),
    width: wp('50%'),
    height: hp('25%'),
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  NameText: {
    marginTop: hp(1),
    fontSize: wp(8),
    color: 'lightgrey',
    fontWeight: 'bold',
  },
  OptionsContainer: {
    marginTop: hp('5'),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('80%'),
    height: hp('50%'),
  },
  PressContainer:{
    width: wp('80%'),
    height: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    marginBottom: hp(4),
  },
  Text: {
    fontSize: wp(6),
    color: 'lightgrey',
    marginRight: wp(10),
  }, 
  ModalContainer: {
    width: wp(100),
    height: hp(60),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#131414',
},
ButtonContainer: {
  width: wp(80),
  height: hp(10),
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: 30,
  backgroundColor: '#616161',
  borderWidth: 1,
  borderColor: 'white',
},
Text2: {
  fontSize: wp(6),
  color: 'black',
  fontWeight: '600',
},

})