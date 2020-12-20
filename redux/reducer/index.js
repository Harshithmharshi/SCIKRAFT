import { combineReducers } from 'redux';
import ble from './ble';
import page from './page';

const allReducers = combineReducers({
  ble,
  page,
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === 'LOGOUT') {
    newState = undefined;
  }

  return allReducers(newState, action);
};

export default rootReducer;
