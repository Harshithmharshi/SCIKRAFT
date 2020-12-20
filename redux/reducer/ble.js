/* eslint-disable no-case-declarations */
import get from 'lodash/get';
import takeRight from 'lodash/takeRight';
import last from 'lodash/last';
import moment from 'moment';
import {
  BLE_STATE,
  BLE_ERROR,
  BLE_DEVICE,
  RESET_BLE_DEVICE,
  DEVICE_UPDATE,
  SERIAL_DATA_COLLECT,
  SET_MODE,
  DATA_UPDATE,
  SET_RECORD,
  DATA_STOP,
  DATA_COLLECT_START,
  DELETE_RUN,
  EDIT_RUN,
  MANUAL_DEVICE_ENTRY,
  MANUAL_DATA_UPDATE,
  SET_AUTO_STOP,
  SET_FREQ,
  FREQUENCY_DATA,
  SAVE_EXP,
  LOAD_EXP,
  EXP_NAME,
  BATTERY_UPDATE,
  SET_SENSOR_DETAILS,
  SAMPLING_DATA,
} from '../types';
import { getDeviceIndexFromList, getColor } from '../../utils';

const initialState = {
  bleState: false,
  error: null,
  devices: [],
  update: 0,
  mode: 'continuous',
  record: false,
  recordIndex: 0,
  isReceiving: false,
  startTime: moment(new Date()),
  runNumber: 0,
  autoStop: {
    count: 0,
    format: 'Sec',
    enabled: false,
  },
  frequency: 1,
  buffer: {},
  sampled: {},
  time: 0,
  uid: '',
};

/* test data 
bleState --> state of bluetooth
error --> any errors
devices:[{
device: DEVICE ---> Device info
isConnected--> if bluetooth is connected,
unit,
parameter,
runs:{
  1:{name:'Run1' runId:1 data:[{payload:value, time:moment.now()}]} --> run1 data
  2:{name:'Run2', runId:2 data:[{payload:value, time:moment.now()}]} --> run2 data
}
update--> force updating if any device gets updated internally
startTime: moment.now() run start time
}]

*/

