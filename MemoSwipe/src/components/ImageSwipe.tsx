import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface Card {
  id: string,
  dislikes: string[];
  likes: string[];
  uploader_id: string;
  url: string;
}

interface ImageSwipeProps {
  eventId: string;
  userId: string;
}

const ImageSwipe: React.FC<ImageSwipeProps> = ({ eventId, userId }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const tinderCardRef = useRef<any>(null);
  
    useEffect(() => {
      const fetchCards = async () => {
        try {
          const querySnapshot = await firestore()
            .collection('Events')
            .doc(eventId)
            .collection('Photos')
            .get();
  
          const data: Card[] = [];
  
          querySnapshot.forEach((doc) => {
            if(doc.data().likes && !doc.data().likes.includes(userId) && 
                doc.data().dislikes && !doc.data().dislikes.includes(userId)){
                data.push({ id: doc.id, ...doc.data() } as Card);
            }
          });
  
          setCards(data);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };
  
      fetchCards();
    }, [eventId]);
  
    const handleLike = async () => {
      try {
        const currentPhotoId = cards[currentCardIndex].id; // Assuming each photo document has a unique id field
    
        // Update Firestore document to add userId to the likes array
        await firestore()
          .collection('Events')
          .doc(eventId)
          .collection('Photos')
          .doc(currentPhotoId)
          .update({
            likes: firestore.FieldValue.arrayUnion(userId),
          });
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    };
  
    const handleDislike = async () => {
        try {
            const currentPhotoId = cards[currentCardIndex].id;
        
            // Update Firestore document to add userId to the dislikes array
            await firestore()
              .collection('Events')
              .doc(eventId)
              .collection('Photos')
              .doc(currentPhotoId)
              .update({
                dislikes: firestore.FieldValue.arrayUnion(userId),
              });
          } catch (error) {
            console.error('Error updating likes:', error);
          }
    };

    const onSwipe = (direction: string) => {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
        if (direction === 'right') {
            handleLike();
        } else if (direction === 'left') {
            handleDislike();
        }
    };

    const swipe = (direction: string) => {
        tinderCardRef.current.swipe(direction);
    };

return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {currentCardIndex < cards.length ? (
          <TinderCard
            ref={tinderCardRef} // Change this line
            key={currentCardIndex}
            onSwipe={onSwipe}
            preventSwipe={['up', 'down']}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: cards[currentCardIndex].url }}
                style={styles.image}
              />
            </View>
          </TinderCard>
        ) : (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>
              You already evaluated all photos!
            </Text>
          </View>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.uploaderContainer}>
            {currentCardIndex < cards.length ? <Text style={styles.uploaderText}>
                {"Uploaded by user : " + (cards[currentCardIndex]?.uploader_id || 'Unknown')/* TODO : replace by user name */}
            </Text>:
            <></>}
        </View>
        <View style={styles.buttonsContainer}>
          <Button title="Dislike" onPress={() => swipe('left')} disabled={currentCardIndex >= cards.length} />
          <Button title="Like" onPress={() => swipe('right')} disabled={currentCardIndex >= cards.length}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 1,
    width: 300,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 20,
    color: 'black',
  },
  bottomContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploaderContainer: {
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  buttonsContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  uploaderText: {
    fontSize: 12,
    color: '#10416d',
    fontStyle: "italic",
    display: "flex",
    position: "absolute",
  },
});

export default ImageSwipe;
