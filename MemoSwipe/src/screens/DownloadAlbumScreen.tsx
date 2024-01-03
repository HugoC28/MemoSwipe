import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { RouteProp } from '@react-navigation/native';

type DownloadAlbumScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'DownloadAlbum'>;
    route: RouteProp<RootStackParamList, 'DownloadAlbum'>;
  };

const DownloadAlbumScreen: React.FC<DownloadAlbumScreenProps> = ({navigation, route}) => {
  const {eventId, eventTitle } = route.params;
  return (
    <View style={commonStyles.container}>
      <Text>Download photos of : {eventTitle}</Text>
      <Button
        title="<"
        onPress={() => navigation.goBack()}
      />
      <Button
        title="OK"
        //onPress={() => DOWNLOAD}
      />
    </View>
  );
};

export default DownloadAlbumScreen;
