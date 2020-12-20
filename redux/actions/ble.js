/* eslint-disable import/no-cycle */
import base64 from 'react-native-base64';
import get from 'lodash/get';
import {
  BLE_STATE,
  BLE_ERROR,
  BLE_DEVICE,
  DEVICE_UPDATE,
  SERIAL_DATA_COLLECT,
  DATA_STOP,
  SET_MODE,
  DATA_UPDATE,
  SET_RECORD,
  DATA_COLLECT_START,
  DELETE_RUN,
  EDIT_RUN,
  MANUAL_DEVICE_ENTRY,
  MANUAL_DATA_UPDATE,
  SET_AUTO_STOP,
  SET_FREQ,
  FREQUENCY_DATA,
  BATTERY_UPDATE,
  SET_SENSOR_DETAILS,
  SAMPLING_DATA,
} from '../types';
import {
  getDeviceFromList,
  getAllConnectedDevices,
  decodeData,
  getFrequencyConfig,
  getWait,
  setSensorUnit,
} from '../../utils';
import config from '../../config';

import { triggerAlert } from './pages';

const {
  UUID: { CHARACTERISTIC, SERVICE, NOTIFY },
  commands: { START, BATTERY, DETAILS },
} = config;
const notificationTracker = [];
export const getDeviceBluetoothStatusOnChange = () => {
  return (dispatch, getState, DeviceManager) => {
    DeviceManager.onStateChange((state) => {
      dispatch({
        type: BLE_STATE,
        payload: state,
      });
    });
  };
};

export const getDeviceBluetoothStatus = () => {
  return async (dispatch, getState, DeviceManager) => {
    const state = await DeviceManager.state();
    dispatch({
      type: BLE_STATE,
      payload: state,
    });
  };
};

export const scanDevices = () => {
  return async (dispatch, getState, DeviceManager) => {
    // below function is used refresh functionality
    // dispatch({
    //   type:RESET_BLE_DEVICE,
    // })
    DeviceManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        dispatch({
          type: BLE_ERROR,
          payload: error,
        });
      }
      const {
        ble: { devices },
      } = getState();
      if (
        device &&
        !devices.find((d) => d.device.id === device.id) &&
        device.name &&
        device.name.includes('SWIS')
      )
        dispatch({
          type: BLE_DEVICE,
          payload: device,
          isConnected: false,
        });
    });
  };
};

export const stopScanDevices = () => {
  return (dispatch, getState, DeviceManager) => {
    DeviceManager.stopDeviceScan();
  };
};

export const addManualEntryDevice = (parameter, unit, uniqid) => {
  const Device = { id: uniqid, name: `${parameter} ${unit}` };
  return (dispatch) => {
    dispatch({
      type: MANUAL_DEVICE_ENTRY,
      payload: { device: Device, unit, parameter },
    });
  };
};

