import { StyleSheet, Text, View} from 'react-native'
import React, { useEffect, useContext, useState} from 'react'
import { UserType } from '../UserContext'
import axios from 'axios'
import FriendRequest from '../component/FriendRequest'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const FriendsScreen = () => {
    const {userId, setUserId} = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);

    
    useEffect(() => {
      fetchFriends();
    }, []);
  
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

//console.log("Friend request: " + friendRequests);

      
  return (
    <View style={styles.Container}>
      {friendRequests.length > 0 && <Text style={styles.FriendText}> Your Friend Requests!</Text>}

      {friendRequests.map((item, index) => (
        <FriendRequest 
            key={index} 
            item={item} 
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
            />
      ))}
    </View>
  )
}

export default FriendsScreen

const styles = StyleSheet.create({
  Container: {
    
  },
  FriendText: {
    padding: wp(2.5),
    marginHorizontal: wp(2),
  }
})