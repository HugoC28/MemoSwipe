import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Text, TextInput, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faUser} from '@fortawesome/free-solid-svg-icons';
import commonStyles from '../assets/styles';
import { ActivityIndicator } from 'react-native-paper';
import { authLogin } from '../services/authService';


type LogInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LogIn'>;
};

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setLoading(true);
    const error = await authLogin(email,password);
    if(error != null)
    {     
      setError(error);
    }
    else
    {
      navigation.navigate("EventsList");
    }      
    setLoading(false);
    
  }

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
          placeholderTextColor={"#BBB"}
          keyboardType="email-address"
          autoCapitalize="none"                  
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.textInputContainer}>
        <FontAwesomeIcon icon={faLock} style={styles.icon} size={25} />
        <TextInput
          style={styles.input}
          placeholder="Your password"
          placeholderTextColor={"#BBB"}
          secureTextEntry={true}
          autoCapitalize="none"              
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.link}>Forgot you password?</Text>
      </TouchableOpacity>
      {error!="" && <Text style={styles.errortext}>{error}</Text>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#000"/>      
      ) : (
        <TouchableOpacity
        style={styles.button}          
        onPress={() => login()}
        >
          <Text style={styles.buttontext}>Login</Text>
        </TouchableOpacity>
      )}
      
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
  errortext: {
    color: "red",
    fontSize: 14,
  },
});

export default LogInScreen;
