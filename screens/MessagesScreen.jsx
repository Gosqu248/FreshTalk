import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Image, Pressable, Alert, Modal, Button} from 'react-native'
import React, {useState, useContext, useLayoutEffect, useEffect, useRef} from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Foundation } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { RNCamera } from 'react-native-camera';


const MessegesScreen = () => {

      const [showEmojiSelector, setShowEmojiSelector] = useState(false);
      const [selectedMessages, setSelectedMessages] = useState([]);
      const [messages, setMessages] = useState([]);
      const [recepientData, setRecepientData] = useState();
      const navigation = useNavigation();
      const [selectedImage, setSelectedImage] = useState("");
      const [selectedAudio, setSelectedAudio] = useState("");
      const route = useRoute();
      const { recepientId } = route.params;
      const [message, setMessage] = useState("");
      const { userId, setUserId } = useContext(UserType);
      const [recording, setRecording] = useState(null);
      const [modalVisible, setModalVisible] = useState(false);
      const [countdown, setCountdown] = useState(0); // Zaczynamy odliczanie od 10


      const scrollViewRef = useRef();
      const cameraRef = useRef(null);


      const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
      };

      useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, [messages]);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://192.168.0.30:8000/messages/${userId}/${recepientId}`);

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
      }, []);

      useEffect(() => {
        const fetchRecepientData = async () => {
          try {
            const response = await fetch(
              `http://192.168.0.30:8000/user/${recepientId}`
            );
    
            const data = await response.json();
            setRecepientData(data);
          } catch (error) {
            console.log("error retrieving details", error);
          }
        };
    
        fetchRecepientData();
      }, []);



      const handleSend = async (messageType, imageUri) => {
        try {
          const formData = new FormData();
          formData.append("senderId", userId);
          formData.append("recepientId", recepientId);
    
          if (messageType === "image") {
            formData.append("messageType", "image");
            formData.append("imageFile", {
              uri: imageUri,
              name: "image.jpg",
              type: "image/jpeg",
            });
         } else if (messageType === "audio") {
            formData.append("messageType", "audio");
            formData.append("imageFile", {
              uri: imageUri,
              name: "audio.m4a",
              type: "audio/m4a",
            });
          } 
          else {
            if(message.length > 0 ) {
              formData.append("messageType", "text");
              formData.append("messageText", message);
            } else {
              Alert.alert("Wprowadź wiadomość", "Nie możesz wysłać pustej wiadomości");
              return;
            }
          }
    
          const response = await fetch("http://192.168.0.30:8000/messages", {
            method: "POST",
            body: formData,
          });
    
          if (response.ok) {
            setMessage("");
            setSelectedImage("");
            setSelectedAudio("");
            console.log("message sent successfully");

            fetchMessages();

          }
        } catch (error) {
          console.log("error in sending the message", error);
        }
      };

      const deleteMessage = async (messageId) => {
        try {
          const response = await fetch("http://192.168.0.30:8000/deleteMessages", {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageId }),
          });

          if (response.ok){
            Alert.alert(
              "Usuwanie wiadomości",
              "Czy na pewno chcesz usunąć tę wiadomość?",
              [
                {
                  text: "Anuluj",
                  style: "cancel"
                },
                { text: "OK", onPress: () => {
                  setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageId.includes(id))
                  );
              
                  console.log("message deleted successfully");
                  fetchMessages();
                }}
              ],
              { cancelable: false }
            );
          }
          } catch (error) {
            console.log("error deleting message", error);
        }
      };


      
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
    
    
      const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Permission to access media library is required!');
          return;
        }
      
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
          handleSend("image", result.assets[0].uri);
        }
      };
      
      const handleSelectMessage = (message) => {
        
        const isSelected = selectedMessages.includes(message._id);
        
        if(isSelected){
          setSelectedMessages((prevMessages) => prevMessages.filter((id) => id !== message._id))
        } else {
          setSelectedMessages((prevMessages) => [...prevMessages, message._id]);
        }
      }

      const selectAllButLastMessage = (messages) => {
        const allButLast = messages.slice(0, -1);
        setSelectedMessages(allButLast);
      }

      const startRecording = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need audio recording permissions to make this work!');
          return;
        }
    
        const newRecording = new Audio.Recording();
        try {
          await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
          await newRecording.startAsync();
          setRecording(newRecording);
          console
        } catch (error) {
          console.log(error);
        }
      };
    
      const deleteRecording = async () => {
        try {
          await recording.stopAndUnloadAsync();

          setRecording(null);
        } catch (error) {
          console.log(error);
        }
      };

      const stopAndSendRecord = async () => {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI(); 
          console.log(uri);

          handleSend("audio", uri);

          setRecording(null);
        } catch (error) {
          console.log(error);
        }
      }; 

      useEffect(() => {
          let timer= 0;
          timer = setTimeout(() => {
            setCountdown(countdown + 1);
          }, 1000);
          return () => clearTimeout(timer); // Czyścimy timer, gdy komponent jest odmontowywany
        
      }, [countdown]);

        
      const [sound, setSound] = useState();

      async function playSound(uri) {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            uri 
        );
        setSound(sound);
      
        console.log('Playing Sound');
        await sound.playAsync(); 
      }

      useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); 
            }
          : undefined;
      }, [sound]);
    

      useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {backgroundColor: "black"},
          headerTintColor: '#fff', // This sets the color of the header title to white
          headerLeft:()  => (
            <View style={styles.HeaderContainer}>
                <AntDesign  onPress={() => navigation.goBack()} name="arrowleft" size={hp(4)} color="lightgrey" />
  
                {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500", color: "white"}}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={styles.ProfileImage}
                source={{ uri: recepientData?.image }}
              />

              <Text style={styles.RecepientNameText}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
          ),  
          headerRight: () =>
            selectedMessages.length > 0 ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <AntDesign name="back" size={24} color="white" onPress={() => selectAllButLastMessage(selectedMessages)}/>
                <MaterialIcons
                  onPress={() => deleteMessage(selectedMessages)}
                  name="delete"
                  size={24}
                  color="white"
                />
              </View>
            ) : null,
        });
  
      }, [recepientData, selectedMessages]);

      return (
        <KeyboardAvoidingView style={styles.KAVcontainer}>
          <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}}>
          {messages.map((message, index) => {
          
          const previousMessage = messages[index - 1];
          
          const isSelected = selectedMessages.includes(message._id);
          
          if(message.messageType === "text"){
            return ( 
              <View key={index}>
              {(!previousMessage || formatTime(message.timeStamp) !== formatTime(previousMessage.timeStamp)) && (
                <Text style={[styles.TimeText ]}> {formatTime(message.timeStamp)} </Text>
              )}
              <Pressable 
                onLongPress={() => handleSelectMessage(message)}
                style={[
                  message?.senderId?._id === userId 
                  ? {
                    alignSelf: "flex-end",
                    backgroundColor: "#DCF8C6",
                    padding: 8,
                    maxWidth: "60%",
                    borderRadius: 7,
                    margin: 5,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "white",
                    padding: 8,
                    margin: 5,
                    borderRadius: 7,
                    maxWidth: "60%",
                  },

              isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
               
                <Text style={styles.MessageText}>{message.message}</Text>
              </Pressable>
            </View>
            )
          } 
          if(message.messageType === "image"){
            const baseUrl = "http://192.168.0.30:8000/files/";
            const imageUrl = message.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: baseUrl + filename };


            return (
              <View key={index}>
              {(!previousMessage || formatTime(message.timeStamp) !== formatTime(previousMessage.timeStamp)) && (
                <Text style={[styles.TimeText ]}> {formatTime(message.timeStamp)} </Text>
            )}

              <Pressable 
                onLongPress={() => handleSelectMessage(message)}

                style={[
                  message?.senderId?._id === userId 
                  ? styles.UserImage
                  : styles.RecepientImage,


               ]}>
                <View>
                  <Image 
                  style= {[{
                    width: 200, height: 250, borderRadius: 7},
                   ]} 
                   source={source} />
                   {isSelected && (
                    <View 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 200,
                        height: 250,
                        borderRadius: 7,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  )}
                  {(formatTime(message.timeStamp) !== formatTime(previousMessage.timeStamp)) && (
                    
                    <Text style={styles.MessageText}>{message.message}</Text>
                  )}
                  
                </View>
              </Pressable>
            </View>
            )}
            if(message.messageType === "audio"){
            const baseUrl = "http://192.168.0.30:8000/files/";
            const imageUrl = message.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: baseUrl + filename };


              return (
                <View key={index} >
                {(!previousMessage || formatTime(message.timeStamp) !== formatTime(previousMessage.timeStamp)) && (
                  <Text style={[styles.TimeText ]}> {formatTime(message.timeStamp)} </Text>
                )}
                <Pressable 
                  onLongPress={() => handleSelectMessage(message)}
                  style={[
                    message?.senderId?._id === userId 
                    ? {
                      alignSelf: "flex-end",
                      backgroundColor: "#DCF8C6",
                      padding: 8,
                      maxWidth: "60%",
                      width: wp(30),
                      borderRadius: 7,
                      margin: 10,
                      height: hp(5.5),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }
                  : {
                      alignSelf: "flex-start",
                      backgroundColor: "white",
                      padding: 8,
                      margin: 10,
                      borderRadius: 7,
                      maxWidth: "60%",
                      width: wp(30),
                      height: hp(5.5),
                      flexDirection: 'row',
                      alignItems: 'center',

                    },
  
                isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                  ]}
                >
                  <AntDesign style={{alignItems:'center'}} name="play" size={24} color="black" onPress={() => playSound(source)}/>
                  <Text> .||. </Text>
                </Pressable>
              </View>
              )
            }
          })}
      </ScrollView>

      <View style={styles.BottomContainer}>
        <View style={styles.IconsContainer}>
          <FontAwesome style={{marginRight: wp(3)}} name="camera" size={hp(3.5)} color="lightgrey" />
          <Foundation style={{marginRight: wp(3)}} onPress={pickImage} name="photo" size={hp(3.5)} color="lightgrey" />
          <FontAwesome 
          name="microphone" 
          size={hp(3.5)} 
          color="lightgrey" 
          onPress={() => {!recording && startRecording(); setModalVisible(true); setCountdown(0)}}
        />


          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <MaterialIcons
                 onPress={() => {recording && deleteRecording(); setModalVisible(false)}}
                  name="delete"
                  size={hp(3.5)}
                  color="lightgrey"
                />
                    <Text style={{color: "lightgrey",}}>Czas nagrania: {countdown}</Text>

              <Ionicons name="send" size={hp(3.5)} color="lightgrey" onPress={() => {stopAndSendRecord(); setModalVisible(false);}} 
