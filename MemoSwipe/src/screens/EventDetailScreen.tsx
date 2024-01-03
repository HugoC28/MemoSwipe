import React, { useState } from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { pickImage } from '../services/imgStorageService';
import EventImagesOverview from '../components/EventImagesOverview';
import { getUserId } from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDownload, faPlus} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';


type EventDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
  route: RouteProp<RootStackParamList, 'EventDetail'>;
};

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { eventId } = route.params;
  const [eventTitle,setEventTitle]= useState("")
  const fetchEventName = async () => {
    try {
      const snapshot = await firestore()
        .collection('Events')
        .doc(eventId)
        .get();
  
      if (snapshot.exists) {
        const title = snapshot.data()?.title;
        if (title) {
          setEventTitle(title);
        } else {
          console.error('Title not found');
        }
      } else {
        console.error('Event not found');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
  fetchEventName();
  
  console.debug("Eventdetails for eventID: " + eventId);
  console.debug("UserID: " + getUserId());

  const handleUploadButtonClick = () => {
    const userId = getUserId?.(); // Optional chaining to handle potential undefined
    if (userId) {
      pickImage({ userId });
    } else {
      console.error("User ID is undefined");
    }
  };


  const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#10416D',
      borderRadius: 15,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '45deg' }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 5,
      margin:40,
    },
    buttonsIcon: {
      transform: [{ rotate: '-45deg' }],
    },
    button:{
      borderRadius: 10,
    }
  });

  return (
    <View style={commonStyles.container}>
      <View style={{ width:'100%' , height: 200, marginBottom:4, backgroundColor: '#d9d9d9', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Button
          title="<"
          onPress={() => navigation.navigate('EventsList')}
        />
        <Text style={{ color: 'black' }}>{eventTitle}</Text>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditEvent', {eventId: eventId, eventTitle: eventTitle})}
        />
      </View>
      <EventImagesOverview eventId={eventId} />
      <View style={{width:'100%' , height: 100, marginTop:4, backgroundColor: '#d9d9d9', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate('DownloadAlbum', {eventId: eventId, eventTitle: eventTitle})}>
          <View style={styles.buttonContainer}>
            <FontAwesomeIcon icon={faDownload} style={styles.buttonsIcon} size={25} color={"white"}/>           
          </View>
        </TouchableOpacity>
        <Button
          title="Evaluate"
          onPress={() => navigation.navigate('EvaluatePhoto', {eventId: eventId, eventTitle: eventTitle})}
        />
        <TouchableOpacity onPress={handleUploadButtonClick}>
          <View style={styles.buttonContainer}>
            <FontAwesomeIcon icon={faPlus} style={styles.buttonsIcon} size={30} color={"white"}/> 
          </View>
        </TouchableOpacity>        
      </View>
    </View>
  );
};

export default EventDetailScreen;
