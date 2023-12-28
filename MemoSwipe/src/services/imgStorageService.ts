import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker, { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const generateUniqueImageName = () => {
  const timestamp = new Date().getTime();
  return `image_${timestamp}.jpg`;
};

export const uploadImage = async (uri: string, imageName: string) => {
  const reference = storage().ref(`images/${imageName}`);
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

export const addImageToFirestore = async (imageUrl: string | null, otherData: any) => {
  if (!imageUrl) {
    console.error('Invalid image URL');
    return;
  }

  try {
    await firestore().collection('images').add({
      imageUrl,
      otherData,
    });
    console.log('Image data added to Firestore!');
  } catch (e) {
    console.error('Error adding image data to Firestore: ', e);
  }
};

export const pickImage = () => {
  const options = {
    mediaType: 'photo' as const, // Set mediaType to 'photo' or 'video'
  };

  ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
      const imageName = generateUniqueImageName();
      const uri = response.assets[0].uri;

      uploadImage(uri, imageName)
        .then((imageUrl) => {
          if (imageUrl) {
            const otherData = {/* Add your other data here */};
            addImageToFirestore(imageUrl, otherData);
          }
        })
        .catch((error) => {
          console.error('Error in image upload:', error);
        });
    }
  });
};
