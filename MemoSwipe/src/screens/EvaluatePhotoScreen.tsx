import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import ImageSwipe from '../components/ImageSwipe';
import { getUserId } from '../services/authService';
import { RouteProp } from '@react-navigation/native';

type EvaluatePhotoScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EvaluatePhoto'>;
    route: RouteProp<RootStackParamList, 'EvaluatePhoto'>;
  };

const EvaluatePhotoScreen: React.FC<EvaluatePhotoScreenProps> = ({navigation, route}) => {
  const {eventId, eventTitle } = route.params;
  const userId = getUserId() as string;
  return (
    <View style={commonStyles.container}>
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Button
          title="<"
          onPress={() => navigation.goBack()}
        />
        <Text style={{ color: 'black' }}>{eventTitle}</Text>
      </View>
      {userId?<ImageSwipe eventId={eventId} userId={userId} />
      :<Text>An error occured, try to reconnect</Text>}
    </View>
  );
};

export default EvaluatePhotoScreen;