export default (state = initialState, action) => {
  const {
    type,
    payload,
    isConnected,
    deviceId,
    run,
    runName,
    key,
    uid,
    isCharging,
    battery,
    sensorDetails,
    currentUnits,
  } = action;
  let devices;
  let index;
  let data;
  let parameter;
  let runs;
  let graphData;
  let buffer;
  let time;
  let value;
  let bufferData;
  let connected;
  let sampledData;
  switch (type) {
    case BLE_STATE:
      return {
        ...state,
        bleState: payload,
      };
    case BLE_ERROR:
      return {
        ...state,
        error: payload,
      };

    case BLE_DEVICE:
      devices = state.devices;
      devices.push({ device: payload, isConnected });
      return {
        ...state,
        devices,
      };

    case DEVICE_UPDATE:
      devices = state.devices;
      index = getDeviceIndexFromList(payload.id, devices);
      let sensorParameter;
      let sensorUnit;
      if (sensorDetails) {
        [sensorParameter] = Object.keys(sensorDetails);
        [sensorUnit] = sensorDetails[sensorParameter];
      }
      devices.splice(index, 1, {
        ...devices[index],
        device: payload,
        isConnected,
        unit: sensorUnit,
        parameter: sensorParameter,
        sensorDetails,
        currentUnits,
        battery,
        isCharging,
      });
      return {
        ...state,
        devices,
        update: state.update + 1,
      };
    case MANUAL_DEVICE_ENTRY:
      devices = state.devices;
      devices.push({
        device: payload.device,
        type: 'manual',
        unit: payload.unit,
        parameter: payload.parameter,
        isConnected: true,
      });
      return {
        ...state,
        devices,
      };

    case RESET_BLE_DEVICE:
      return {
        ...state,
        devices: [],
      };

    case DATA_COLLECT_START:
      return {
        ...state,
        startTime: moment.now(),
        runNumber: run,
        recordIndex: 0,
        isReceiving: true,
      };
    case SERIAL_DATA_COLLECT:
      bufferData = get(state.buffer, `${deviceId}`, []);
      bufferData.push(payload);
      buffer = { ...state.buffer };
      buffer[deviceId] = bufferData;
      return {
        ...state,
        buffer,
      };
    case SAMPLING_DATA:
      devices = state.devices;
      index = getDeviceIndexFromList(deviceId, devices);
      sampledData = get(state.sampled, `${deviceId}`, []);
      parameter = devices[index].parameter;
      connected = devices.filter((dev) => dev.isConnected).length;
      time = parseFloat(
        (state.time + 1 / state.frequency / connected).toFixed(2),
      );
      if (time > 0) {
        value = parseFloat(
          parseFloat(
            get(last(state.buffer[deviceId]), `${parameter}`, 1).toFixed(3),
          ),
        );
        sampledData.push({ time, payload: value });
        buffer = { ...state.sampled };
        buffer[deviceId] = sampledData;
        return {
          ...state,
          sampled: buffer,
          time,
        };
      }
      return state;
    case FREQUENCY_DATA:
      devices = state.devices;
      index = getDeviceIndexFromList(deviceId, devices);
      // data = get(devices[index], `runs.${run}.data`, []);
      // graphData = get(devices[index], `runs.${run}.graphData`, []);
      runs = get(devices[index], 'runs', {});
      sampledData = get(state.sampled, `${deviceId}`, []);
      // parameter = devices[index].parameter;
      // connected = devices.filter((dev) => dev.isConnected).length;
      // time = parseFloat(
      //   (state.time + 1 / state.frequency / connected).toFixed(2),
      // );
      // value = parseFloat(
      //   parseFloat(
      //     get(last(state.buffer[deviceId]), `${parameter}`, 1).toFixed(3),
      //   ),
      // );
      devices.splice(index, 1, {
        ...devices[index],
        runs: {
          ...runs,
          [run]: {
            name: runName,
            runId: run,
            color: getColor(run),
            data: sampledData,
            graphData: [...takeRight(sampledData, 10)],
          },
        },
      });
      return {
        ...state,
        devices,
        record: false,
        recordIndex: state.recordIndex + 1,
        update: state.update + 1,
      };

    case DATA_UPDATE:
      devices = state.devices;
      index = getDeviceIndexFromList(deviceId, devices);
      data = get(devices[index], `runs.${run}.data`, []);
      graphData = get(devices[index], `runs.${run}.graphData`, []);
      runs = get(devices[index], 'runs', {});
      parameter = devices[index].parameter;
      time = state.time + 1 / state.frequency / devices.length;
      data[state.recordIndex] = {
        payload: parseFloat(payload[parameter].toFixed(3)),
        time,
      };
      graphData[state.recordIndex] = {
        payload: parseFloat(payload[parameter].toFixed(3)),
        time,
      };
      devices.splice(index, 1, {
        ...devices[index],
        runs: {
          ...runs,
          [run]: {
            data: [...data],
            graphData: [...graphData],
            name: runName,
            runId: run,
            color: getColor(run),
          },
        },
      });
      return {
        ...state,
        devices,
        time,
      };
    case MANUAL_DATA_UPDATE:
      devices = state.devices;
      index = getDeviceIndexFromList(deviceId, devices);
      data = get(devices[index], 'runs.[1].data', []);
      graphData = get(devices[index], 'runs.[1].graphData', []);
      runs = get(devices[index], 'runs', {});
      data[payload.index] = {
        payload: parseFloat(payload.data),
      };
      graphData[payload.index] = {
        payload: parseFloat(payload.data),
      };
      devices.splice(index, 1, {
        ...devices[index],
        runs: {
          1: {
            data: [...data],
            graphData: [...graphData],
            runId: 1,
            color: getColor(1),
            name: 'Run 1',
          },
        },
      });
      return {
        ...state,
        devices,
      };

    case DATA_STOP:
      return {
        ...state,
        isReceiving: false,
        buffer: {},
        sampled: {},
        time: 1,
      };

    case SET_MODE: {
      return {
        ...state,
        mode: payload,
      };
    }
    case SET_RECORD: {
      return {
        ...state,
        record: true,
      };
    }

    case DELETE_RUN: {
      const deletedRunData = state.devices.map((dev) => {
        const { runs: runData } = dev;
        payload.forEach((runId) => delete runData[runId]);
        return { ...dev, runs: runData };
      });
      return {
        ...state,
        devices: deletedRunData,
        update: state.update + 1,
      };
    }

    case EDIT_RUN: {
      const editedRunData = state.devices.map((dev) => {
        const { runs: runData } = dev;
        payload.forEach((val) => {
          if (runData[val.runId]) {
            runData[val.runId] = { ...runData[val.runId], name: val.name };
          }
        });
        return { ...dev, runs: runData };
      });
      return {
        ...state,
        devices: editedRunData,
        update: state.update + 1,
      };
    }

    case SET_AUTO_STOP: {
      return {
        ...state,
        autoStop: {
          ...state.autoStop,
          [key]: payload,
        },
      };
    }

    case SET_FREQ: {
      return {
        ...state,
        frequency: payload,
      };
    }

    case SAVE_EXP: {
      devices = state.devices.map((dev) => {
        const devData = { ...dev };
        delete devData.runs;
        return devData;
      });

      return {
        ...state,
        devices,
        update: 0,
        mode: 'continuous',
        record: false,
        recordIndex: 0,
        isReceiving: false,
        runNumber: 0,
        frequency: 1,
        buffer: {},
        time: 0,
        autoStop: {
          count: 0,
          format: 'Sec',
          enabled: false,
          wait() {
            if (this.enabled)
              switch (this.format) {
                case 'Min':
                  return parseInt(this.count * 60, 10) * 1000;
                case 'Sec':
                  return parseInt(this.count, 10) * 1000;
                default:
                  return 0;
              }
            return 0;
          },
        },
      };
    }

    case EXP_NAME:
      return {
        ...state,
        uid,
      };

    case LOAD_EXP: {
      return {
        ...payload.ble,
      };
    }

    case BATTERY_UPDATE: {
      devices = state.devices;
      index = getDeviceIndexFromList(deviceId, devices);
      devices.splice(index, 1, {
        ...devices[index],
        isConnected: true,
        battery,
        isCharging,
      });
      return {
        ...state,
        devices,
        update: state.update + 1,
      };
    }
    case SET_SENSOR_DETAILS:
      devices = state.devices;
      index = getDeviceIndexFromList(deviceId, devices);
      devices.splice(index, 1, {
        ...devices[index],
        parameter: payload.parameter,
        unit: payload.unit,
      });
      return {
        ...state,
        devices,
      };
    default:
      return state;
  }
};
