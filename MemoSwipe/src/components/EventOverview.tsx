import React from 'react';
import { Button, View } from 'react-native';
import { pickImage } from '../services/imgStorageService';

const EventOverview = () => {
  const handleUploadButtonClick = () => {
    pickImage();
  };

  return (
    <View>
      <Button title="Pick Image" onPress={handleUploadButtonClick} />
    </View>
  );
};

export default EventOverview;
