import { Alert, Pressable, StyleSheet, Text, View, StatusBar, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import jwt_decode from "jwt-decode";
import axios from 'axios'; 
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import User from "../component/User";
import FriendRequest from '../component/FriendRequest'



const HomeScreen = () => {
    
  const navigation = useNavigation();
    const {userId, setUserId} = useContext(UserType);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);



    useLayoutEffect(() => {
      navigation.setOptions({
          headerStyle: {backgroundColor: "black"},
          headerTitle: "",
          headerLeft:() => (
              <Text style={{fontSize: wp(5), fontWeight:"bold", color: "white"}}> FreshTalk</Text>
          ),    
          headerRight: () => (    
              <View style={styles.HeaderRightView}>

                <Pressable onPress={() => navigation.navigate("Czaty")} >
                  <Entypo  name="chat" size={wp(7)} color="white" />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Profil")}>
                   <FontAwesome name="user" size={wp(7)} color="white" />
                </Pressable>  

              </View>        
          ),
          
      });    
  }, []); 
    
    useEffect(() => {
          const fetchUsers = async () => {
          const token = await AsyncStorage.getItem("authToken");
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.id;
          setUserId(userId);
          AsyncStorage.setItem("currentUserId", userId);

    
          axios
            .get(`http://192.168.0.30:8000/users/${userId}`)
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
              console.log("error retrieving users", error);
            });
        };
    
        fetchUsers();
        fetchFriends();

      }, [users]);

      const fetchFriends = async () => {
        try {
          const response = await axios.get(
            `http://192.168.0.30:8000/friend-request/${userId}`
          );
          if (response.status === 200) {
            const friendRequestsData = response.data.map((friendReq) => ({
              _id: friendReq._id,
              name: friendReq.name,
              email: friendReq.email,
              image: friendReq.image,
            })
          );
  
            setFriendRequests(friendRequestsData);
          }
        } catch (error) {
          console.log("Error fetching friends: " + error);
        }
      };


    const filterUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <KeyboardAvoidingView style={styles.Container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>

      <StatusBar barStyle="light-content" />
      <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Wyszukaj użytkownika"
            placeholderTextColor={'lightgrey'}
            color= {'#fff'}
        />
      <KeyboardAvoidingView style={styles.SearchContainer}     behavior="height">
        <ScrollView>
           {filterUsers.map((item, index) => (
            <User key={index} item={item} />
          ))}
          </ScrollView>
      </KeyboardAvoidingView>
      
       { friendRequests.length > 0 && <Text style={styles.RequestText}>Zaproszenia do znajomych:</Text>} 
        <KeyboardAvoidingView 
          behavior="height"
          style={styles.FriendRequestContainer}
        >
        <ScrollView>
          {friendRequests.map((item, index) => (
              <FriendRequest 
                  key={index} 
                  item={item} 
                  friendRequests={friendRequests}
                  setFriendRequests={setFriendRequests}
                />
          ))}
        </ScrollView>
        </KeyboardAvoidingView>

    </KeyboardAvoidingView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#131414',
    },
    HeaderRightView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    searchInput: {
      height: hp(6),
      backgroundColor: '#4d4d4d',
      borderColor: '#131414',
      borderWidth: 1,
      paddingLeft: wp(8),
      margin: hp(2),
      borderRadius: 50,
  },
  SearchContainer: {
    flex: 1,
    maxHeight: hp(55),
    borderBottomWidth: hp(0.1),
    borderColor: "#333634",
  },
  FriendRequestContainer: {
    flex: 1,
    maxHeight: hp(25),
  },
  RequestText: {
    color: 'white',
    fontSize: wp(5),
    textAlign: 'flex-start',
    marginTop: hp(2),
  },
})
