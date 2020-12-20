import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
// eslint-disable-next-line import/no-cycle
import { Textinput, Dropdown, Checkbox, Button } from '..';
import styles from './footer_styles';
import config from '../../config';
import FooterModal from './footerModal';

const { colors, fonts } = config;

const {
  settingsContainer,
  settingsContent,
  settingsHeader,
  headerText,
  itemContainer,
  itemTextStyle,
  buttonContainer,
  buttonStyle,
  containerStyle,
  textContainer,
  dropdownContainer,
  textInputstyle,
  settingsBody,
  iconView,
  headerStyle,
  closeIconContainer,
  settingsText,
  checkboxStyle,
  labelTextStyle,
} = styles;

const sensorModeOptions = [
  { id: 1, label: 'Continuous', value: 'continuous' },
  { id: 2, label: 'On Click Record', value: 'onClickRecord' },
];
const setPeriodOptions = [
  { id: 1, label: '20 Hz', value: 20 },
  { id: 2, label: '10 Hz', value: 10 },
  { id: 3, label: '5 Hz', value: 5 },
  { id: 4, label: '2 Hz', value: 2 },
  { id: 5, label: '1 Hz', value: 1 },
  { id: 6, label: '0.5 Hz', value: 0.5 },
  { id: 7, label: '0.2 Hz', value: 0.2 },
  { id: 8, label: '0.1 Hz', value: 0.1 },
];
const timeFormatOptions = [
  { id: 1, label: 'Min', value: 'Min' },
  { id: 2, label: 'Sec', value: 'Sec' },
];

const initialState = {
  sensorMode: 'continuous',
  isClicked: -1,
  displayDropDown: false,
  modal: false,
};

const Settings = ({
  runData,
  onModeChange,
  mode,
  onPressCancel,
  autoStop,
  onTimeChange,
  handleCheckbox,
  autoStopFormat,
  frequency,
  setFrequency,
}) => {
  const [state, setState] = useState(initialState);

  const { isClicked, displayDropDown, modal } = state;
  const handleDropdown = (item, id) => {
    if (id === 'sensorMode') {
      onModeChange(item.value);
    } else if (id === 'timeFormat') {
      autoStopFormat(item.value);
    } else if (id === 'setPeriod') {
      setFrequency(item.value);
    }
    setState({ ...state, displayDropDown: false });
  };

  const handleButtonClick = (id) => {
    setState({
      ...state,
      isClicked: id,
      modal: true,
    });
  };
  const handleCancel = () => {
    setState({
      ...state,
      isClicked: -1,
    });
  };

  const onDropdownOpen = (dId) => {
    setState({
      ...state,
      displayDropDown: dId,
    });
  };

  const onBackdrop = () => {
    setState({
      ...state,
      displayDropDown: false,
      modal: false,
    });
  };
  const labelStyle = {
    fontSize: fonts[24],
  };
  return (
    <TouchableWithoutFeedback onPress={ onBackdrop } style={ settingsContainer }>
      <View style={ settingsBody }>
        <View style={ settingsHeader }>
          <View style={ headerStyle }>
            <Text style={ headerText }>Settings</Text>
          </View>
          <View style={ closeIconContainer }>
            <View style={ iconView }>
              <TouchableWithoutFeedback onPress={ onPressCancel }>
                <Icon
                  name="close-circle-outline"
                  size={ hp(5) }
                  color={ colors.red }
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View style={ settingsContent }>
          <View style={ itemContainer }>
            <View style={ settingsText }>
              <Text style={ itemTextStyle }>Sensor Mode</Text>
            </View>
            <View style={ containerStyle }>
              <Dropdown
                selectId={ displayDropDown }
                onOpen={ onDropdownOpen }
                items={ sensorModeOptions }
                onChangeDropdown={ handleDropdown }
                placeholder="Select"
                id="sensorMode"
                selectedValue={ mode }
                label={ labelStyle }
              />
            </View>
          </View>
          <View style={ itemContainer }>
            <View style={ settingsText }>
              <Text style={ itemTextStyle }>Set Period</Text>
            </View>
            <View style={ containerStyle }>
              <Dropdown
                items={ setPeriodOptions }
                onChangeDropdown={ handleDropdown }
                placeholder="Select"
                id="setPeriod"
                selectedValue={ frequency }
                selectId={ displayDropDown }
                onOpen={ onDropdownOpen }
                label={ labelStyle }
              />
            </View>
          </View>
          <View style={ { ...itemContainer, flex: 2.5 } }>
            <View style={ settingsText }>
              <Text style={ itemTextStyle }>Manage Runs</Text>
            </View>
            <View style={ { ...buttonContainer } }>
              <View style={ buttonStyle }>
                <Button
                  backgroundColor={ colors.blue }
                  title="Delete Run"
                  fontSize={ 24 }
                  type="button"
                  color="white"
                  highlightColor={ colors.blue }
                  handleClick={ handleButtonClick }
                  id={ 0 }
                />
                <FooterModal
                  headerTitle="Delete Run"
                  runData={ runData }
                  modalOpen={ isClicked === 0 && modal }
                  buttonTitle="Delete"
                  handleCancel={ handleCancel }
                  onBackdrop={ onBackdrop }
                  isDelete
                />
              </View>
              <View style={ buttonStyle }>
                <Button
                  backgroundColor={ colors.blue }
                  title="Rename Run"
                  fontSize={ 24 }
                  type="button"
                  color="white"
                  handleClick={ handleButtonClick }
                  highlightColor={ colors.blue }
                  isClicked={ isClicked }
                  id={ 1 }
                />
                <FooterModal
                  headerTitle="Rename Run"
                  runData={ runData }
                  modalOpen={ isClicked === 1 && modal }
                  buttonTitle="Update"
                  handleCancel={ handleCancel }
                  onBackdrop={ onBackdrop }
                  icon="pencil"
                  isRename
                />
              </View>
            </View>
          </View>
          <View style={ itemContainer }>
            <View style={ settingsText }>
              <Checkbox
                text="Set Auto-Stop"
                isSelected={ autoStop.enabled }
                handleSelection={ handleCheckbox }
                checkboxStyle={ checkboxStyle }
                labelTextStyle={ labelTextStyle }
              />
            </View>
            <View style={ { ...buttonContainer } }>
              <View style={ textContainer }>
                <Textinput
                  placeholder="00"
                  keyboardType="numeric"
                  value={ autoStop.count.toString() }
                  onChangeText={ onTimeChange }
                  style={ textInputstyle }
                  editable={ autoStop.enabled }
                />
              </View>
              <View style={ dropdownContainer }>
                <Dropdown
                  items={ timeFormatOptions }
                  onChangeDropdown={ handleDropdown }
                  placeholder="Select"
                  id="timeFormat"
                  selectedValue={ autoStop.format }
                  onOpen={ onDropdownOpen }
                  selectId={ displayDropDown }
                  label={ labelStyle }
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Settings;
