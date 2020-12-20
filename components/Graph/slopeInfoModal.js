import React from 'react';
import { View, Text } from 'react-native';
import styles from './graph_style';

const { slopeContent, slopeInfoTextContainer, slopeText } = styles;

const SlopeInfo = ({ x1, y1, x2, y2, slope }) => {
  const data = [
    { title: 'x1', value: x1 },
    { title: 'y1', value: y1 },
    { title: 'x2', value: x2 },
    { title: 'y2', value: y2 },
    { title: 'Slope (m)', value: slope },
  ];
  return (
    <View style={ slopeContent }>
      {data.map(({ title, value }) => {
        return (
          <View key={ title } style={ slopeInfoTextContainer }>
            <Text style={ slopeText }>
              {title} : {value}{' '}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
export default SlopeInfo;
