import { Alert, Pressable, StyleSheet, Text, View, StatusBar } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import jwt_decode from "jwt-decode";
import axios from 'axios'; 
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import User from "../component/User";

const HomeScreen = () => {
    
  const navigation = useNavigation();
    const {userId, setUserId} = useContext(UserType);
    const [users, setUsers] = useState([]);

    useLayoutEffect(() => {
      navigation.setOptions({
          headerStyle: {backgroundColor: "#131414"},
          headerTitle: "",
          headerLeft:() => (
              <Text style={{fontSize: wp(5), fontWeight:"bold", color: "white"}}> FreshTalk Chat </Text>
          ),    
          headerRight: () => (    
              <View style={styles.HeaderRightView}>

                <Pressable onPress={() => navigation.navigate("Chats")} >
                  <Entypo  name="chat" size={wp(7)} color="white" />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Friends")}>
                  <Ionicons name="people" size={wp(7)} color="white" />
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
      }, [users]);


      
      
  return (
    <View >
      <StatusBar barStyle="light-content" />
      <View>
           {users.map((item, index) => (
            <User key={index} item={item} />
          ))}
      </View>
      <Text>Home</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    HeaderRightView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
   
})
