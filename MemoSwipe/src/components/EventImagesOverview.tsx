import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, Text, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface Photo {
  dislikes: string[];
  likes: string[];
  uploader_id: string;
  url: string;
}

interface EventImagesOverviewProps {
    eventId: string;
  }

const EventImagesOverview: React.FC<EventImagesOverviewProps> = ({eventId}) => {
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

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 5 }}>
            <Image source={{ uri: item.url }} style={{ width: Dimensions.get('window').width / 4, height: Dimensions.get('window').width / 4, resizeMode: 'cover' }} />
          </View>
        )}
        horizontal={true} // Display images side by side
      />
    </View>
  );
};

export default EventImagesOverview;
