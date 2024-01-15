import React from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import ImageSwipe from '../components/ImageSwipe';
import { getUserId } from '../services/authService';
import { RouteProp } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

type EvaluatePhotoScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EvaluatePhoto'>;
    route: RouteProp<RootStackParamList, 'EvaluatePhoto'>;
  };

const EvaluatePhotoScreen: React.FC<EvaluatePhotoScreenProps> = ({navigation, route}) => {
  const {eventId, eventTitle } = route.params;
  const userId = getUserId() as string;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} style={styles.backIcon} size={25} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{eventTitle}</Text>
            <Text style={styles.subtitle}>Evaluate each picture !</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditEvent', {eventId: eventId, eventTitle: eventTitle})}>
            <FontAwesomeIcon icon={faEllipsisVertical} style={styles.editIcon} size={25} />
          </TouchableOpacity>
        </View>
      </View>
      {userId?<ImageSwipe eventId={eventId} userId={userId} />
      :<Text>An error occured, try to reconnect</Text>}
    </View>
  );
};

export default EvaluatePhotoScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8EEF3',
  },
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

});