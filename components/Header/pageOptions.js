import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import styles from './header_styles';

const { container, menuList, text } = styles;

const PageOptions = ({ menuItem, handlePageOptions }) => {
  return (
    <View style={ container }>
      {menuItem.map(({ value }, index) => (
        <TouchableWithoutFeedback
          key={ value }
          onPress={ () => handlePageOptions(value) }>
          <View
            style={
              index === menuItem.length - 1
                ? { ...menuList, borderBottomWidth: 0 }
                : menuList
            }>
            <Text style={ text }>{value}</Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

export default PageOptions;
