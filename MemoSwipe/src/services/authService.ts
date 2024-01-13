import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface authResult {
    user: FirebaseAuthTypes.User;
    error_msg: string;
  }

//returns null if signup was okay, or a error string
export const authSignUp = async (username: string, email: string, password: string) =>
{  
    if(username.trim() == "")
    {
        return "Username can not be empty"
    }
    if(email.trim() == "")
    {
        return "Email can not be empty"
    }
    if(password.trim() == "")
    {
        return "Password can not be empty"
    }
        var resultError = null;
        await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (credetials) => {
            const user = credetials.user;
            await user.updateProfile({
            displayName: username
            });
            console.debug("New user created: " + email);
            resultError = await authLogin(email, password); // login user after sign up            
        })
        .catch(error => {
            console.warn("Error:" + error.code);
            resultError = getErrorMessage(error.code);
        });
        return resultError;   
}

export const authLogin = async (email: string, password: string) =>
{
    if(email.trim() == "")
    {
        return "Email can not be empty"
    }
    if(password.trim() == "")
    {
        return "Password can not be empty"
    }
    var resultError = null;
    
        await auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
            console.warn("Error:" + error.code);
            resultError = getErrorMessage(error.code);
        });
    
   
    return resultError;
}

function getErrorMessage(errorcode: string): string 
{
    var resultError = "Unknown error";
    switch(errorcode) {
        case 'auth/email-already-in-use':                  
            resultError= "Email already in use";
            break;
        case 'auth/invalid-email':                  
            resultError= "Email address is not valid";
            break;
        case 'auth/operation-not-allowed':                  
            resultError= "This operation is not allowed";
            break;
        case 'auth/weak-password':                  
            resultError= "Password too weak";
            break;
        case 'auth/user-disabled':                  
            resultError= "Account is disabled";
            break;
        case 'auth/user-not-found':  
        case 'auth/wrong-password':                  
            resultError= "Wrong username/password";
            break;
        default:
            resultError = "Unkown error";
            break;
   }
   return resultError;
}

export const getUserId = () =>
{
    const user = auth().currentUser;
    return user?.uid;
}

export const getUsername = () =>
{
    const user = auth().currentUser;
    return user?.displayName;
}

export const getUserEmail = () =>
{
    const user = auth().currentUser;
    return user?.email;
}

export const getUsernameByUUID = async (uuid: string) => {
    const usersRef = firestore().collection('users').where('uuid', '==', uuid);
  
    try {
      const querySnapshot = await usersRef.get();
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const username = userData.username;
        return username;
      } else {
        return 'Unknown user';
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return 'Unknown user';
    }
  };

  export const getMultipleUsersByUUIDs = async (uuids: string[]): Promise<string[]>  => {
    try {
      const collectionRef = firestore().collection('Users');      

      const querySnapshot = await collectionRef.where('uuid', 'in', uuids).get();      
      
      const data = querySnapshot.docs.map((doc) => doc.data());
      console.debug(data);
      const usernames = data.map(user => user.username);
      return usernames;

    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  };