export const connectDevice = (id, connect) => {
  return (dispatch, getState, DeviceManager) => {
    const device = getDeviceFromList(id, getState());
    if (connect) {
      device.cancelConnection();
      device
        .connect()
        .then((dev) => {
          return dev.discoverAllServicesAndCharacteristics();
        })
        .then(async (devWithSerChar) => {
          // get battery Status
          await device.writeCharacteristicWithResponseForService(
            SERVICE,
            CHARACTERISTIC,
            // BATTERY,
            DETAILS,
          );
          await DeviceManager.requestMTUForDevice(id, 200);
          const detNotifier = devWithSerChar.monitorCharacteristicForService(
            SERVICE,
            NOTIFY,
            async (err, char) => {
              if (err) {
                return;
              }
              const sensorDetails = decodeData(char.value, 'sensorDetails');
              const currentUnits = decodeData(char.value, 'currentUnits');

              if (sensorDetails) {
                const parameter = Object.keys(sensorDetails)[0];
                const unit = sensorDetails[parameter][0];
                await device.writeCharacteristicWithResponseForService(
                  SERVICE,
                  CHARACTERISTIC,
                  base64.encode(setSensorUnit(parameter, unit)),
                );
                detNotifier.remove();
                await device.writeCharacteristicWithResponseForService(
                  SERVICE,
                  CHARACTERISTIC,
                  BATTERY,
                );
                const batNotifier = devWithSerChar.monitorCharacteristicForService(
                  SERVICE,
                  NOTIFY,
                  async (bErr, bChar) => {
                    if (bErr) {
                      return;
                    }
                    const battery = decodeData(bChar.value, 'battery');
                    const isCharging = decodeData(bChar.value, 'charging');
                    dispatch({
                      type: DEVICE_UPDATE,
                      sensorDetails,
                      currentUnits,
                      battery,
                      isCharging,
                      payload: devWithSerChar,
                      isConnected: true,
                    });
                    if (battery) {
                      batNotifier.remove();
                    }
                  },
                );
              }
            },
          );
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    } else {
      if (device.cancelConnection) device.cancelConnection();
      const modal = {
        name: 'no_sensor',
        header: `${device.name} Disconnected`,
        buttons: [{ title: 'Ok', isAction: true }],
      };
      dispatch(triggerAlert(null, modal));
      dispatch({
        type: DEVICE_UPDATE,
        payload: device,
        isConnected: false,
      });
    }
  };
};

const freqInterval = [];

export const stopAllSensors = () => {
  return (dispatch) => {
    freqInterval.forEach((int) => {
      clearInterval(int);
    });
    notificationTracker.forEach((notify) => {
      if (notify && notify.remove) notify.remove();
    });
    setTimeout(() => {
      dispatch({
        type: DATA_STOP,
      });
    }, 100);
  };
};

export const recordValue = ({ deviceId, run, runName }) => {
  return (dispatch, getState) => {
    const {
      ble: { frequency },
    } = getState();
    const freq = setInterval(() => {
      dispatch({
        type: SAMPLING_DATA,
        deviceId,
        run,
        runName,
      });
    }, 1000 / frequency);
    const rFreq = frequency >= 2 ? 500 : 1000 / frequency;
    const render = setInterval(() => {
      dispatch({
        type: FREQUENCY_DATA,
        deviceId,
        run,
        runName,
      });
    }, rFreq);
    freqInterval.push(freq);
    freqInterval.push(render);
  };
};

export const startAllSensors = ({ isSoft }) => {
  // if isSoft is true then we do not store the data anywhere in the application,
  // if isSoft is false it means we are starting experiment
  return (dispatch, getState, DeviceManager) => {
    const devices = getAllConnectedDevices(getState());
    const {
      ble: { mode, runNumber, autoStop },
    } = getState();
    if (getWait(autoStop)) {
      setTimeout(() => {
        dispatch(stopAllSensors());
      }, getWait(autoStop));
    }
    devices.map(async ({ device }, index) => {
      const deviceId = device.id;
      const run = runNumber + 1;
      const runName = `Run ${runNumber + 1}`;
      await device.writeCharacteristicWithResponseForService(
        SERVICE,
        CHARACTERISTIC,
        START,
      );
      await DeviceManager.requestMTUForDevice(device.id, 200);
      if (!isSoft)
        dispatch({
          type: DATA_COLLECT_START,
          deviceId,
          run,
        });
      notificationTracker[index] = device.monitorCharacteristicForService(
        SERVICE,
        NOTIFY,
        async (err, char) => {
          if (err) {
            return;
          }
          const value = decodeData(char.value, 'data');
          const battery = decodeData(char.value, 'battery');
          const isCharging = decodeData(char.value, 'charging');
          const isWarning = get(
            decodeData(char.value, 'warning'),
            'battery',
            '',
          );
          let modal;
          switch (isWarning) {
            case 'low':
              modal = {
                name: 'batter_low',
                header: `${device.name} Battery low`,
                buttons: [],
                isSoft: true,
              };
              dispatch(triggerAlert(null, modal));
              break;

            default:
              break;
          }
          if (battery) {
            dispatch({
              type: BATTERY_UPDATE,
              deviceId,
              battery,
              isCharging,
            });
            return;
          }
          const {
            ble: { record },
          } = getState();
          // adds value to store only if payload exits
          if (mode === 'continuous' && value) {
            dispatch({
              type: SERIAL_DATA_COLLECT,
              payload: value,
              deviceId,
              run,
              runName,
            });
          } else if (record && !isSoft) {
            dispatch({
              type: FREQUENCY_DATA,
              deviceId,
              run,
              runName,
            });
          } else if (value && !isSoft) {
            dispatch({
              type: DATA_UPDATE,
              payload: value,
              deviceId: device.id,
              run: runNumber + 1,
              runName: `Run ${runNumber + 1}`,
            });
          }
        },
      );
      if (mode === 'continuous' && !isSoft) {
        setTimeout(() => {
          dispatch(recordValue({ deviceId, run, runName }));
        }, 700);
      }
    });
  };
};

export const setMode = (mode) => {
  return (dispatch) => {
    dispatch({
      type: SET_MODE,
      payload: mode,
    });
  };
};

export const record = () => {
  return (dispatch) => {
    dispatch({
      type: SET_RECORD,
      payload: true,
    });
  };
};

export const deleteRuns = (runIds) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_RUN,
      payload: runIds,
    });
  };
};

