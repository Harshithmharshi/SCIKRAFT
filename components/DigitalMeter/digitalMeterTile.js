import React from 'react';
import { View, Text } from 'react-native';
import get from 'lodash/get';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { getIconFromName, getLastUpdatedSensorData } from '../../utils';
import Image from '../Image';
import styles from './digitalMeter_styles';
import config from '../../config';

const { fonts } = config;

const {
  tileContainer,
  tileContent,
  imageContainer,
  tileTextContainer,
} = styles;

const DigitalMeterTile = ({
  selectedSensor,
  connectedSensors,
  isParameterOnly,
}) => {
  const sensorIcon = getIconFromName(selectedSensor.name);
  const selectedDevice = connectedSensors.filter(
    (sensor) => sensor.device.id === selectedSensor.id,
  );
  const lastUpdatedValue = getLastUpdatedSensorData(
    get(selectedDevice[0], 'runs', []),
  );
  const tileWidth = isParameterOnly ? wp(70) : wp(30);
  const tileHeight = isParameterOnly ? hp(70) : hp(30);
  const imageHeight = isParameterOnly ? hp(35) : hp(14);
  const fontSize = isParameterOnly ? fonts[44] : fonts[28];
  return (
    <View style={ tileContainer }>
      <View style={ { ...tileContent, width: tileWidth, height: tileHeight } }>
        <View style={ imageContainer }>
          <Image source={ sensorIcon } height={ imageHeight } width={ imageHeight } />
        </View>
        <View style={ tileTextContainer }>
          <Text style={ { fontSize } }>{lastUpdatedValue}</Text>
        </View>
      </View>
    </View>
  );
};

export default DigitalMeterTile;
