/* eslint-disable no-unused-expressions */
import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import styles from './graph_style';

const {
  sensorItem,
  modalTextStyle,
  axisSelector,
  mainwrapper,
  modalIdStyle,
} = styles;

const AxisSelector = ({ sensors, name, handleAxisSelect }) => {
  const axisSensors =
    name === 'xAxis'
      ? sensors.concat({ id: 'time', sParameter: 'Time', sUnit: 'sec' })
      : sensors;
  return (
    <View style={ axisSelector }>
      {axisSensors.length ? (
        axisSensors.map(({ id, sParameter, sUnit }) => {
          const sensorName = `${sParameter} (${sUnit})`;
          let sensorCode;
          sParameter === 'Time'
            ? (sensorCode = 'time')
            : (sensorCode = id.substr(9, 16));
          return (
            <View style={ mainwrapper }>
              <TouchableWithoutFeedback
                key={ id }
                onPress={ () => handleAxisSelect(id, name) }>
                <View style={ sensorItem }>
                  <Text style={ modalTextStyle }>{sensorName}</Text>
                  <Text style={ modalIdStyle }>{`(${sensorCode})`}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })
      ) : (
        <View style={ sensorItem }>
          <Text>No sensors available</Text>
        </View>
      )}
    </View>
  );
};
export default AxisSelector;
