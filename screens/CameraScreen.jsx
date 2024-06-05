import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useLayoutEffect, useContext } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { UserType } from '../UserContext';



const CameraScreen = () => {

  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  const route = useRoute();
  const { recepientId, recepientName, fetchMessages, handleSend } = route.params;

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoDone, setPhotoDone] = useState(false);
  const [photoUri, setPhotoUri] = useState("");
  
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
        headerStyle: {backgroundColor: "#131414"},
        headerTintColor: '#fff', // This sets the color of the header title to white
        headerTitleAlign: 'center',
        headerTitle: "",
    });    
}, []); 

  const sendImage = async () => {
    handleSend("image", photoUri);
    navigation.goBack();
  };



  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.GrantedContainer}>
            <Text style={{ textAlign: 'center', color: "white", paddingBottom: hp(5), fontSize: wp(4)}}>Czy zgadzasz się dać aplikacji dostęp do kamery?</Text>
            <Pressable onPress={requestPermission} style={styles.Button}>
                <Text style={{ fontWeight: 'bold', fontSize: wp(7) }}>Zezwól</Text>
            </Pressable>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const onPictureSaved = (photo) => {
    setPhotoUri(photo.uri);
    setPhotoDone(true);
  };

  const takePicture = async () => {
    try {
        if (cameraRef.current) {
          const options = { quality: 0.8, base64: true, onPictureSaved };
          await cameraRef.current.takePictureAsync(options);
        }
      } catch (error) {
        console.error('Error taking picture: ', error);
      }
  };

  return (
    <View style={styles.container}>
     { photoDone 
        ? ( <ImageBackground source={{ uri:  photoUri}} style={styles.ImageContainer} >
            <View style={styles.xContainer}>
                 <Feather name="x" size={wp(10)} color="lightgrey" onPress={() => {setPhotoDone(false)}}/>              
                </View>
            
            <View style={styles.BottomContainer}>
              <View style={styles.SenderContainer}>
                <Text style={{color: "white", fontSize: wp(4), marginRight: wp(1)}}> Wyślij do</Text>
                <Text style={{color: "white", fontSize: wp(6), fontWeight: 'bold', marginBottom: hp(1)}}> {recepientName} </Text>
              </View>
                <View style={styles.Send}>
                  <Ionicons name="send" size={wp(10)} color="black" onPress={sendImage}/>
                </View>
            </View>
          </ImageBackground>) 

        : ( <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <View style={styles.TopCointainer}>
                <View style={styles.BackContainer}>
                   <Ionicons name="arrow-back" size={wp(10)} color="lightgrey" onPress={navigation.goBack}/>              
                </View>

                <View style={styles.ReverseContainer}>
                    <Ionicons name="camera-reverse" size={wp(10)} color="lightgrey" onPress={toggleCameraFacing}/>
                </View>
              </View>
              <View style={styles.TakePicContainer}>
                <View style={styles.IconContainer}>
                        <Entypo name="controller-record" size={wp(16)} color="black" onPress={takePicture} />
                </View>
            </View>
          </View>
        </CameraView>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#131414', 
      justifyContent: 'center',
      alignItems: 'center',
  },
  ImageContainer: {
     width: "100%", 
     height: "100%", 
     alignItems: 'flex-start',
     justifyContent: 'space-between',
    },
    xContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      margin: hp(2),
      marginTop: hp(7),
      backgroundColor: "rgba(0, 0, 0, 0.35)", // Czarne, półprzeźroczyste tło
      padding: 5,
      borderRadius: 50,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    BottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 5,
      
    },
    SenderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: hp(2),
    marginLeft: wp(3.5),
    width: wp(60),
    height: hp(8),
    backgroundColor: "rgba(0, 0, 0, 0.7)", 
    padding: 10,
    borderRadius: 50,
    shadowColor: "lightgrey",

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
    },
    Send: {
      marginLeft: wp(5),
      padding: 10,
      borderRadius: 50,
      backgroundColor: "white",
      justifyContent: 'center',
      alignItems: 'center',
    },
  GrantedContainer: {
    width: wp(70),
    height: hp(40),
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: wp(2.5),
    backgroundColor: '#131414',
    borderWidth: 1,
    borderColor: '#c0c2c1',
    padding: wp(2.5), 
  },
  Button: {
    color: 'white',
    padding: wp(5.5),
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
  },
  camera: {
    width: wp(100),
    height: hp(100),
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: hp(2),
  },
  TopCointainer:{
    marginTop: hp(5),
    widht: wp(80),
    height: hp(10),
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  BackContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.35)", // Czarne, półprzeźroczyste tło
    padding: 5,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  ReverseContainer: { 
    alignSelf: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)", // Czarne, półprzeźroczyste tło
    padding: 5,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
 },
 TakePicContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: hp(5),
 },
 IconContainer: {
    borderWidth:2,
    borderColor:'black',
    alignItems:'center',
    justifyContent:'center',
    width:wp(17),
    height:wp(17),
    backgroundColor:'#fff',
    borderRadius:100,
 }
});

export default CameraScreen;