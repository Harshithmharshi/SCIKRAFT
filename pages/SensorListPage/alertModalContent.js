import React from 'react';
import { View, Image } from 'react-native';
import styles from './sensorListPage_styles';
import config from '../../config';
// eslint-disable-next-line import/no-cycle
import { Button } from '../../components';

const logo = require('../../assets/logo.png');

const { colors } = config;
const { button, modal } = styles;

const AlertModal = ({ handleCancel }) => {
  return (
    <View style={ modal }>
      <Image source={ logo } />
      <View style={ button }>
        <Button
          backgroundColor={ colors.white }
          fontSize={ 20 }
          title="Close"
          type="button"
          handleClick={ handleCancel }
          color={ colors.black }
          highlightColor={ colors.grey }
        />
      </View>
    </View>
  );
};
export default AlertModal;
