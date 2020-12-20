import DropDownPicker from 'react-native-dropdown-picker';
import React from 'react';
import styles from './dropdown_styles';
import config from '../../config';

const { colors } = config;

const { pickerContainer, pickerStyle, itemStyle, labelStyle } = styles;

const Dropdown = ({
  items,
  selectedValue,
  onChangeDropdown,
  id,
  placeholder,
  selectId,
  onOpen,
  isCenterAligned = false,
  label = {},
  disabled,
}) => {
  const getItemStyles = () => {
    return isCenterAligned
      ? { ...itemStyle, justifyContent: 'center' }
      : itemStyle;
  };
  return (
    <DropDownPicker
      defaultValue={ selectedValue }
      items={ items }
      containerStyle={ pickerContainer }
      style={ pickerStyle }
      itemStyle={ getItemStyles() }
      onChangeItem={ (item) => onChangeDropdown(item, id) }
      placeholder={ placeholder }
      isVisible={ id === selectId }
      onOpen={ () => onOpen(id) }
      labelStyle={
        isCenterAligned ? labelStyle : { color: colors.black, ...label }
      }
      disabled={ disabled }
    />
  );
};

export default Dropdown;
