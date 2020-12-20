import {
  Linking,
  UIManager,
  findNodeHandle,
  Keyboard,
  PermissionsAndroid,
  PixelRatio,
} from 'react-native';
import { useState, useEffect } from 'react';
import base64 from 'react-native-base64';
import memoize from 'lodash/memoize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RNFetchBlob from 'rn-fetch-blob';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import last from 'lodash/last';
import { parse, stringify } from 'flatted';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const lightSensor = require('../assets/blueBulb2x.png');
const magneticSensor = require('../assets/blueMagnet2x.png');
const temperatureSensor = require('../assets/blueTemp2x.png');

export const goToLink = (link) => {
  // link--> external weblink
  Linking.openURL(link);
};

export const insertItem = (arr, index, newItem) => [
  // part of the array before the specified index
  // arr array
  // index index of an array where element needs to inserted
  // newItem --> element which needs to be inserted
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
];

export const isPopNeeded = (counts, elementsCount) => {
  const elements = [];
  // eslint-disable-next-line array-callback-return
  Object.keys(counts).map((element) => {
    if (elementsCount[element] > counts[element]) {
      elements.push(element);
    }
  });
  return elements;
};
export const removeItem = (arr, index) => {
  // arr -> array
  // index index which you want to remove from array
  arr.splice(index, 1);
  return arr;
};

export const getMeasure = (ref, cb) => {
  // ref referennce of the react element
  // cn callback which needs to be executed
  const handle = findNodeHandle(ref);
  return UIManager.measure(handle, cb);
};

export const useKeyPad = () => {
  // custom hook which return keypad is visible
  const [keyPadStatus, setKeypadStatus] = useState(false);

  const keyboardDidShow = (e) => {
    //
    setKeypadStatus(e.endCoordinates.height);
  };

  const keyboardDidHide = () => {
    setKeypadStatus(false);
  };
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  return keyPadStatus;
};

export const getPermission = async (val) => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS[val],
    {
      title: 'Access Fine Location',
      message: 'App needs access to your Bluetooth so we can stay connected.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const getIconFromName = (name) => {
  switch (name) {
    case 'SWIS L':
      return lightSensor;
    case 'SWIS Lux':
      return lightSensor;
    case 'SWIS Mag':
      return magneticSensor;
    case 'SWIS T':
      return temperatureSensor;
    default:
      return null;
  }
};

export const getDeviceFromList = memoize((id, state) => {
  return state.ble.devices.filter((device) => device.device.id === id)[0]
    .device;
});

export const getAllConnectedDevices = (state) => {
  return state.ble.devices
    .filter((device) => device.isConnected)
    .map((device) => device);
};

export const decodeData = (value, key) => {
  try {
    const decoded = JSON.parse(base64.decode(value));
    return decoded[key];
  } catch (error) {
    return error;
  }
};

export const getDeviceIndexFromList = memoize((id, devices) =>
  devices.findIndex((d) => d.device.id === id),
);

export const getDataById = (state, id) => {
  const data = state.ble.devices.filter(
    (deviceData) => deviceData.device.id === id,
  );
  return data;
};

export const getRunsById = (id, state) => {
  let data = state.ble.devices.filter(
    (deviceData) => deviceData.device.id === id,
  );
  data = data && get(data[0], 'runs', {});
  data = Object.entries(data).map(([key, val]) => {
    return {
      id: key,
      label: val && val.name,
      value: val && val.name,
    };
  });
  return data;
};
const wScale = wp(100) / 550;
const hScale = hp(100) / 420;
export const normalizeFont = memoize((size) => {
  const newSize = size * wScale * hScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
});

export const getLastUpdatedSensorData = (data) => {
  const currentRun = Object.keys(data).pop();
  const runVal = get(data[currentRun], 'data', []);
  return get(last(runVal), 'payload', '');
};

export const getAllRunDetails = memoize((connectedDevices) => {
  const runData = [];
  connectedDevices.forEach((dev) => {
    const runs = get(dev, 'runs', {});
    Object.values(runs).forEach((run) => {
      runData.push(run);
    });
  });
  return uniqBy(runData, 'name');
});

export const randomRGB = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return `rgb(${red}, ${green}, ${blue})`;
};

const colors = {};

