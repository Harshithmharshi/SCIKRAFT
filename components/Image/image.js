import React from 'react';
import { Image } from 'react-native';

const CustomImage = ({ source, style, ...rest }) => {
  return (
    <Image
      source={ source }
      style={ style }
      resizeMode="contain"
      resizeMethod="auto"
      progressiveRenderingEnabled
      { ...rest }
    />
  );
};

export default CustomImage;
