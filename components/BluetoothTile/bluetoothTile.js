import React from 'react';
import { View, Text, Switch, TouchableWithoutFeedback } from 'react-native';
import styles from './bluetoothTyle_styles';
import config from '../../config';
import Battery from '../Battery';
import Image from '../Image';

const settings = require('../../assets/settings.png');
const alert = require('../../assets/error.png');

const {
  tileStyle,
  batteryContainer,
  iconContainer,
  tileFooter,
  iconStyle,
  textContainer,
  textStyle,
  toggleContainer,
  iconsStyle,
  icons,
  imageStyle,
  iconStyle1,
  sensorStyle,
} = styles;
const { colors } = config;
const BluetoothTile = ({
  icon,
  sensorName,
  percentage,
  isCharging,
  calibrate,
  id,
  handleSettings,
  handleAlert,
  handleConnect,
  isConnected,
}) => {
  const toggleSwitch = () => {
    handleConnect(id, !isConnected);
  };

  const handlePress = () => {
    // need to be taken care
  };

  const containerStyle = isConnected
    ? { ...tileStyle, elevation: 10 }
    : { ...tileStyle };
  const sensorCode = id.substr(9, 16);
  return (
    <View style={ containerStyle }>
      <View style={ batteryContainer }>
        {isConnected && (
          <Battery
            percentage={ percentage }
            isCharging={ isCharging }
            color="red"
          />
        )}
      </View>
      <View style={ iconContainer }>
        <View style={ iconStyle }>
          <Image source={ icon } style={ iconStyle1 } />
        </View>
        <View style={ textContainer }>
          <View style={ sensorStyle }>
            <Text style={ textStyle }>{sensorName}</Text>
          </View>
          <View style={ sensorStyle }>
            <Text style={ textStyle }>{sensorCode}</Text>
          </View>
        </View>
      </View>
      <View style={ tileFooter }>
        <View style={ toggleContainer }>
          <Switch
            onValueChange={ toggleSwitch }
            trackColor={ { false: colors.white, true: colors.white } }
            thumbColor={ isConnected ? colors.green : colors.darkGrey }
            value={ isConnected }
            style={ {
              transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
              marginLeft: 20,
            } }
          />
        </View>
        <View style={ icons } />
        {calibrate && (
          <View style={ iconsStyle }>
            <TouchableWithoutFeedback onPress={ handlePress }>
              <Image source={ settings } style={ imageStyle } />
            </TouchableWithoutFeedback>
          </View>
        )}
        <View style={ iconsStyle }>
          <TouchableWithoutFeedback onPress={ handleAlert }>
            <Image source={ alert } style={ imageStyle } />
          </TouchableWithoutFeedback>
        </View>
        <View style={ iconsStyle }>
          <TouchableWithoutFeedback
            disabled={ !isConnected }
            onPress={ () =>
              handleSettings({ name: sensorName, image: icon, id })
            }>
            <Image source={ settings } style={ imageStyle } />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};
export default BluetoothTile;
