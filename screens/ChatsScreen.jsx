import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, {useContext, useEffect, useState, useLayoutEffect } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native';
import ChatUser from '../component/ChatUser';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ChatsScreen = () => {
    const navigation = useNavigation();
    const {userId, setUserId} = useContext(UserType);
    const [chats, setChats] = useState([]);
    const [searchText, setSearchText] = useState('');
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {backgroundColor: "black"},
            headerTintColor: '#fff', // This sets the color of the header title to white
            headerTitleAlign: 'center',

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
    }, [chats]);

    
    const displayedChats = searchText
    ? chats.filter(chat => 
        chat.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : chats;


return (
    <View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Wyszukaj znajomego"
            placeholderTextColor={'lightgrey'}
            color= {'#fff'}
        />
        {displayedChats.map((item, index) => (
            <ChatUser 
            key={index} 
            item={item} 
            chats={chats}
            setChats={setChats}
            />
        ))}
    </View>
  )
}

export default ChatsScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131414',
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
  });