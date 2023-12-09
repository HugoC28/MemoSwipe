import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type EventDetailScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
  };

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({navigation}) => {
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
        //onPress={() => upload images }
      />
      <Button
        title="Evaluate"
        onPress={() => navigation.navigate('EvaluatePhoto')}
      />
    </View>
  );
};

export default EventDetailScreen;
