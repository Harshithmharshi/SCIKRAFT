import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Font from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from './battery_styles';
import config from '../../config';

const { colors: color } = config;
const { parent, text, iconStyle, textContainer } = styles;

const Battery = ({ percentage, isCharging }) => {
  const colors =
    percentage === 100
      ? [color.lightGreen, color.lightGreen]
      : [
          color.lightGreen,
          color.lightGreen,
          color.lightGreen,
          color.lightGreen,
          color.white,
        ];
  return (
    <>
      <LinearGradient
        colors={ colors }
        start={ { x: 0, y: 0 } }
        end={ { x: percentage / 100, y: 0 } }
        style={ parent }>
        <Text style={ text }>
          {isCharging && (
            <View style={ iconStyle }>
              <Font name="bolt" size={ wp(1.1) } />
            </View>
          )}
        </Text>
      </LinearGradient>
      <View style={ textContainer }>
        <Text style={ text }>{`${percentage}%`}</Text>
      </View>
    </>
  );
};

export default Battery;
