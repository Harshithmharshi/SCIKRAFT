/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Image from '../Image';
import styles from './graph_style';
import Zoom from '../../assets/zoom.png';
import Fit from '../../assets/fit.png';
import CurveFitIcon from '../../assets/curveFitIcon.png';
import GrapSetIcon from '../../assets/grapSetIcon.png';
import PanSelectIcon from '../../assets/panSelectIcon.png';
import SlopeIcon from '../../assets/slopeIcon.png';
import config from '../../config';

const { colors } = config;

const {
  toolHeader,
  toolText,
  optionStyle,
  toolContainer,
  imageContainer,
  itemsContainer,
  imageView,
  textContainer,
  iconStyle,
  toolsText,
} = styles;

const Tools = ({
  openToolModal,
  optRefs,
  handleToolSelect,
  mode,
  disabledTools,
}) => {
  const getOptions = () => [
    {
      img: Zoom,
      name: 'Zoom Setting',
      id: 1,
      isModal: true,
    },
    {
      img: Fit,
      name: 'Fit Graph',
      id: 2,
      isModal: false,
    },
    {
      img: PanSelectIcon,
      name: mode === 1 ? 'Select' : 'Pan',
      id: 3,
      isModal: false,
    },
    {
      img: CurveFitIcon,
      name: 'Curve Fit',
      id: 4,
      isModal: false,
    },
    {
      img: SlopeIcon,
      name: 'Calculate Slope',
      id: 5,
      isModal: false,
    },
    {
      img: GrapSetIcon,
      name: 'Graph Settings',
      id: 6,
      isModal: true,
    },
  ];
  const options = useMemo(getOptions, [mode]);
  const handlePress = (ref, name, isModal, id) => {
    const offset = { x: -250, y: -28 };
    if (isModal) {
      openToolModal(ref, offset, name);
      return;
    }
    handleToolSelect(id);
  };
  return (
    <>
      <View style={ toolHeader }>
        <Text style={ toolText }>Tools</Text>
      </View>
      <ScrollView contentContainerStyle={ toolContainer }>
        {options.map((opt, index) => (
          <View key={ opt.id } style={ imageContainer }>
            <TouchableWithoutFeedback
              disabled={ disabledTools[index] }
              ref={ (r) => (optRefs.current[index] = r) }
              style={
                disabledTools[index]
                  ? { ...optionStyle, backgroundColor: colors.grey2 }
                  : { ...optionStyle }
              }
              onPress={ () =>
                handlePress(
                  optRefs.current[index],
                  opt.name,
                  opt.isModal,
                  opt.id,
                )
              }>
              <View style={ itemsContainer }>
                <View style={ imageView }>
                  <Image source={ opt.img } key={ opt.id } style={ iconStyle } />
                </View>
                <View style={ textContainer }>
                  <Text style={ toolsText }>{opt.name}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default Tools;
