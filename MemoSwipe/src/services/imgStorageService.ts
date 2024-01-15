import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const generateUniqueImageName = () => {
  const timestamp = new Date().getTime();
  return `image_${timestamp}.jpg`;
};

export const uploadImage = async (uri: string, imageName: string) => {
  const reference = storage().ref(`Photos/${imageName}`);
  const task = reference.putFile(uri);

  try {
    await task;
    console.log('Image uploaded successfully!');
    return reference.getDownloadURL();
  } catch (e) {
    console.error('Error uploading image: ', e);
    return null;
  }
};

export const addImageToFirestore = async (imageUrl: string | null, eventId: string, uploaderId: string, uploaderName: string) => {
  if (!imageUrl) {
    console.error('Invalid image URL');
    return;
  }

  try {
    const eventRef = firestore()
      .collection('Events')
      .doc(eventId)
      .collection('Photos');

    await eventRef.add({
      dislikes: [],
      likes: [],
      uploader_id: uploaderId,
      uploader_name: uploaderName,
      url: imageUrl,
    });

    console.log('Image data added to Firestore!');
  } catch (e) {
    console.error('Error adding image data to Firestore: ', e);
  }
};

interface PickImageParams {
  userId: string;
}

export const pickImage = ({ userId, eventId, userName }: { userId: string, eventId:string, userName: string }): void => {
    const options = {
    mediaType: 'photo' as const, // Set mediaType to 'photo' or 'video'
  };

  launchImageLibrary(options, (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
      const imageName = generateUniqueImageName();
      const uri = response.assets[0].uri;

      uploadImage(uri, imageName)
        .then((imageUrl) => {
          if (imageUrl) {
            addImageToFirestore(imageUrl, eventId, userId, userName);
          }
        })
        .catch((error) => {
          console.error('Error in image upload:', error);
        });
    }
  });
};

