import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type DownloadAlbumScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventsList'>;
  };

const DownloadAlbumScreen: React.FC<DownloadAlbumScreenProps> = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <Text>Download</Text>
      <Button
        title="<"
        onPress={() => navigation.navigate('EventDetail')}
      />
      <Button
        title="OK"
        //onPress={() => DOWNLOAD}
      />
    </View>
  );
};

export default DownloadAlbumScreen;
