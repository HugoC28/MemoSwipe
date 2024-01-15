import React, { useState } from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { pickImage } from '../services/imgStorageService';
import EventImagesOverview from '../components/EventImagesOverview';
import { getUserId, getUsername } from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faDownload, faPlus, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';


type EventDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
  route: RouteProp<RootStackParamList, 'EventDetail'>;
};

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { eventId } = route.params;
  const [eventTitle,setEventTitle]= useState("")
  const [eventSubTitle,setEventSubTitle]= useState("")
  const fetchEventDetails = async () => {
    try {
      const snapshot = await firestore()
        .collection('Events')
        .doc(eventId)
        .get();
  
      if (snapshot.exists) {
        const title = snapshot.data()?.title;
        const subTitle = snapshot.data()?.description;

        if (title) {
          setEventTitle(title);
        } else {
          console.error('Title not found');
        }
        if (title) {
          setEventSubTitle(subTitle);
        } else {
          console.error('Description not found');
        }
      } else {
        console.error('Event not found');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
  fetchEventDetails();
  
  console.debug("Eventdetails for eventID: " + eventId);
  console.debug("UserID: " + getUserId());

  const handleUploadButtonClick = () => {
    const userId = getUserId?.(); // Optional chaining to handle potential undefined
    const userName = getUsername?.();
    if (userId && userName) {
      pickImage({ userId, eventId, userName});
    } else {
      console.error("User ID is undefined");
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} style={styles.backIcon} size={25} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{eventTitle}</Text>
            <Text style={styles.subtitle}>{eventSubTitle}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditEvent', {eventId: eventId, eventTitle: eventTitle})}>
            <FontAwesomeIcon icon={faEllipsisVertical} style={styles.editIcon} size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <EventImagesOverview eventId={eventId} />
      <View style={{width:'100%' , height: 100, marginTop:4, backgroundColor: '#E8EEF3', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
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

const styles = StyleSheet.create({
  headerContainer:{
    width:'100%' ,
    marginBottom:4, 
    backgroundColor: '#E8EEF3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column',
  },
  logoContainer: {
    flexDirection: 'row',   
    alignItems: 'center',
    width: "100%",
    justifyContent: "center",
    marginBottom:10,
    marginTop:10,
  },
  logo: {
    width: 50 ,
    height: 50, 
    marginRight: 10,
  },
  appname: {
    fontSize: 16,
    color: "#555555"
  },
  rowContainer: {
    flexDirection: 'row',  
    alignItems: 'center',    
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  backIcon: {
    marginRight:10,
    color: '#10416D',
  },
  editIcon: {
    marginLeft:8,
    color: '#10416D',
  },
  titleContainer: {
    flexDirection: 'column',  
    alignItems: 'center', 
    padding: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#000000"
  },
  subtitle: {
    fontSize: 16,
    fontStyle:'italic',
    color: "#10416D",
    flexWrap: 'wrap',
  },
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