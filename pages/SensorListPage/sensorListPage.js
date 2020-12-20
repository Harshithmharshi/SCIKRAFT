/* eslint-disable import/no-cycle */
import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from './sensorListPage_styles';
import Page from '../../components/Page';
import { Modal, BluetoothTile } from '../../components';
import SettingsContent from './settingsModalContent';
import AlertModal from './alertModalContent';
import config from '../../config';
import {
  scanDevices,
  stopScanDevices,
  connectDevice,
  updateBattery,
  setUnitParam,
} from '../../redux/actions';
import {
  getIconFromName,
  getSensorParams,
  getAllConnectedDevices,
  getSensorUnits,
} from '../../utils';

const { colors } = config;

const {
  container,
  header,
  headerText,
  iconView,
  settingsHeader,
  iconContainer,
  sensorText,
  sensorTextContainer,
} = styles;
const headerProps = {
  display: true,
  type: 'type1',
  text: 'Sensors in Range',
};
const initialState = {
  physicalParameter: null,
  unit: null,
  clickedSensor: null,
  settingModal: false,
  alertModal: false,
  sensorParams: [],
  sensorUnits: [],
};

const SensorListPage = ({ isPage = true, onPressClose }) => {
  const [state, setState] = useState(initialState);
  const {
    physicalParameter,
    unit,
    clickedSensor,
    settingModal,
    alertModal,
    sensorParams,
    sensorUnits,
  } = state;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const reduxState = useSelector((rState) => rState, shallowEqual);
  const connectedDevices = getAllConnectedDevices(reduxState);
  const { devices, update } = reduxState.ble;
  const onPageChange = (event) => {
    if (event === 'focus') {
      dispatch(scanDevices());
      dispatch(updateBattery());
    } else {
      dispatch(stopScanDevices());
    }
  };
  useEffect(() => {
    navigation.addListener('blur', () => onPageChange('blur'));
    navigation.addListener('focus', () => onPageChange('focus'));
    dispatch(scanDevices());
    return () => {
      dispatch(stopScanDevices());
    };
  }, []);
  const onPressSave = async () => {
    if (physicalParameter !== null && unit !== null) {
      await dispatch(setUnitParam(physicalParameter, unit, clickedSensor.id));
    }
    setState({
      ...state,
      settingModal: false,
      alertModal: false,
      clickedSensor: null,
    });
  };

  const dropdownElements = [
    {
      title: 'Physical Parameter',
      placeHolder: 'Select',
      options: sensorParams,
      value: physicalParameter,
      id: 'physicalParameter',
    },
    {
      title: 'Unit of Measurement',
      placeHolder: 'Select',
      options: sensorUnits,
      value: unit,
      id: 'unit',
    },
  ];

  const footerProps = {
    display: true,
    text: 'Start Experiment',
  };

  const onPressAlert = () => {
    setState({ ...state, alertModal: true });
  };

  // const sensors = [
  //   {
  //     icon: lightSensor,
  //     sensorName: 'Light',
  //     percentage: 90,
  //     isCharging: true,
  //     calibrate: false,
  //   },
  //   {
  //     icon: temperatureSensor,
  //     sensorName: 'Temperature',
  //     percentage: 30,
  //     isCharging: true,
  //     calibrate: false,
  //   },
  //   {
  //     icon: magneticSensor,
  //     sensorName: 'Magnetic',
  //     percentage: 70,
  //     isCharging: false,
  //     calibrate: true,
  //   },
  // ];

  const getSensorList = () => {
    const sensors = devices.filter((ele) => ele.type !== 'manual');
    return sensors.map((ele) => {
      return {
        sensorName: ele.device.name,
        icon: getIconFromName(ele.device.name),
        percentage: ele.battery,
        isCharging: ele.isCharging,
        calibrate: false,
        id: ele.device.id,
        isConnected: ele.isConnected,
      };
    });
  };

  const handleSettings = (sensorName) => {
    const params = getSensorParams(connectedDevices, sensorName.id);
    setState({
      ...state,
      clickedSensor: sensorName,
      settingModal: !settingModal,
      sensorParams: params,
    });
  };
  const onPressCancel = () => {
    setState({
      ...state,
      settingModal: false,
      alertModal: false,
      physicalParameter: null,
      unit: null,
    });
  };
  const handleDropdown = (item, id) => {
    if (id === 'physicalParameter') {
      const deviceUnits = getSensorUnits(
        connectedDevices,
        clickedSensor.id,
        item.value,
      );
      setState({ ...state, [id]: item.value, sensorUnits: deviceUnits });
    } else {
      setState({ ...state, [id]: item.value });
    }
  };

  const handleConnect = (id, connect) => {
    dispatch(connectDevice(id, connect));
  };
  const Wrapper = isPage ? Page : Fragment;
  const wrapperProps = isPage ? { headerProps, footerProps } : null;
  const containerStyle = isPage
    ? { ...container }
    : { ...container, backgroundColor: colors.greyDark };

  const sensors = useMemo(getSensorList, [devices.length, update]);

  return (
    <Wrapper { ...wrapperProps }>
      <>
        {!isPage && (
          <>
            <View style={ settingsHeader }>
              <View style={ header }>
                <Text style={ headerText }>Sensors in Range</Text>
              </View>
              <View style={ iconView }>
                <View style={ iconContainer }>
                  <TouchableWithoutFeedback onPress={ onPressClose }>
                    <Icon
                      name="close-circle-outline"
                      color={ colors.red }
                      size={ hp(5) }
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </>
        )}
        <View style={ containerStyle }>
          {sensors.length === 0 && (
            <View style={ sensorTextContainer }>
              <Text style={ sensorText }>There are no sensors in range </Text>
            </View>
          )}
          {sensors.map((sensor) => {
            return (
              <BluetoothTile
                { ...sensor }
                key={ sensor.id }
                handleSettings={ handleSettings }
                handleAlert={ onPressAlert }
                handleConnect={ handleConnect }
              />
            );
          })}
          <Modal
            modalOpen={ settingModal || alertModal }
            onBackdropPress={ onPressCancel }>
            {settingModal && (
              <SettingsContent
                sensor={ clickedSensor }
                onPressCancel={ onPressCancel }
                onPressSave={ onPressSave }
                handleDropdown={ handleDropdown }
                dropdownElements={ dropdownElements }
                physicalParameter={ physicalParameter }
                unit={ unit }
              />
            )}
            {alertModal && <AlertModal handleCancel={ onPressCancel } />}
          </Modal>
        </View>
      </>
    </Wrapper>
  );
};
export default SensorListPage;
