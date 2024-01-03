import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import LogInScreen from '../screens/LogInScreen';
import MainMenuScreen from '../screens/EventsListScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EditEventScreen from '../screens/EditEventScreen';
import DownloadAlbumScreen from '../screens/DownloadAlbumScreen';
import EvaluatePhotoScreen from '../screens/EvaluatePhotoScreen';

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  LogIn: undefined;
  EventsList: undefined;
  CreateEvent: undefined;
  EventDetail: {eventId: string};
  EditEvent: {eventId: string, eventTitle: string};
  DownloadAlbum: {eventId: string, eventTitle: string};
  EvaluatePhoto: {eventId: string, eventTitle: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator 
    initialRouteName="Home"      
    screenOptions={{
        headerShown: false, // Hide Navigation bar
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="EventsList" component={MainMenuScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} />
      <Stack.Screen name="DownloadAlbum" component={DownloadAlbumScreen} />
      <Stack.Screen name="EvaluatePhoto" component={EvaluatePhotoScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
