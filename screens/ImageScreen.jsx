import { ImageBackground, StyleSheet, View } from 'react-native';
import React, {useLayoutEffect} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

const ImageScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { imageSource } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });    
    }, []); 

    return (
        <View style={styles.container}>
            <ImageBackground source={imageSource} style={styles.image}>
                <View style={styles.BackContainer}>
                   <Ionicons name="arrow-back" size={wp(10)} color="lightgrey" onPress={navigation.goBack}/>              
                </View>
            </ImageBackground>
        </View>
    );
}

export default ImageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#131414',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderRadius: 20,
        height: hp(95),
        width: wp(95),
        overflow: 'hidden', // This is important!
    },
    BackContainer: {
        margin: hp(2),
        marginTop: hp(3),
        alignSelf: "flex-start",
        backgroundColor: "rgba(0, 0, 0, 0.35)", // Czarne, półprzeźroczyste tło
        padding: 5,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
});