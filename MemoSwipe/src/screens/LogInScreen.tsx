import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';


type LogInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LogIn'>;
};

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  return (
    <View style={commonStyles.container}>
      <Text>Log In screen</Text>
      <Button
        title="Log In"
        onPress={() => navigation.navigate('EventsList')}
      />
    </View>
  );
};

export default LogInScreen;
