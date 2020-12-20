import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import {
  BleManager,
  // BleError
} from 'react-native-ble-plx';
import thunk from 'redux-thunk';
import reducers from '../reducer';
import branch from '../../config/branch.config';

const DeviceManager = new BleManager();

const initialState = {};

const middleware =
  branch.env === 'DEV'
    ? [thunk.withExtraArgument(DeviceManager), logger]
    : [thunk.withExtraArgument(DeviceManager)];
const Store = createStore(
  reducers,
  initialState,
  applyMiddleware(...middleware),
);

export default Store;
