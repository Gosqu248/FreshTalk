import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, {useContext} from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { UserType } from '../UserContext';
import { useNavigation } from "@react-navigation/native";


const FriendRequest = ({item, friendRequests, setFriendRequests}) => {

    const {userId, setUserId} = useContext(UserType);
    const navigation = useNavigation();


    const acceptFriendRequest = async (friendRequestId) => {
        try {
          const response = await fetch(`http://192.168.0.30:8000/friend-request/accept`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: friendRequestId,
                recepientId: userId,
            }),
          });

          if (response.ok) {
            setFriendRequests(
              friendRequests.filter((request) => request._id !== friendRequestId)
            );
            //navigation.navigate("Chats");
          }
        } catch (err) {
          console.log("error acceptin the friend request", err);
        }
      };

    
  return (
    <Pressable style={styles.Container}>
        <Image style={styles.Logo} source={{uri: item?.image}}></Image>

        <Text style={styles.SendText}><Text style={styles.NameText}>{item?.name}</Text>  wysłał ci zaproszenie</Text>
    
        <LinearGradient
        colors={ ['#ADD8E6', '#0FFFFF'] }
        style={styles.AcceptButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Pressable 
          onPress={() => acceptFriendRequest(item._id)}>
          <Text style={styles.ButtonText}>
            Akceptuj
          </Text>
        </Pressable>
      </LinearGradient>

    
    </Pressable>
  )
}

export default FriendRequest

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: hp(1.5),
    },
    Logo: {
        width: wp(14),
        height: hp(6),
        borderRadius: hp(3),
    },
    SendText: {
        fontSize: wp(4),
        marginLeft: wp(2),
        flex: 1,
        color: 'lightgrey',
    },
    NameText: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: 'lightgrey',

    },
    AcceptButton: {
        padding: hp(1.5),
        borderRadius: 10,
        marginLeft: wp(1),
    },
    ButtonText: {
        fontSize: hp(1.8),
        color: 'black',
      },
})