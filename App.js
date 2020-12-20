/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView, AppState, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GlobalFont from 'react-native-global-font';
import KeepAwake from 'react-native-keep-awake';
import {
  LandingPage,
  SensorListPage,
  ExperimentPage,
  MyExperimentsPage,
} from './src/pages';
import store from './src/redux/store';
import { stopAllSensors } from './src/redux/actions';
import branch from './src/config/branch.config';

const Stack = createStackNavigator();

const screenOptions = { animationEnabled: true, headerShown: false };

const pages = [
  { name: 'Landing', component: LandingPage },
  { name: 'SavedExperiment', component: MyExperimentsPage },
  { name: 'SensorListPage', component: SensorListPage },
  { name: 'ExperimentPage', component: ExperimentPage },
];

const App = () => {
  const [keepScreenAwake] = useState(true);

  const handleAppStateChange = (appState) => {
    if (appState === 'background') {
      // code clean up on background state
      store.dispatch(stopAllSensors());
    }
  };

  useEffect(() => {
    if (branch.logBox) {
      // Ignore all log notifications :
      LogBox.ignoreAllLogs();
    }
    const fontName = 'ProximaNova';
    GlobalFont.applyGlobal(fontName);
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  useEffect(() => {
    if (keepScreenAwake) {
      KeepAwake.activate();
    }
  }, [keepScreenAwake]);
  return (
    <Provider store={ store }>
      <SafeAreaView
        style={ {
          display: 'flex',
          flex: 1,
        } }>
        <NavigationContainer>
          <Stack.Navigator screenOptions={ screenOptions }>
            {pages.map((page) => (
              <Stack.Screen { ...page } key={ page.name } />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
