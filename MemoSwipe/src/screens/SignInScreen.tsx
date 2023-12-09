import React from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type SignInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SignIn'>;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  return (
    <View style={commonStyles.container}>
      <Text>Sign In screen</Text>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('EventsList')}
      />
    </View>
  );
};

export default SignInScreen;
