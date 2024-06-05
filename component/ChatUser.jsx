import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import { UserType } from '../UserContext';

const ChatUser = ({item}) => {

const navigation = useNavigation();
const {userId, setUserId} = useContext(UserType);
const [messages, setMessages] = useState([]);

const fetchMessages = async () => {
    try {
      const response = await fetch(`http://192.168.0.30:8000/messages/${userId}/${item._id}`);

      const data = await response.json();
    
      if(response.ok){
        
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  const formatTime = (time) => {
    const messageDate = new Date(time);
    const weekAgo = new Date();
    const dayAgo = new Date();
    
    weekAgo.setDate(weekAgo.getDate() - 7);
    dayAgo.setDate(dayAgo.getDate() - 1);
    
    if(messageDate < weekAgo){
      const dateOptions = { day: 'numeric', month: 'long', year: 'numeric'};
      const timeOptions = { hour: '2-digit',  minute: '2-digit', hour12: false }; 
      
      const date = messageDate.toLocaleDateString('pl-PL', dateOptions);
      const time = messageDate.toLocaleTimeString('pl-PL', timeOptions);
      
      return date + " o " + time;
    } else if(messageDate < dayAgo){
      const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false };
      return messageDate.toLocaleTimeString('pl-PL', options);
    } else {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return messageDate.toLocaleTimeString('pl-PL', options);
    }
};
  
  const lastMessage = messages[messages.length - 1];

  return (
    <Pressable style={styles.Container}
        onPress={() => navigation.navigate("Messages", {
            recepientId: item._id,
          })}>
        <Image style={styles.Logo} source={{uri: item?.image}}></Image>

        <View style={styles.TextContainer}>
            <Text style={styles.NameText}>{item?.name}</Text>  
            { lastMessage 
              ? (
                lastMessage?.messageType === "image"
                ? <Text style={styles.LastSentText}>{lastMessage?.recepientId === item?._id ? "Ty:  " : ""}Wysłano zdjęcie</Text>
                : (lastMessage?.messageType === "audio"
                  ? <Text style={styles.LastSentText}>{lastMessage?.recepientId === item?._id ? "Ty:  " : ""}Wysłano wiadomość głosową</Text>
                  : <Text style={styles.LastSentText}>{lastMessage?.recepientId === item?._id ? "Ty:  " : ""}{lastMessage?.message}</Text> 
                )
              )
              : <Text style={styles.LastSentText}>Zacznij konwersacje</Text>
            }
        </View>

        <View style={styles.TimeContainer}>
        { lastMessage  
           ? <Text style={styles.LastSentText}>{formatTime(lastMessage.timeStamp)}</Text>
            : null
        }
        </View>

    </Pressable>
    )
}

export default ChatUser

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: hp(1),
        borderTopWidth: hp(0.1),
        paddingBottom: hp(2.5),
        borderWidth: hp(0.1),
        borderColor: "#333634",
        borderRadius: 20,
        marginBottom: hp(1),
    },
    Logo: {
        width: wp(14),
        height: hp(6),
        borderRadius: 25,
    },
    TextContainer:{
        flexDirection: 'column',
        flex: 1,
        marginLeft: wp(3),
    },
    NameText: {
        fontSize: wp(5),
        color: '#ffffff',
    },
    LastSentText: {
        fontSize: wp(3.5),
        color: '#c0c2c1',
        maxWidth: wp(65),
    },
    TimeContainer: {
        borderRadius: 10,
    }
})