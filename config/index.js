import base64 from 'react-native-base64';
import { RFValue } from 'react-native-responsive-fontsize';

const RES = 1440;

const config = {
  colors: {
    red: '#d60b3f',
    white: '#ffffff',
    lightGreen: '#a9c851',
    black: '#000000',
    yellow: '#ffc200',
    grey: '#f3f2f2',
    lightGrey: '#f5f5f5',
    blue: '#1a53a4',
    green: '#4caf50',
    darkGrey: '#c9c6c6',
    greyLight: '#b8bebe',
    lightBlack: '#404141',
    lightGrey1: '#efefef',
    lightGrey2: '#a5a5a5',
    greyDark: '#e8e8e8',
    grey2: '#d9d9d9',
    black2: '#201f1f',
    grey3: '#e6e6e6',
    darkGrey2: '#A9A9A9',
  },
  UUID: {
    SERVICE: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
    CHARACTERISTIC: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
    NOTIFY: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
  },

  commands: {
    START: base64.encode('{command: \'start\'}'),
    STOP: base64.encode('{command: \'stop\'}'),
    BATTERY: base64.encode('{command: \'batteryStatus\'}'),
    DETAILS: base64.encode('{command: \'sensorDetails\'}'),
  },

  fonts: {
    20: RFValue(20, RES),
    24: RFValue(24, RES),
    38: RFValue(38, RES),
    36: RFValue(36, RES),
    22: RFValue(22, RES),
    32: RFValue(32, RES),
    11: RFValue(11, RES),
    18: RFValue(18, RES),
    26: RFValue(26, RES),
    9: RFValue(9, RES),
    4: RFValue(4, RES),
    12: RFValue(12, RES),
    14: RFValue(14, RES),
    80: RFValue(80, RES),
    16: RFValue(16, RES),
    16.5: RFValue(16.5, RES),
    40: RFValue(40, RES),
    34: RFValue(34, RES),
    28: RFValue(28, RES),
    44: RFValue(44, RES),
  },
};
export default config;