/>
              </View>
            </View>
        </Modal>
        </View>
        <View style={styles.MessageInputContainer}>
          <View style={styles.InputContainer}>
          <TextInput 
            value={message}
            onChangeText={(text) => setMessage(text)}
            style={styles.MessageInput}
            placeholderTextColor= 'lightgrey'
            placeholder= 'Napisz wiadomość'
          />
          </View>
          
          <AntDesign onPress={handleEmojiPress} name="smile-circle" size={hp(3)} color="lightgrey" />
        </View>
        
        <Ionicons onPress={() => handleSend("text")} name="send" size={hp(3.5)} color="lightgrey" />
      </View>

      {showEmojiSelector && <EmojiSelector onEmojiSelected={emoji => setMessage((prevMessage) => prevMessage + emoji)} 
      style={{height: 250}}/>}
      
    </KeyboardAvoidingView> 
  )
}

export default MessegesScreen

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: hp(7.5)
    
  },
  ProfileImage: {
    marginLeft: wp(5),
    width: wp(11),
    height: hp(5),
    borderRadius: 25,
    resizeMode: "cover",
  },
  RecepientNameText:{
    marginLeft: wp(2),
    fontSize: wp(6), 
    fontWeight: "bold", 
    color:"lightgray"
  },
  UserMessages: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightblue',
    padding: wp(3),
    margin: wp(3),
    borderRadius: 20,
    maxWidth: wp(70),
  },
  RecepientMessages: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgrey',
    padding: wp(3),
    margin: wp(3),
    borderRadius: 20,
    maxWidth: wp(70),
  },
  UserImage:{
    alignSelf: 'flex-end',
    padding: wp(1),
    margin: wp(3),
    borderRadius: 20,
    maxWidth: wp(70),
  },
  RecepientImage:{
    alignSelf: 'flex-start',
    padding: wp(1),
    margin: wp(3),
    borderRadius: 20,
    maxWidth: wp(70),
  },
  MessageText: {
    color: 'black',
    fontSize: hp(2.5),
  },
  TimeText: {
    color: 'white',
    fontSize: wp(3),
    alignSelf: 'center',
  },

  KAVcontainer: {
    flex: 1,
    backgroundColor: '#131414',
  },
  BottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(1.5),
  },
  MessageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(7),
    marginHorizontal: wp(2.5),
    backgroundColor: '#131414',
    borderWidth: 1,
    borderColor: '#c0c2c1',
    borderRadius: 25,
    padding: wp(2.5),
  },
  InputContainer: {
    flex: 0.94,
  },
  MessageInput: {
    color: 'white',
    fontSize: hp(2.2),
    backgroundColor: '#lightgrey',
  },
  IconsContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(25),
  },
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Aby modal rozciągał się na całą szerokość
    position: 'absolute', // Pozycjonowanie absolutne
    bottom: hp(1), // Umieszczenie na dole
    backgroundColor: "rgba(0, 0, 0, 0.91)", // Czarne, półprzeźroczyste tło
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

})