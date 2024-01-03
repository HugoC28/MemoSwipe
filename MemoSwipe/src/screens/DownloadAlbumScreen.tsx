import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type DownloadAlbumScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'DownloadAlbum'>;
  };

const DownloadAlbumScreen: React.FC<DownloadAlbumScreenProps> = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <Text>Download</Text>
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
