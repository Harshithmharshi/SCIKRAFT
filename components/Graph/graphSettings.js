import React from 'react';
import { View } from 'react-native';
import styles from './graph_style';
import CheckBox from '../Checkbox';

const { settingModal, lableStyle } = styles;

const GraphSettings = ({ handleCheckBox, isSelected }) => {
  return (
    <View style={ settingModal }>
      <CheckBox
        text="Show Data Points"
        labelTextStyle={ lableStyle }
        handleSelection={ () => handleCheckBox() }
        isSelected={ isSelected }
      />
    </View>
  );
};
export default GraphSettings;
