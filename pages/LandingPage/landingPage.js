import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
// import Geolocation from 'react-native-geolocation-service';
import styles from './landingPage_style';
import { Logo, Info, Tile } from '../../components';
import config from '../../config';
import Ruler from '../../assets/ruler.png';
import Page from '../../components/Page';
import Book from '../../assets/book.png';
import { getPermission } from '../../utils';
import {
  getDeviceBluetoothStatus,
  getDeviceBluetoothStatusOnChange,
} from '../../redux/actions';

const {
  container,
  curve,
  logo,
  info,
  footerText,
  footerLink,
  footer,
  header,
  tileContainer,
  tileGroup,
  tileGroupContainer,
  leftDevice,
  centerDevice,
  rightDevice,
} = styles;

const deviceCenter = require('../../assets/deviceCenter.png');
const deviceLeft = require('../../assets/deviceLeft.png');
const deviceRight = require('../../assets/deviceRight.png');

const { colors } = config;

const LandingPage = ({ navigation }) => {
  const dispatch = useDispatch();
  // would be used in future
  // eslint-disable-next-line no-unused-vars
  const reduxState = useSelector((state) => state, shallowEqual);
  const onPress = (routeName) => {
    navigation.navigate(routeName);
  };

  useEffect(() => {
    getPermission('ACCESS_FINE_LOCATION').then(() => {
      getPermission('WRITE_EXTERNAL_STORAGE');
    });
    dispatch(getDeviceBluetoothStatus());
    dispatch(getDeviceBluetoothStatusOnChange());
  }, []);
  const tiles = [
    {
      icon: Ruler,
      title: 'New Experiment',
      onPress: () => onPress('SensorListPage'),
    },
    {
      icon: Book,
      title: 'Saved Experiments',
      onPress: () => navigation.navigate('SavedExperiment'),
    },
  ];

  return (
    <Page>
      <View style={ container }>
        <View style={ curve }>
          <View style={ header }>
            <View style={ logo }>
              <Logo />
            </View>
            <View style={ info }>
              <Info backgroundColor={ colors.white } />
            </View>
          </View>
          <View>
            <Image source={ deviceCenter } style={ centerDevice } />
            <Image source={ deviceLeft } style={ leftDevice } />
            <Image source={ deviceRight } style={ rightDevice } />
          </View>
        </View>
        <View style={ tileGroupContainer }>
          <View style={ tileGroup }>
            {tiles.map((tile) => (
              <View style={ tileContainer } key={ tile.title }>
                <Tile { ...tile } />
              </View>
            ))}
          </View>
        </View>
        <View style={ footer }>
          <Text style={ footerText }>
            So how did the classical Latin become so incoherent? According to
            McClintock, a 15th century typesetter likely scrambled part of
            Clcero`&apos;`s De Finibus in oredr to provide placeholder text to
            mockup various fonts for a type specimen book.
          </Text>
          <Text style={ footerLink }>visit page</Text>
        </View>
      </View>
    </Page>
  );
};
export default LandingPage;
