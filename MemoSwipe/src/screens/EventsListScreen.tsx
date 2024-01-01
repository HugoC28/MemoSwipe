import React, { useEffect, useState } from 'react';
import { View, Image,TouchableOpacity, Text, FlatList, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faUserGroup, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import { getUserId, getUserEmail, getUsername } from '../services/authService';

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
  
    useEffect(() => {
      const fetchEvents = async () => {
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
      };
  
      fetchEvents();
    }, []);


  return (
    <View style={commonStyles.container}>
      <View style={styles.headerView}>     
        <View style={styles.headerContainer}>
          <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          />
          <Text style={styles.appname}>MemoSwipe</Text>  
        </View>   
        <Text style={styles.title}>My Events</Text>             
      </View>
      <Text>UserID: {getUserId()}</Text>
      <Text>Username: {getUsername()}</Text>
      <Text>UserEmail {getUserEmail()}</Text>
      <FlatList
        style={styles.list}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => navigation.navigate('EventDetail', {eventId: item.id})}>
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
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="+"
        onPress={() => navigation.navigate('CreateEvent')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    padding: 10,
    backgroundColor: "#ffff",    
    width: '100%',
    alignItems: 'center',  
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: "#0F0",   
    alignItems: 'center',    
    width: "100%",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: "#000000"
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
    backgroundColor: "#888",    
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',    
    justifyContent: "space-between",
  },
  listTextContainer: {
    backgroundColor: "#333",    
    justifyContent: "flex-start",
  },
  listIconContainer: {
    backgroundColor: "#F00",   
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  listTitle: {        
    fontSize: 20,
    //textAlign: "left",    
    fontWeight: 'bold',
    marginTop: 5,
  },
  listDescription: {        
    fontSize: 12,
    textAlign: "left",   
    marginBottom: 5,
  },
  listIcons: {   
    color: "#999999",
    marginRight: 5,
    marginLeft: 5,
  },
  listRightArrow: {   
    color: "#999999",   
    marginLeft: 15,
  },
  
});

export default EventsListScreen;
