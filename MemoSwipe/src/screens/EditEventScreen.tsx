
import React, { useEffect, useState } from 'react';
import { View, TextInput, Image,TouchableOpacity, ActivityIndicator, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import commonStyles from '../assets/styles';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faUserGroup, faCheck, faPlus, faRotateRight} from '@fortawesome/free-solid-svg-icons';
import { getUserId, getUserEmail, getUsername } from '../services/authService';
import { color } from '@rneui/themed/dist/config';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import DateTimePickerModal from 'react-native-modal-datetime-picker';




type EditEventScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EditEvent'>;
    route: RouteProp<RootStackParamList, 'EditEvent'>;
  };

const EditEventScreen: React.FC<EditEventScreenProps> = ({navigation, route}) => {
  const {eventId, eventTitle } = route.params;

  var eventData = {
    id: '',
    title: '',
    date: new Date(),
    description: '',
    invitation_code: "",
    members_name: [],
    memberCount: 0,
  };

  const [event, setEvent] = useState(eventData);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Event");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {    
    fetchEvent();
  }, []);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date1: Date) => {    
    setEvent((prevEvent) => ({...prevEvent,  date: date1}));
    hideDatePicker();  };

  const saveEvent = () => 
  {
    navigation.navigate("EventsList");
  }

  const fetchEvent = async () => {
    setLoading(true);   
    try {
      
      const eventRef = firestore().collection('Events').doc(eventId);
      const eventDoc = await eventRef.get();
      
      if (eventDoc.exists) {
        const userData = eventDoc.data();
        const id = eventId;
        const title = userData?.title;
        const date = userData?.date;
        const description = userData?.description;      
        const invitation_code = userData?.invitation_code;     
        const members_id = userData?.members_id || [];

        setEvent((prevEvent) => ({...prevEvent,  title: title.toString(), date: date, description: description, invitation_code: invitation_code}));
        
        setTitle("Edit Event")
      } else {
          setTitle("New Event")
      }

      
    } catch (error) {
      console.error('Error fetching event:', error);
      Alert.alert(
        'Error',
        'Could not fetch event from server!',
        [
          { text: 'Back', onPress: () =>navigation.goBack() },
        ],
        { cancelable: false }
      );

    }
    finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerView}>     
        <View style={styles.headerContainer}>
          <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          />
          <Text style={styles.appname}>MemoSwipe</Text>  
        </View> 
        <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faRotateRight} style={styles.headerIcons} size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={saveEvent}>
          <FontAwesomeIcon icon={faCheck} style={styles.headerIcons} size={25} />
        </TouchableOpacity>
        </View>            
      </View>
      {loading ? (
        <ActivityIndicator style={styles.activityIndicator} size={50} color={'#2F80ED'}/>
      ) : (
        <View>

        <Text>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={event.title}
          onChangeText={(text) => setEvent((prevEvent) => ({...prevEvent,  title: text,}))}
        />
        <Text>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={event.description}
          onChangeText={(text) => setEvent((prevEvent) => ({...prevEvent,  description: text,}))}
        />   
        <Text>Invitation Code</Text>
        <Text>{event.invitation_code}</Text> 
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <FontAwesomeIcon icon={faCheck} style={styles.headerIcons} size={25} />
        </TouchableOpacity>
          
      <Text>Date:</Text>
      <Text>{event.date.toDateString()}</Text>
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <FontAwesomeIcon icon={faCheck} style={styles.headerIcons} size={25} />
      </TouchableOpacity>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      </View>
      )}
   </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  headerView: {
    padding: 10,
    backgroundColor: "#E8EEF3",    
    width: '100%',
    alignItems: 'center',  
  },
  headerContainer: {
    flexDirection: 'row',   
    alignItems: 'center',    
    width: "100%",
    //justifyContent: "flex-start",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',  
    alignItems: 'center',    
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#000000"
  },
  headerIcons: {   
    color: "#2F80ED",
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
  list: {        
    width: '100%',
  },
  listItem: {
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,   
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',    
    justifyContent: "space-between",
  },
  listTextContainer: {   
    justifyContent: "flex-start",
  },
  listIconContainer: {   
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  listTitle: {        
    fontSize: 20,
    textAlign: "left",    
    fontWeight: 'bold',
    marginTop: 5,
    color: "#343C44",
  },
  listDescription: {        
    fontSize: 12,
    textAlign: "left", 
  },
  listIcons: {   
    color: "#343C44",
    marginRight: 5,
    marginLeft: 5,
  },
  listRightArrow: {   
    color: "#AAA",   
    marginLeft: 15,
  },
  activityIndicator:{
    padding: 20
  },
  
});

export default EditEventScreen;
