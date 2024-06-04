import { StyleSheet, Text, View } from 'react-native'
import React, {useContext, useEffect, useState, useLayoutEffect } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native';
import ChatUser from '../component/ChatUser';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ChatsScreen = () => {
    const {userId, setUserId} = useContext(UserType);
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {backgroundColor: "#131414"},
            headerTintColor: '#fff', // This sets the color of the header title to white
            
        });    
    }, []); 

    const fetchMessagesAndSortChats = async () => {
        try {
            const response = await axios.get(
                `http://192.168.0.30:8000/accepted-friends/${userId}`
            );
            if (response.status === 200) {
                const friendsData = await Promise.all(response.data.map(async (friend) => {
                    const messagesResponse = await axios.get(`http://192.168.0.30:8000/messages/${userId}/${friend._id}`);
                    const lastMessage = messagesResponse.data[messagesResponse.data.length - 1];
                    return {
                        _id: friend._id,
                        name: friend.name,
                        email: friend.email,
                        image: friend.image,
                        lastMessageDate: lastMessage ? new Date(lastMessage.timeStamp) : new Date(0), // Jeśli nie ma ostatniej wiadomości, przypisz bardzo starą datę
                    };
                }));
    
                let sortedChats = [...friendsData].sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
                
                setChats(sortedChats);
            }
        } catch (error) {
            console.log("Error fetching friends: " + error);
        }
    };
    
    useEffect(() => {
        fetchMessagesAndSortChats();
    }, []);

    console.log(chats);

return (
    <View style={styles.Container}>
        <View>
      {chats.map((item, index) => (
        <ChatUser 
            key={index} 
            item={item} 
            chats={chats}
            setChats={setChats}
            />
      ))}
            
        </View>
    </View>
  )
}

export default ChatsScreen


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#131414',
    },
    ChatsText: {
      padding: wp(2.5),
      marginHorizontal: wp(2),
    }
  })