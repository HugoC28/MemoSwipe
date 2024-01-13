
import React, { useEffect, useState } from 'react';
import { View, TextInput, Image,TouchableOpacity, ActivityIndicator, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShareFromSquare, faCheck, faCalendarDay, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { getMultipleUsersByUUIDs } from '../services/authService';
import DatePicker from 'react-native-date-picker'




type EditEventScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EditEvent'>;
    route: RouteProp<RootStackParamList, 'EditEvent'>;
  };

const EditEventScreen: React.FC<EditEventScreenProps> = ({navigation, route}) => {
  const {eventId, eventTitle } = route.params;

  interface SingleEvent {
    id: string;
    title: string;
    date: Date;
    description: string;
    invitation_code: string;
    members_name: string[];
    memberCount: number;
  }
  
  const eventData: SingleEvent = {
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

        const users = await getMultipleUsersByUUIDs(members_id);        
        const membersNumber = users.length;

        setEvent((prevEvent) => ({...prevEvent,  title: title.toString(), date: date.toDate(), description: description.toString(), invitation_code: invitation_code.toString(), memberCount: membersNumber, members_name: users}));
        
        console.log(users)   
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
          <FontAwesomeIcon icon={faArrowLeft} style={styles.headerIcons} size={25} />
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

        <Text style={styles.caption}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Type the title of your trip here"
          value={event.title}
          onChangeText={(text) => setEvent((prevEvent) => ({...prevEvent,  title: text,}))}
        />

        <View style={styles.divider}></View>

        <Text style={styles.caption}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Type the description of your trip here"
          value={event.description}
          onChangeText={(text) => setEvent((prevEvent) => ({...prevEvent,  description: text,}))}
        /> 

        <View style={styles.divider}></View>

        <View style={styles.vConatiner}>
          <View>
            <Text style={styles.caption}>Invitation Code </Text>
            <Text style={styles.text}>{event.invitation_code}</Text> 
          </View> 
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
              <FontAwesomeIcon icon={faShareFromSquare} style={styles.vIcons} size={20} />
          </TouchableOpacity>
        </View> 

        <View style={styles.divider}></View>

        <View style={styles.vConatiner}>
          <View>
            <Text style={styles.caption}>Date</Text>
            <Text style={styles.text}>{event.date.toDateString()}</Text>
          </View>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <FontAwesomeIcon icon={faCalendarDay} style={styles.vIcons} size={20} />
          </TouchableOpacity>
        </View>        
      
      
      <DatePicker
        modal
        mode={"date"}
        open={isDatePickerVisible}
        date={event.date}
        onConfirm={(date) => {       
          setEvent((prevEvent) => ({...prevEvent,  date: date,}))
          setDatePickerVisibility(false)
        }}
        onCancel={() => {
          setDatePickerVisibility(false)
        }}
      />
      <View style={styles.divider}></View>
      <Text style={styles.caption}>Group Members ({event.memberCount}):</Text>
      <FlatList
        style={styles.list}
        data={event.members_name}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.text}>{item}</Text>
        )}
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',    
    justifyContent: "space-between",
  },
  caption:
  {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: "#000000",
  },
  input:
  {
    paddingLeft: 20,
    fontSize: 14,
    color: "#000000"
  },
  text:
  {
    paddingLeft: 20,
    fontSize: 14,
    color: "#000000"
  },
  activityIndicator:{
    padding: 20
  },
  vConatiner: {
    flexDirection: 'row',  
    alignItems: 'center',    
    width: "100%",
    justifyContent: "space-between",
  },
  vIcons: {   
    color: "#2F80ED",
    paddingRight: 100,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderColor: 'black', // Du kannst die Farbe entsprechend anpassen
    marginVertical: 10, // Einstellen, wie viel Platz oberhalb und unterhalb des Trennelements sein soll
  },
  
});

export default EditEventScreen;