export const getColor = (id) => {
  if (colors[id]) {
    return colors[id];
  }
  colors[id] = randomRGB();
  return randomRGB();
};

export const getCurrentPageById = (pages, id) => {
  return pages.filter((page) => page.id === id)[0];
};

export const getCurrentPageIndex = (pages, id) => {
  return pages.findIndex((page) => page.id === id);
};
// let avg = [];
// let run = 0;
// export const getAveragedTime = (state, ids, runNumber) => {
//   if (run !== runNumber) {
//     avg = [];
//     run = runNumber;
//   }
//   let filteredDevices = state.ble.devices.filter((device) =>
//     ids.includes(device.device.id),
//   );
//   filteredDevices = filteredDevices.map((dev) =>
//     get(dev, `runs[${runNumber}].data`, []),
//   );
//   let sum = -1;
//   if (filteredDevices[0] && filteredDevices[0].length) {
//     for (let i = avg.length; i < filteredDevices[0].length; i++) {
//       if (sum > -1) {
//         avg.push((sum / filteredDevices.length).toFixed(1));
//         sum = 0;
//       }
//       for (let j = 0; j < filteredDevices.length; j++) {
//         if (filteredDevices[j][i]) sum += filteredDevices[j][i].time;
//       }
//     }
//   }
//   return avg;
// };

export const getAllRuns = (state, ids) => {
  const allDropDowns = ids.map((id) => getRunsById(id, state));
  return uniqBy(allDropDowns.flat(1), 'id');
};

export const getFrequencyConfig = (frequency) => {
  return `{"config":{"update_interval":${1000 / frequency}}}`;
};
export const setSensorUnit = (parameter, unit) => {
  return `{"config":{"unit":{'${parameter}':'${unit}'}}}`;
};
export const getSensorNameById = memoize((id, sensors) => {
  if (id === 'time') {
    return id;
  }
  const { parameter, unit, device } = sensors.filter(
    (ele) => get(ele, 'device.id', '') === id,
  )[0];
  return `${parameter}(${unit})(${device.id.substr(9, 16)})`;
});

export const writeCSV = (data, format) => {
  return (
    data.length > 0 &&
    data.forEach((dev) => {
      const runs = dev.runs !== undefined ? Object.keys(dev.runs) : [];
      runs.forEach((run) => {
        const head = 'time,value\n';
        const rows = dev.runs[run].data
          .map((val) =>
            val !== undefined
              ? `${val.time},${val.payload}\n`
              : `${''},${''}\n`,
          )
          .join('');
        const csvString = `${head}${rows}`;
        const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/SCIK/${
          dev.device.name
        }_${run}_${moment().format()}.${format}`;
        // pathToWrite /storage/emulated/0/Download/data.csv
        RNFetchBlob.fs
          .writeFile(pathToWrite, csvString, 'utf-8')
          .then(() => {
            // wrote file /storage/emulated/0/Download/data.csv
          })
          .catch((error) => console.error(error));
      });
    })
  );
};

export const storeToLocal = async (key, val) => {
  try {
    const jsonValue = stringify(val);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    // console.log(error);
  }
};

export const getFromLocal = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    return {};
  }
};

export const getWait = ({ enabled, format, count }) => {
  if (enabled)
    switch (format) {
      case 'Min':
        return parseInt(count * 60, 10) * 1000;
      case 'Sec':
        return parseInt(count, 10) * 1000;
      default:
        return 0;
    }
  return 0;
};

export const getSensorParams = (connectedSensors, sensorId) => {
  const selectedSensor = connectedSensors.filter(
    (sensor) => sensor.device.id === sensorId,
  );
  return Object.keys(get(selectedSensor[0], 'sensorDetails', {}));
};

export const getSensorUnits = (connectedSensors, sensorId, parameter) => {
  const selectedSensor = connectedSensors.filter(
    (sensor) => sensor.device.id === sensorId,
  );
  return get(selectedSensor[0], `sensorDetails.${parameter}`, []);
};

export const getModeById = (state, id) => {
  const connectedDevices = getAllConnectedDevices(state);
  const selectedSensor = connectedDevices.filter(
    (sensor) => sensor.device.id === id,
  );
  return get(selectedSensor[0], 'type', '');
};
