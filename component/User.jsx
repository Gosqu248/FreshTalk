import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const User = ({item}) => {
  const {userId, setUserId} = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [requestCancelled, setRequestCancelled] = useState(false);


 useEffect(() => {
  retrieveRequestSent();
}, []);

const retrieveRequestSent = async () => {
  try {
    const currentUserId = await AsyncStorage.getItem("currentUserId");

    const response = await fetch(`http://192.168.0.30:8000/sent-friend-request/${currentUserId}`);
    if (response.ok) {
      const data = await response.json();
      
      if(data.some(user => user._id === item._id)) {
        setRequestSent(true);
      }
    }
  } catch (error) {
    console.log("Error retrieving requestSent", error);
  }
};

const sentFriendRequest = async (currentUserId, selectedUserId) => {
  try {
    let url = 'http://192.168.0.30:8000/friend-request';
    let actionMessage = "Error sending friend request";
    console.log("Sending friend request");

    if (requestSent) {
      url = 'http://192.168.0.30:8000/cancel-friend-request';
      actionMessage = "Error cancelling friend request";
      console.log("Cancelling friend request");
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({currentUserId, selectedUserId}),
    });

    if(response.ok) {
      const newRequestSent = !requestSent;
      setRequestSent(newRequestSent);
    }
  } catch (error) {
      console.log("Error sending friend request", error);
  }
};
 

  return (
    <Pressable style={styles.LogoContainer}>
        <View>
            <Image style={styles.Logo} source={{uri: item.image}}></Image>
        </View>

        <View style={styles.UsersInfoContainer}>
            <Text style={styles.NameText}>{item.name}</Text>
            <Text style={styles.EmailText}>{item.email}</Text>
        </View>

    
      <LinearGradient
        colors={requestSent ? ['#808080', '#808080'] : ['#ADD8E6', '#0FFFFF']}
        style={styles.AddFriendButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Pressable 
          onPress={() => sentFriendRequest(userId, item._id)}>
          <Text style={styles.ButtonText}>
            {requestSent ? (requestCancelled ? 'Dodaj do znajomych' : 'Anuluj prośbę') : 'Dodaj do znajomych'}
          </Text>
        </Pressable>
      </LinearGradient>

    </Pressable>
  )
}

export default User

const styles = StyleSheet.create({
    LogoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1.2),
        marginLeft: wp(3),
    },
    Logo: {
        width: wp(14),
        height: hp(6),
        borderRadius: hp(3),
    },
    UsersInfoContainer: {
        marginLeft: wp(3),
        flex: 1,
    },
    NameText: {
        fontSize: hp(2),
        fontWeight: 'bold',
    },
    EmailText: {
        fontSize: hp(1.8),
    },
    AddFriendButton: {
        padding: hp(1.5),
        borderRadius: 10,
        marginLeft: wp(3),
        marginRight: wp(2.2),
    },
    ButtonText: {
      fontSize: hp(1.8),
    },
})