export const editRuns = (editedRuns) => {
  return (dispatch) => {
    dispatch({
      type: EDIT_RUN,
      payload: editedRuns,
    });
  };
};
export const manualDataUpdate = (data, id, index) => {
  return (dispatch) => {
    dispatch({
      type: MANUAL_DATA_UPDATE,
      payload: { data, index },
      deviceId: id,
    });
  };
};

export const setAutoStop = (e, key) => {
  return (dispatch) => {
    dispatch({
      type: SET_AUTO_STOP,
      payload: e,
      key,
    });
  };
};

export const setFrequency = (option) => {
  return (dispatch, getState) => {
    const devices = getAllConnectedDevices(getState());
    devices.map(async ({ device }) => {
      await device.writeCharacteristicWithResponseForService(
        SERVICE,
        CHARACTERISTIC,
        base64.encode(getFrequencyConfig(option + 2)),
      );
    });
    dispatch({
      type: SET_FREQ,
      payload: option,
    });
  };
};
export const setUnitParam = (parameter, unit, deviceId) => {
  return async (dispatch, getState) => {
    const devices = getAllConnectedDevices(getState());
    const selectedDevice = devices.filter(
      (sensor) => sensor.device.id === deviceId,
    );
    await selectedDevice[0].device.writeCharacteristicWithResponseForService(
      SERVICE,
      CHARACTERISTIC,
      base64.encode(setSensorUnit(parameter, unit)),
    );
    dispatch({
      type: SET_SENSOR_DETAILS,
      payload: { parameter, unit },
      deviceId,
    });
  };
};

export const updateBattery = () => {
  return (dispatch, getState, DeviceManager) => {
    const devices = getAllConnectedDevices(getState());
    devices.map(async (dev) => {
      // get battery Status
      await dev.device.writeCharacteristicWithResponseForService(
        SERVICE,
        CHARACTERISTIC,
        BATTERY,
      );
      await DeviceManager.requestMTUForDevice(dev.device.id, 200);
      const batteryNotifier = dev.device.monitorCharacteristicForService(
        SERVICE,
        NOTIFY,
        async (err, char) => {
          if (err) {
            return;
          }
          const battery = decodeData(char.value, 'battery');
          const isCharging = decodeData(char.value, 'charging');
          if (battery)
            dispatch({
              type: BATTERY_UPDATE,
              deviceId: dev.device.id,
              battery,
              isCharging,
            });
        },
      );
      // notifies for 1 minute
      setTimeout(() => {
        batteryNotifier.remove();
      }, 1 * 60 * 1000);
    });
  };
};
