import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from './digitalMeter_styles';
import config from '../../config';

const { fonts } = config;

const { modalContainer, sensorItem } = styles;
const SensorList = ({ sensors, handleSensorSelect, isParameterOnly }) => {
  const modalWidth = isParameterOnly ? wp(15) : wp(14);
  const fontSize = isParameterOnly ? fonts[24] : fonts[18];
  return (
    <View style={ { ...modalContainer, width: modalWidth } }>
      {sensors.length ? (
        sensors.map((sensor) => {
          return (
            <View style={ sensorItem }>
              <TouchableWithoutFeedback
                onPress={ () => handleSensorSelect(sensor) }>
                <Text style={ { fontSize } }>{sensor.name}</Text>
              </TouchableWithoutFeedback>
            </View>
          );
        })
      ) : (
        <View style={ sensorItem }>
          <Text>No sensors connected</Text>
        </View>
      )}
    </View>
  );
};

export default SensorList;
