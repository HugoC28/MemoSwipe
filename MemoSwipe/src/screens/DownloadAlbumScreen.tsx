import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob';
import URL from 'url-parse';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

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
  const [minValue, setMinValue] = useState<number>(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const worstRate = -20;
  const bestRate = 20;

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

  const filterImagesAbove = () => {
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

  useEffect(() => {
    filterImagesAbove();
  }, [minValue]);

  const downloadImages = async () => {
    try {
      const { config, fs } = RNFetchBlob;
    
      // Use map to iterate over each URL in the imagesUrlList
      const downloadPromises = imagesUrlList.map(async (imageUrl) => {
        const parsedUrl = new URL(imageUrl, true);
        const decodedPathname = decodeURIComponent(parsedUrl.pathname);
        const fileName = decodedPathname.split('/').pop();
    
        console.log('Downloading:', fileName, '...');
        console.log(imageUrl);
    
        const response = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'jpg',
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: fs.dirs.DownloadDir + `/${fileName}`,
            description: 'Downloading file',
          },
        }).fetch('GET', imageUrl);
    
        console.log('File downloaded to:', response.path());
      });
    
      // Wait for all download promises to resolve
      await Promise.all(downloadPromises);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
    
  };

  const renderPickerItems = () => {
    const items = [];
    for (let i = worstRate; i <= bestRate; i++) {
      items.push(<Picker.Item key={i} label={i.toString()} value={i} />);
    }
    return items;
  };

  return (
    <View style={styles.container}>
      <Button
        title="<"
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.text} >Download photos of : {eventTitle}</Text>
      <Text style={styles.text}>Only include photos better rated than :</Text>
      <Picker
        style={styles.picker}
        selectedValue={minValue}
        onValueChange={(itemValue, itemIndex) => setMinValue(itemValue as number)}
        dropdownIconColor="#535353"
      >
        {renderPickerItems()}
      </Picker>
      <Text style={styles.text}>Number of photos to download : {imagesUrlList.length}</Text>
      <TouchableOpacity onPress={() => downloadImages()}>
          <View style={styles.buttonContainer}>
            <FontAwesomeIcon icon={faDownload} size={40} color={"white"}/>           
          </View>
        </TouchableOpacity>
    </View>
  );
};

export default DownloadAlbumScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8EEF3',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 40,
    width: 110,
    color: '#535353'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    color: 'black',
  },
  buttonContainer: {
    backgroundColor: '#10416D',
    borderRadius: 15,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    margin:40,
  },
});