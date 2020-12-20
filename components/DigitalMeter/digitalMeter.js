import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { View } from 'react-native';
import get from 'lodash/get';
import styles from './digitalMeter_styles';
import Button from '../Button';
import config from '../../config';
import {
  getMeasure,
  getAllConnectedDevices,
  getCurrentPageById,
} from '../../utils';
import SensorList from './sensorList';
import Modal from '../Modal';
import DigitalMeterTile from './digitalMeterTile';
import { saveDigitalParameter } from '../../redux/actions';

const { colors } = config;

const { mainContainer } = styles;
const initialState = {
  isSelecting: false,
  left: 0,
  top: 0,
  selectedSensor: null,
};
const DigitalMeter = ({ currentPage, parameterIndex, counts }) => {
  const [state, setState] = useState(initialState);
  const { isSelecting, left, top, selectedSensor } = state;
  const dispatch = useDispatch();
  const reduxState = useSelector((currentState) => currentState, shallowEqual);
  const { graphCount, parameterCount, tableCount, textCount } = counts;
  const connectedSensors = getAllConnectedDevices(reduxState);
  const sensors =
    connectedSensors.length &&
    connectedSensors
      .filter((sensor) => sensor.type !== 'manual')
      .map((sensor) => {
        return {
          name: sensor.device.name,
          id: sensor.device.id,
        };
      });
  const buttonRef = useRef();
  const {
    page: { pages },
  } = reduxState;
  const { parameter } = getCurrentPageById(pages, currentPage);
  useEffect(() => {
    if (parameter[parameterIndex]) {
      const selectedParameter = get(
        parameter[parameterIndex],
        'selectedSensor',
        null,
      );
      setState({
        ...state,
        selectedSensor: selectedParameter,
      });
    }
  }, [currentPage]);

  // componentDidMount
  useEffect(() => {
    // saving digital parameter when loaded initially
    dispatch(
      saveDigitalParameter({
        parameterIndex,
        selectedSensor: null,
        currentPage,
      }),
    );
  }, []);

  const handleButtonClick = (ref) => {
    getMeasure(ref, (x, y, w, h, px, py) => {
      setState({
        ...state,
        left: px + w * 0.8,
        top: py - h * 0.4,
        isSelecting: true,
      });
    });
  };
  const handleSensorSelect = (sensor) => {
    setState({
      ...state,
      selectedSensor: sensor,
      isSelecting: false,
    });
    dispatch(
      saveDigitalParameter({
        parameterIndex,
        selectedSensor: sensor,
        currentPage,
      }),
    );
  };
  const closeModal = () => {
    setState({
      ...state,
      isSelecting: false,
    });
  };
  const isParameterOnly =
    textCount + graphCount + tableCount === 0 && parameterCount === 1;
  const tileWidth = isParameterOnly ? wp(23) : wp(18);
  const tileHeight = isParameterOnly ? hp(25) : hp(20);
  const buttonTextSize = isParameterOnly ? 34 : 26;
  return (
    <View style={ mainContainer }>
      {selectedSensor === null ? (
        <View
          collapsable={ false }
          ref={ buttonRef }
          style={ {
            width: tileWidth,
            height: tileHeight,
          } }>
          <Button
            title="Select Parameter"
            fontSize={ buttonTextSize }
            type="button"
            highlightColor={ colors.white }
            backgroundColor={ colors.white }
            handleClick={ () => handleButtonClick(buttonRef.current) }
          />
          <Modal
            modalOpen={ isSelecting }
            left={ left }
            top={ top }
            onBackdropPress={ closeModal }>
            <SensorList
              sensors={ sensors }
              handleSensorSelect={ handleSensorSelect }
              isParameterOnly={ isParameterOnly }
            />
          </Modal>
        </View>
      ) : (
        <DigitalMeterTile
          selectedSensor={ selectedSensor }
          connectedSensors={ connectedSensors }
          isParameterOnly={ isParameterOnly }
        />
      )}
    </View>
  );
};

export default DigitalMeter;
