import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
          headerTitle: "",
          headerLeft:() => (
              <Text style={{fontSize:16, fontWeight:"bold"}}> FreshTalk Chat </Text>
          ),    
          headerRight: () => (    
              <View style={styles.HeaderRightView}>

                <Pressable onPress={() => navigation.navigate("Login")} >
                  <Entypo  name="chat" size={24} color="black" />
                </Pressable>
                <Pressable onPress={ () => navigation.navigate("Login")}>
                  <Ionicons name="people" size={24} color="black" />
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
    
          axios
            .get(`http://10.0.2.2:8000/users/${userId}`)
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
              console.log("error retrieving users", error);
            });
        };
    
        fetchUsers();
      }, []);


      console.log("userId ", userId);
      console.log("users ", users);
      
  return (
    <View>
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
        gap: 10,
    },
   
})
