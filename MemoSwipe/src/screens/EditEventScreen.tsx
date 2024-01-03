import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type EditEventScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EditEvent'>;
  };

const EditEventScreen: React.FC<EditEventScreenProps> = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <Text>Edit</Text>
      <Button
        title="<"
        onPress={() => navigation.goBack()}
      />
      <Button
        title="OK"
        onPress={() => navigation.goBack()} // And save Info
      />
    </View>
  );
};

export default EditEventScreen;
