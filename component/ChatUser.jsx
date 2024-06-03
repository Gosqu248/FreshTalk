import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";


const ChatUser = ({item}) => {

const navigation = useNavigation();

  return (
    <Pressable style={styles.Container}
        onPress={() => navigation.navigate("Messages", {
            recepientId: item._id,
          })}>
        <Image style={styles.Logo} source={{uri: item?.image}}></Image>

        <View style={styles.TextContainer}>
            <Text style={styles.NameText}>{item?.name}</Text>  
            <Text style={styles.LastSentText}>ostatnia wiadomość</Text>
        </View>

        <View style={styles.TimeContainer}>
            <Text style={styles.LastSentText}>12:00</Text>
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
        borderTopWidth: 0,
        paddingBottom: hp(2.5),
        borderWidth: hp(0.1),
        borderColor: "#333634",
    },
    Logo: {
        width: wp(14),
        height: hp(6),
        borderRadius: 25,
    },
    TextContainer:{
        flexDirection: 'column',
        flex: 1,
        marginLeft: wp(1),
    },
    NameText: {
        fontSize: wp(5),
        color: '#ffffff',
    },
    LastSentText: {
        fontSize: wp(4),
        color: '#c0c2c1',
    },
    TimeContainer: {
        borderRadius: 10,
    }
})