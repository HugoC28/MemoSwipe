import React from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-ico-material-design';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { pickImage } from '../services/imgStorageService';
import EventImagesOverview from '../components/EventImagesOverview';
import { getUserId } from '../services/authService';

type EventDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
  route: RouteProp<RootStackParamList, 'EventDetail'>;
};

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { eventId } = route.params;
  console.debug("Eventdetails for eventID: " + eventId);
  console.debug("UserID: " + getUserId());

  const handleUploadButtonClick = () => {
    pickImage({userId: "user0034"}); //replaces by user Id
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
        <Text style={{ color: 'black' }}>Event's name</Text>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditEvent')}
        />
      </View>
      <EventImagesOverview eventId='mBRSLWVzup7jEsZyITVn' />
      <View style={{width:'100%' , height: 100, marginTop:4, backgroundColor: '#d9d9d9', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate('DownloadAlbum')}>
          <View style={styles.buttonContainer}>
            <Icon name="download-button" style={styles.buttonsIcon} width={50} heihgt={50} color="white" />
          </View>
        </TouchableOpacity>
        <Button
          title="Evaluate"
          onPress={() => navigation.navigate('EvaluatePhoto')}
        />
        <TouchableOpacity onPress={handleUploadButtonClick}>
          <View style={styles.buttonContainer}>
            <Icon name="add-plus-button" style={styles.buttonsIcon} width={50} heihgt={50} color="white" />
          </View>
        </TouchableOpacity>        
      </View>
    </View>
  );
};

export default EventDetailScreen;
