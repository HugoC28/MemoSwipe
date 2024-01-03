import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import ImageSwipe from '../components/ImageSwipe';

type EvaluatePhotoScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EvaluatePhoto'>;
  };

const EvaluatePhotoScreen: React.FC<EvaluatePhotoScreenProps> = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Button
          title="<"
          onPress={() => navigation.goBack()}
        />
        <Text style={{ color: 'black' }}>Event's name</Text>
      </View>
      <ImageSwipe eventId='mBRSLWVzup7jEsZyITVn' userId='user0013' />
    </View>
  );
};

export default EvaluatePhotoScreen;
