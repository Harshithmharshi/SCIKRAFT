import React from 'react';
import { Text, View } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import CheckBox from '@react-native-community/checkbox';
import styles from './checkbox_styles';

const { container, label, checkbox } = styles;
const Checkbox = ({
  isSelected,
  handleSelection,
  text,
  checkboxStyle,
  labelTextStyle,
  disabled,
}) => {
  return (
    <View style={ container } pointerEvents={ disabled ? 'none' : 'auto' }>
      <CheckBox
        value={ isSelected }
        onValueChange={ handleSelection }
        style={ { ...checkbox, ...checkboxStyle } }
      />
      <Text style={ { ...label, ...labelTextStyle } }>{text}</Text>
    </View>
  );
};

export default Checkbox;
