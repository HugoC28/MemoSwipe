import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';
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

// Define the styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    width: '31%', // Set width to 1/3 of the screen
    aspectRatio: 1,
    margin: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },  
  overlayText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 4,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust the alpha value for transparency
    borderRadius: 10, // Adjust the border radius for a circular shape
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5, // For Android elevation
  },
  textEmpty: {
    fontSize: 16,
    fontStyle:'italic',
    color: "#10416D",
    flexWrap: 'wrap',
    marginTop: 20,
    maxWidth: '70%',
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white", 
    width: "100%",
    alignItems: 'center',
  },
});

const EventImagesOverview: React.FC<EventImagesOverviewProps> = ({ eventId }) => {
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

        // Sort the photos based on their rate
        updatedPhotos.sort((a, b) => (b.likes.length - b.dislikes.length) - (a.likes.length - a.dislikes.length));

        setPhotos(updatedPhotos);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.mainContainer}>
      {photos.length>0?
      <ScrollView contentContainerStyle={styles.imageGridContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: photo.url }} style={styles.image} />
              <Text style={styles.overlayText}>
                {photo.likes.length - photo.dislikes.length}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      :<View>
        <Text style={styles.textEmpty}>
            No images yet...
          </Text>
          <Text style={styles.textEmpty}>
            Upload images using the + button !
        </Text>
      </View>
        }
    </View>
  );
};

export default EventImagesOverview;
