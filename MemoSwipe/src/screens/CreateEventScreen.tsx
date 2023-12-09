import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type CreateEventScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'CreateEvent'>;
  };

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <Text>New event</Text>
      <Button
        title="OK"
        onPress={() => navigation.navigate('EventsList')}
      />
    </View>
  );
};

export default CreateEventScreen;
