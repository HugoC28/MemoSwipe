import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (    
    <View style={commonStyles.container}>
       <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>MemoSwipe</Text>
      <Text style={styles.subtitle}>Share your memories</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}          
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.buttontext}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}          
          onPress={() => navigation.navigate("LogIn")}
        >
          <Text style={styles.buttontext}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200, 
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000000"
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 50,
    color: "#555555"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%', 
  },
  button: {
    width: 120, 
    height: 40, 
    backgroundColor: '#2F80ED',
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    textAlign: 'center',
    borderRadius: 30
   },
   buttontext: {
    color: '#FFFFFF',
   },
});


export default HomeScreen;
