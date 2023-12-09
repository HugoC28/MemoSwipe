import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.text}>Welcome to MemoSwipe !</Text>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('SignIn')}
      />
      <Button
        title="Log In"
        onPress={() => navigation.navigate('LogIn')}
      />
    </View>
  );
};

export default HomeScreen;
