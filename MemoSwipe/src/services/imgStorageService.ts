import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker, { Image } from 'react-native-image-crop-picker';

const generateUniqueImageName = () => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `image_${timestamp}_${randomString}.jpg`;
};

export const uploadImage = async (uri: string, imageName: string): Promise<string | null> => {
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

export const addImageToFirestore = async (
  imageUrl: string | null,
  eventId: string,
  uploaderId: string,
  uploaderName: string
): Promise<void> => {
  if (!imageUrl) {
    console.error('Invalid image URL');
    return;
  }

  try {
    const eventRef = firestore().collection('Events').doc(eventId).collection('Photos');

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

export const pickImages = async ({ userId, eventId, userName }: { userId: string; eventId: string; userName: string }): Promise<void> => {
  try {
    const options = {
      mediaType: 'photo' as const,
      multiple: true, // Allow user to select multiple images
    };

    const images: Image | Image[] = await ImagePicker.openPicker(options);
    const selectedImages = Array.isArray(images) ? images : [images];
    const uploadedImages: Set<string> = new Set();

    await Promise.all(
      selectedImages.map(async (image) => {
        const imageName = generateUniqueImageName();

        if (!uploadedImages.has(imageName)) {
          uploadedImages.add(imageName);

          const uri = image.path;

          try {
            const imageUrl = await uploadImage(uri, imageName);

            if (imageUrl) {
              await addImageToFirestore(imageUrl, eventId, userId, userName);
            }
          } catch (error) {
            console.error('Error in image upload:', error);
          }
        }
      })
    );
  } catch (error) {
    console.log('Error in image picker:', error);
  }
};
