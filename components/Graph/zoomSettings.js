import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import styles from './graph_style';
import config from '../../config';

const { colors } = config;

const { zoomSettingsView, zoomDimensionButton } = styles;

const ZoomSettings = ({ options, handleClick, selectedValue }) => {
  return (
    <View style={ zoomSettingsView }>
      {options.map(({ title, id }) => {
        return (
          <View
            key={ id }
            style={
              id === selectedValue
                ? { ...zoomDimensionButton, backgroundColor: colors.grey3 }
                : { ...zoomDimensionButton }
            }>
            <TouchableWithoutFeedback onPress={ () => handleClick(id) }>
              <Text> {title}</Text>
            </TouchableWithoutFeedback>
          </View>
        );
      })}
    </View>
  );
};
export default ZoomSettings;
