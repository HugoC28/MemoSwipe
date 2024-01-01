import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { color } from '@rneui/themed/dist/config';

interface authResult {
    user: FirebaseAuthTypes.User;
    error_msg: string;
  }

//returns null if signup was okay, or a error string
export const authSignUp = async (username: string, email: string, password: string) =>
{  
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