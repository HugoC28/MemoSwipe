import React from 'react';
import { View, TouchableOpacity, Text, TextInput, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import commonStyles from '../assets/styles';


type LogInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LogIn'>;
};

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  return (
    <View style={commonStyles.container}>
       <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>MemoSwipe</Text>
      <Text style={styles.subtitle}>Share your memories</Text>

      <Text style={styles.logintext}>Login</Text>
      <View style={styles.textInputContainer}>
        <FontAwesomeIcon icon={faEnvelope} style={styles.icon} size={25} />
        <TextInput
          style={styles.input}
          placeholder="Your email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.textInputContainer}>
        <FontAwesomeIcon icon={faLock} style={styles.icon} size={25} />
        <TextInput
          style={styles.input}
          placeholder="Your password"
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.link}>Forgot you password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}          
        onPress={() => navigation.navigate("EventsList")}
      >
        <Text style={styles.buttontext}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100, 
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000000"
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: "#555555"
  },
  logintext: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom:20,
    color: "#000000"
  },
  button: {
    width: 120, 
    height: 40, 
    marginTop: 10,
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
   input: {
    width: 300,
    height: 40,
    borderWidth: 2,
    borderColor: "#999999",    
    borderRadius: 10,
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',    
    justifyContent: "center",
  },
  icon: {   
    lineHeight: "inherit", 
    verticalAlign: "subrr",
    color: "#999999",
    marginRight: 10,
    marginBottom: 10
  },
});

export default LogInScreen;
