import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { getUserId, getUserEmail, getUsername } from '../services/authService';

type EventsListScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventsList'>;
  };

const EventsListScreen: React.FC<EventsListScreenProps> = ({navigation}) => {


  return (
    <View style={commonStyles.container}>
      <Text>My Events</Text>
      <Text>UserID: {getUserId()}</Text>
      <Text>Username: {getUsername()}</Text>
      <Text>UserEmail {getUserEmail()}</Text>
      <Button
        title="+"
        onPress={() => navigation.navigate('CreateEvent')}
      />
      <Button
        title="Event detail (temporary button)"
        onPress={() => navigation.navigate('EventDetail')}
      />
    </View>
  );
};

export default EventsListScreen;
