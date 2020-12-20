import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './sensorListPage_styles';
import config from '../../config';
// eslint-disable-next-line import/no-cycle
import { Image, Dropdown, Button } from '../../components';

const { colors } = config;
const {
  mainContainer,
  buttonContainer,
  button,
  headerStyle,
  textStyle,
  dropdownContainer,
  labelContainer,
  dropdownStyle,
  dropdownContent,
  emptyContainer,
  dropdown,
  labelStyle,
  modal,
} = styles;
const SettingsContent = ({
  sensor,
  onPressCancel,
  handleDropdown,
  dropdownElements,
  onPressSave,
  physicalParameter,
}) => {
  const [selectId, setSelectId] = useState('');
  return (
    <TouchableWithoutFeedback
      onPress={ () => {
        setSelectId('');
      } }>
      <View style={ [mainContainer, modal] }>
        <View style={ headerStyle }>
          <View>
            <Image source={ sensor.image } width={ wp(8) } height={ hp(10) } />
          </View>
          <Text style={ textStyle }>{sensor.name}</Text>
        </View>
        <View style={ dropdownContainer }>
          {dropdownElements.map(
            ({ title, placeHolder, options, value, id }) => {
              const disabled =
                id === 'physicalParameter' ? false : physicalParameter === null;
              const option = options.length
                ? options.map((param, index) => {
                    return {
                      id: index,
                      label: param,
                      value: param,
                    };
                  })
                : [{ id: 0, label: 'select', value: 'select' }];
              return (
                <View style={ dropdownContent } key={ id }>
                  <View style={ labelContainer }>
                    <Text style={ labelStyle }>{title}</Text>
                  </View>
                  <View style={ emptyContainer } />
                  <View style={ dropdownStyle }>
                    <View style={ dropdown }>
                      <Dropdown
                        onOpen={ (dropdownId) => setSelectId(dropdownId) }
                        selectId={ selectId }
                        items={ option }
                        onChangeDropdown={ handleDropdown }
                        selectedValue={ value }
                        placeholder={ placeHolder }
                        id={ id }
                        disabled={ disabled }
                      />
                    </View>
                  </View>
                </View>
              );
            },
          )}
        </View>
        <View style={ buttonContainer }>
          <View style={ button }>
            <Button
              title="Cancel"
              backgroundColor={ colors.white }
              fontSize={ 20 }
              type="button"
              handleClick={ onPressCancel }
              color={ colors.black }
              highlightColor={ colors.lightGrey }
            />
          </View>
          <View style={ button }>
            <Button
              title="Save"
              backgroundColor={ colors.white }
              fontSize={ 20 }
              type="button"
              handleClick={ onPressSave }
              color={ colors.black }
              highlightColor={ colors.lightGrey }
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default SettingsContent;
