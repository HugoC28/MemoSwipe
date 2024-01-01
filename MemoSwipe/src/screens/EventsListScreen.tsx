import React, { useEffect, useState } from 'react';
import { View, Image,TouchableOpacity, ActivityIndicator, Text, FlatList, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faUserGroup, faAngleRight, faPlus, faRotateRight} from '@fortawesome/free-solid-svg-icons';
import { getUserId, getUserEmail, getUsername } from '../services/authService';
import { color } from '@rneui/themed/dist/config';

interface Event {
  id: string;
  title: string; 
  description: string;
  memberCount: number;
  photoCount: number;
}

type EventsListScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventsList'>;
  };

const EventsListScreen: React.FC<EventsListScreenProps> = ({navigation}) => {

  const userId = getUserId();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('Events')
        .where('members_id', 'array-contains', userId)
        .get();
      const eventData: Event[] = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const photosSnapshot = await doc.ref.collection('Photos').get();
            const photosDocCount = photosSnapshot.size;
  
            return {
              id: doc.id,
              title: doc.get('title'),
              description: doc.get('description'),
              memberCount: (doc.get('members_id') as any[]).length,
              photoCount: photosDocCount,
            };
          })
        );
        setEvents(eventData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {    
    fetchEvents();
  }, []);


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
        <TouchableOpacity onPress={() => fetchEvents()}>
          <FontAwesomeIcon icon={faRotateRight} style={styles.headerIcons} size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>My Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')}>
          <FontAwesomeIcon icon={faPlus} style={styles.headerIcons} size={25} />
        </TouchableOpacity>
        </View>            
      </View>
      {loading ? (
        <ActivityIndicator style={styles.activityIndicator} size={50} color={'#2F80ED'}/>
      ) : (
      <FlatList
        style={styles.list}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EventDetail', {eventId: item.id})}>
            <View style={styles.listItem}>
            
              <View style={styles.listTextContainer}>              
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listDescription}> {item.description}</Text>
              </View>
              <View style={styles.listIconContainer}> 
                <FontAwesomeIcon icon={faCamera} style={styles.listIcons} size={25} />
                <Text>{item.photoCount}</Text>
                <FontAwesomeIcon icon={faUserGroup} style={styles.listIcons} size={25} />
                <Text>{item.memberCount}</Text>
                <FontAwesomeIcon icon={faAngleRight} style={styles.listRightArrow} size={25} />
              </View>            
            </View>
          </TouchableOpacity>
        )}
      />)}
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

export default EventsListScreen;
