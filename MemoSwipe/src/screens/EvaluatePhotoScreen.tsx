import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type EvaluatePhotoScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventDetail'>;
  };

const EvaluatePhotoScreen: React.FC<EvaluatePhotoScreenProps> = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <Text>Event's Name</Text>
      <Button
        title="<"
        onPress={() => navigation.navigate('EventDetail')}
      />
      <Button
        title="Like"
        //onPress={() => like }
      />
      <Button
        title="Dislike"
        //onPress={() => dislike }
      />

    </View>
  );
};

export default EvaluatePhotoScreen;
