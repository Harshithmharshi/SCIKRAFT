import React, { useState, useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Page from '../../components/Page';
import styles from './experiment_styles';
import PageLayouts from '../PageLayouts/PageLayouts';
import LayoutButton from '../../components/LayoutButton/layoutButton';
import { getCurrentPageById } from '../../utils';
import {
  changePage,
  savePage,
  setFrequency,
  triggerAlert,
  setModal,
} from '../../redux/actions';

const { container, buttonContainer, pageContent } = styles;
const headerProps = {
  display: true,
  text: 'Sensors in Range',
};
const footerProps = {
  display: true,
  text: 'Start Experiment',
};
const initialState = {
  menuDisplay: false,
};

const ExperimentPage = () => {
  const [state, setState] = useState(initialState);
  const { menuDisplay } = state;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const reduxState = useSelector((currentState) => currentState, shallowEqual);

  const {
    page: { pages, currentPage, isExpanded },
    ble: { frequency },
  } = reduxState;
  const backAction = async () => {
    if (isExpanded) {
      dispatch(setModal());
      return true;
    }
    if (currentPage === 0) {
      dispatch(savePage());
      setTimeout(() => {
        navigation.pop();
      }, 500);
    } else {
      setTimeout(() => {
        dispatch(savePage());
      }, 1000);
      dispatch(changePage(currentPage - 1));
    }
    return true;
  };

  const beforeExiting = (e) => {
    const modal = {
      name: 'save_experiment',
      header: 'Are you sure you want to save?',
      input: {
        display: true,
        id: 'expId',
        placeHolder: 'Experiment Name',
        onChange: 'onExpNameChange',
        default: `Experiment_${moment.now()}`,
      },
      buttons: [
        { title: 'Yes', isAction: true },
        { title: 'No', isAction: false },
      ],
    };
    dispatch(triggerAlert(e.data.action, modal));
    e.preventDefault();
  };

  // component did mount
  useEffect(() => {
    setFrequency(frequency);
    navigation.addListener('beforeRemove', beforeExiting);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      navigation.removeListener('beforeRemove', beforeExiting);
    };
  }, []);

  // update event listener based on page
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
  }, [currentPage, isExpanded]);
  const { layout } = getCurrentPageById(pages, currentPage);
  return (
    <Page
      headerProps={ headerProps }
      footerProps={ footerProps }
      getMenusStatus={ (val) => setState({ ...setState, menuDisplay: val }) }>
      <View style={ container }>
        {!isExpanded && (
          <View style={ buttonContainer }>
            <LayoutButton />
          </View>
        )}
        <View style={ pageContent }>
          <PageLayouts
            layout={ layout }
            menuDisplay={ menuDisplay }
            currentPage={ currentPage }
          />
        </View>
      </View>
    </Page>
  );
};
export default ExperimentPage;
