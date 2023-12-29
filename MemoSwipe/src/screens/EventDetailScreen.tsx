import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { pickImage } from '../services/imgStorageService';
import EventImagesOverview from '../components/EventImagesOverview';

type EventDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
};

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation }) => {
  const handleUploadButtonClick = () => {
    pickImage();
  };

  return (
    <View style={commonStyles.container}>
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
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
      <View style={{ height: 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Button
          title="Download"
          onPress={() => navigation.navigate('DownloadAlbum')}
        />
        <Button
          title="+"
          onPress={handleUploadButtonClick}
        />
        <Button
          title="Evaluate"
          onPress={() => navigation.navigate('EvaluatePhoto')}
        />
      </View>
    </View>
  );
};

export default EventDetailScreen;
