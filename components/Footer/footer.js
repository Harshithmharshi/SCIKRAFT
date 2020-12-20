/* eslint-disable import/no-cycle */
import { View } from 'react-native';
import React, { memo, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import get from 'lodash/get';
import last from 'lodash/last';
import {
  getAllConnectedDevices,
  getIconFromName,
  // getLastUpdatedSensorData,
  getAllRunDetails,
} from '../../utils';
import styles from './footer_styles';
import config from '../../config';
import Timer from '../Timer';
import Button from '../Button';
import Slider from '../Slider';
import Settings from './settings';
import SensorListPage from '../../pages/SensorListPage/sensorListPage';
import SensorSettings from '../SensorSettings';
import SensorDisplay from '../SensorDisplay';
import DisplayBox from './displayBox';
import Modal from '../Modal';
import {
  setMode,
  record,
  setAutoStop,
  setFrequency,
  updateBattery,
  startAllSensors,
  stopAllSensors,
} from '../../redux/actions';

const { colors } = config;

const {
  footerStyle,
  title,
  timerStyle,
  iconContainer,
  alignIcon,
  sensor,
  displayGroupContainer,
  displayGroup,
  recordButtonStyle,
  recordPlacement,
  liveSensorContainer,
} = styles;

const initialState = {
  isClickedIndex: -1,
  sensorListOpen: false,
  recordButton: false,
};

const Footer = memo(({ text, menuDisplay, allowEvents }) => {
  const [state, setState] = useState(initialState);
  const { isClickedIndex, sensorListOpen, recordButton } = state;
  const reduxState = useSelector((currentState) => currentState, shallowEqual);
  const route = useRoute();
  const {
    ble: { buffer, isReceiving },
  } = reduxState;
  const connectedDevices = getAllConnectedDevices(reduxState);
  const runData = getAllRunDetails(connectedDevices);
  const getLiveSensorsData = () => {
    const connectedSensors = connectedDevices.filter(
      (device) => device.type !== 'manual',
    );
    return connectedSensors.map((device) => {
      return {
        sensorName: device.device.name,
        icon: getIconFromName(device.device.name),
        sensorCode: device.device.id.substr(9, 16),
        value: get(last(buffer[device.device.id]), `${device.unit}`, 0),
      };
    });
  };
  const getConnectedSensors = () =>
    connectedDevices.filter((device) => device.type !== 'manual');
  const liveSensorsData = getLiveSensorsData();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mode, autoStop, frequency } = reduxState.ble;
  const names = [
    {
      iconName: 'radio-outline',
      tooltip: getConnectedSensors().length,
    },
    {
      iconName: 'settings-outline',
    },
  ];
  const onClick = () => {
    if (!menuDisplay) navigation.navigate('ExperimentPage');
  };

  const handleIconPress = (index) => {
    if (index === 0) {
      dispatch(updateBattery());
    }
    if (index === -1) {
      setState({
        ...state,
        sensorListOpen: false,
      });
      // stops only if experiment is not started
      if (!isReceiving) dispatch(stopAllSensors());
    } else if (index === -2) {
      // starts only if experiment is not started
      if (!isReceiving) dispatch(startAllSensors({ isSoft: true }));
      setState({
        ...state,
        sensorListOpen: true,
      });
    } else if (index === isClickedIndex) {
      setState({
        ...state,
        isClickedIndex: -1,
      });
    } else {
      setState({
        ...state,
        isClickedIndex: index,
      });
    }
  };
  const onPressCancel = () => {
    setState({
      ...state,
      isClickedIndex: -1,
    });
  };

  const onModeChange = (value) => {
    dispatch(setMode(value));

    return value !== 'continuous'
      ? setState({
          ...state,
          recordButton: true,
        })
      : setState({
          ...state,
          recordButton: false,
        });
  };

  const handleRecord = () => {
    dispatch(record());
  };

  const onTimeChange = (e) => {
    dispatch(setAutoStop(e, 'count'));
  };

  const handleCheckbox = () => {
    dispatch(setAutoStop(!autoStop.enabled, 'enabled'));
  };

  const autoStopFormat = (value) => {
    dispatch(setAutoStop(value, 'format'));
  };

  const onChangeFrequency = (value) => {
    dispatch(setFrequency(value, 'format'));
  };

  // Based on routing condition
  if (route.name === 'SensorListPage')
    return (
      <View style={ footerStyle }>
        <View style={ title }>
          <Button
            title={ text }
            fontSize={ 32 }
            handleClick={ onClick }
            highlightColor={ colors.red }
            color={ colors.white }
          />
        </View>
      </View>
    );

  return (
    <View style={ footerStyle }>
      <View style={ sensor }>
        <SensorDisplay handlePress={ () => handleIconPress(-2) } />
      </View>
      <View style={ recordPlacement }>
        {recordButton && (
          <View style={ recordButtonStyle }>
            <Button
              title="Record"
              backgroundColor={ colors.yellow }
              fontSize={ 20 }
              type="button"
              highlightColor={ colors.yellow }
              handleClick={ handleRecord }
              color={ colors.black }
            />
          </View>
        )}
      </View>
      <Modal
        left={ wp(5.5) }
        bottom={ hp(5) }
        containerStyle={ liveSensorContainer }
        onBackdropPress={ () => handleIconPress(-1) }
        modalOpen={ sensorListOpen }>
        <View style={ displayGroupContainer }>
          <View style={ displayGroup }>
            {liveSensorsData.length ? (
              liveSensorsData.map((display) => (
                <View key={ display.sensorCode }>
                  <DisplayBox { ...display } />
                </View>
              ))
            ) : (
              <View key="none">
                <DisplayBox message="No Sensor connected" />
              </View>
            )}
          </View>
        </View>
      </Modal>
      <View style={ alignIcon }>
        <View style={ iconContainer }>
          <View style={ timerStyle }>
            <Timer />
          </View>
          {names.map((icon, index) => (
            <View key={ icon.iconName } pointerEvents={ allowEvents }>
              <SensorSettings
                { ...icon }
                handlePress={ () => handleIconPress(index) }
                isClicked={ isClickedIndex === index }
              />
            </View>
          ))}
        </View>
      </View>
      <Slider open={ isClickedIndex > -1 } onPressCancel={ onPressCancel }>
        {isClickedIndex === 0 ? (
          <SensorListPage onPressClose={ onPressCancel } isPage={ false } />
        ) : (
          <Settings
            runData={ runData }
            onModeChange={ onModeChange }
            mode={ mode }
            onPressCancel={ onPressCancel }
            autoStop={ autoStop }
            onTimeChange={ onTimeChange }
            handleCheckbox={ handleCheckbox }
            autoStopFormat={ autoStopFormat }
            frequency={ frequency }
            setFrequency={ onChangeFrequency }
          />
        )}
      </Slider>
    </View>
  );
});

export default Footer;
