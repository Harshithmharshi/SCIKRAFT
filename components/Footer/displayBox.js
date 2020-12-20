import React from 'react';
import { View, Text } from 'react-native';
import styles from './displayBox_styles';
import Image from '../Image';

const {
  parent,
  textStyle,
  textContainer,
  imageContainer,
  iconStyle,
  header,
  body,
  nameContainer,
  codeContainer,
  codeStyle,
  messageStyle,
} = styles;

const DisplayBox = ({ icon, value, sensorName, sensorCode, message }) => {
  return (
    <View style={ parent }>
      {message ? (
        <Text style={ messageStyle }>{message}</Text>
      ) : (
        <>
          <View style={ header }>
            <View style={ nameContainer }>
              <Text style={ textStyle }>{sensorName}</Text>
            </View>
            <View style={ codeContainer }>
              <Text style={ codeStyle }>{sensorCode}</Text>
            </View>
          </View>
          <View style={ body }>
            <View style={ imageContainer }>
              <Image source={ icon } style={ iconStyle } />
            </View>
            <View style={ textContainer }>
              <Text style={ textStyle }>{value}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default DisplayBox;
