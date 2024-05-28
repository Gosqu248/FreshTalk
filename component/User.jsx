import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, {useContext, useState} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { UserType } from "../UserContext";


const User = ({item}) => {
  const {userId, setUserId} = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [requestCancelled, setRequestCancelled] = useState(false);


  const sentFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      let url = 'http://10.0.2.2:8000/friend-request';
      let actionMessage = "Error sending friend request";

      if (requestSent) {
        url = 'http://10.0.2.2:8000/cancel-friend-request';
        actionMessage = "Error cancelling friend request";
      }

      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({currentUserId, selectedUserId}),
      });

      if(response.ok) {
        setRequestSent(!requestSent);
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
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
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
        marginVertical: 10,
        marginLeft: 10,
    },
    Logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    UsersInfoContainer: {
        marginLeft: 10,
        flex: 1,
    },
    AddFriendButton: {
        padding: 10,
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 10,
    }
})