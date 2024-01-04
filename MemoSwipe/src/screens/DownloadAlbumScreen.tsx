import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob'; 

interface Photo {
  dislikes: string[];
  likes: string[];
  uploader_id: string;
  url: string;
}

type DownloadAlbumScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'DownloadAlbum'>;
    route: RouteProp<RootStackParamList, 'DownloadAlbum'>;
  };

const DownloadAlbumScreen: React.FC<DownloadAlbumScreenProps> = ({navigation, route}) => {
  const {eventId, eventTitle } = route.params;
  const [imagesUrlList, setImagesUrlList] = useState<string[]>([]);

  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Events')
      .doc(eventId)
      .collection('Photos')
      .onSnapshot((snapshot) => {
        const updatedPhotos: Photo[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data() as Photo;
          updatedPhotos.push(data);
        });
        
        setPhotos(updatedPhotos);
      });

    return () => unsubscribe();
  }, []);

  const filterImagesAbove = async (minValue: number) => {
    const urls: string[] = [];
    
    photos.forEach((photoData) => {
      const { likes, dislikes, url } = photoData;
      const rate = likes.length - dislikes.length;
      if (rate >= minValue) {
        urls.push(url);
      }
    });
    setImagesUrlList(urls);
    console.log(urls.length, ' photos to download');

  };

  const downloadImages = async () => {
    try {
      const downloads = imagesUrlList.map(async (url) => {
        const response = await RNFetchBlob.fetch('GET', url);
        console.log('Response Data:', response.data);
        const imagePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${url.split('/').pop()}.png`;
  
        // Write the image data to the file using rn-fetch-blob
        await RNFetchBlob.fs.writeStream(
          imagePath,
          'base64',
          response.data,
        );
  
        console.log('Image downloaded:', imagePath);
      });

      await Promise.all(downloads);
      console.log('Download Complete', 'All images have been downloaded successfully.');

    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  const handleClick = async () => {
    console.debug('start fetching');
    await filterImagesAbove(3);
    downloadImages();
  }

  return (
    <View style={commonStyles.container}>
      <Text>Download photos of : {eventTitle}</Text>
      <Button
        title="<"
        onPress={() => navigation.goBack()}
      />
      <Button
        title="OK"
        onPress={() => downloadImages()}
      />
      <Button
        title="filter"
        onPress={() => filterImagesAbove(3)}
      />
    </View>
  );
};

export default DownloadAlbumScreen;
