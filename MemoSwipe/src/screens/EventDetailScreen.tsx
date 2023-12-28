import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { pickImage } from '../services/imgStorageService';


type EventDetailScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
  };

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({navigation}) => {
  const handleUploadButtonClick = () => {
    pickImage();
  };

  return (
    <View style={commonStyles.container}>
      <Text>Event's Name</Text>
      <Button
        title="<"
        onPress={() => navigation.navigate('EventsList')}
      />
      <Button
        title="Edit"
        onPress={() => navigation.navigate('EditEvent')}
      />
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
  );
};

export default EventDetailScreen;
