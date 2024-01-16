import React, { useEffect, useState } from 'react';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import {View, Button, Text, StyleSheet, TouchableOpacity, Image,Platform, SafeAreaView, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import commonStyles from '../assets/styles';
import { RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob';
import URL from 'url-parse';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faDownload, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

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
          const { likes, dislikes } = data;
          const rate = likes.length - dislikes.length;
        });
        
        const meanRates = Math.round(updatedPhotos.reduce((sum, photo) => {
          const value = photo.likes.length - photo.dislikes.length;
          return sum + value;
        }, 0) / updatedPhotos.length);
        setPhotos(updatedPhotos);
        console.log(meanRates);
        setMinValue(meanRates);
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
    
        if(Platform.OS === 'ios')
        {
          CameraRoll.save(imageUrl, {type: "photo", album:"MemoSwpie" });
          
        }
        else
        {
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
        }
        
      });
    
      // Wait for all download promises to resolve
      await Promise.all(downloadPromises);
      if(Platform.OS === 'ios')
      {
        Alert.alert(
          "Download done",
          "We downloaded the pictures to your camera roll."
        )
      }
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} style={styles.backIcon} size={25} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{eventTitle}</Text>
            <Text style={styles.subtitle}>Download the album !</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditEvent', {eventId: eventId, eventTitle: eventTitle})}>
            <FontAwesomeIcon icon={faEllipsisVertical} style={styles.editIcon} size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.microContainer}>
          <Text style={styles.text}>Only include photos better rated than :</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
              selectedValue={minValue}
              onValueChange={(itemValue, itemIndex) => setMinValue(itemValue as number)}
              dropdownIconColor="#535353"
            >
              {renderPickerItems()}
            </Picker>
          </View>
        </View>
        <View style={styles.microContainer}>
          <Text style={styles.text}>Number of photos to download : </Text> 
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>{imagesUrlList.length}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => downloadImages()}>
          <View style={styles.buttonContainer}>
            <FontAwesomeIcon icon={faDownload} size={40} color={"white"}/>           
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DownloadAlbumScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E8EEF3',
  },
  headerContainer:{
    width:'100%' ,
    maxHeight:200,
    marginBottom:4, 
    backgroundColor: '#E8EEF3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column',
  },
  logoContainer: {
    flexDirection: 'row',   
    alignItems: 'center',
    width: "100%",
    justifyContent: "center",
    marginBottom:10,
    marginTop:10,
  },
  logo: {
    width: 50 ,
    height: 50, 
    marginRight: 10,
  },
  appname: {
    fontSize: 16,
    color: "#555555"
  },
  rowContainer: {
    flexDirection: 'row',  
    alignItems: 'center',    
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  backIcon: {
    marginRight:10,
    color: '#10416D',
  },
  editIcon: {
    marginLeft:8,
    color: '#10416D',
  },
  titleContainer: {
    flexDirection: 'column',  
    alignItems: 'center', 
    padding: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#000000"
  },
  subtitle: {
    fontSize: 16,
    fontStyle:'italic',
    color: "#10416D",
    flexWrap: 'wrap',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8EEF3',
    marginTop:50,
  },
  microContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    maxHeight:55,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  numberText:{
    fontSize: 22,
    fontWeight: 'bold',
    color: "#000000"
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  androidPicker: {
    height: 40,
    width: 110,
    color: '#535353',
  },
  iosPicker: { 
    width: 200,
    color: '#535353',
    height: 200,
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