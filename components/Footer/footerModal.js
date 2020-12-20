/* eslint-disable react/no-array-index-key */
import React, { useState, Fragment, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Font from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import Modal from '../Modal';
import styles from './footer_styles';
import Button from '../Button';
import Checkbox from '../Checkbox';
import TextInput from '../TextInput';

import config from '../../config';
import { removeItem, useKeyPad } from '../../utils';
import { deleteRuns, editRuns } from '../../redux/actions';

const { colors } = config;

const {
  modalOptionContainer,
  body,
  textStyle,
  modalView,
  footer,
  bodyText,
  header,
  bodyStyle,
  line,
  footerButtonStyle,
  iconStyle,
  checkBoxContainer,
  modalScroll,
} = styles;

const initialState = {
  left: wp(44),
  top: hp(27),
  selected: [],
  runEdited: [],
};

const FooterModal = ({
  icon,
  runData,
  modalOpen,
  buttonTitle,
  headerTitle,
  handleCancel,
  onBackdrop,
  isDelete,
  isRename,
}) => {
  const [state, setState] = useState(initialState);
  const { top, left, selected, runEdited } = state;
  const isKeypad = useKeyPad();
  const dispatch = useDispatch();
  const inputRef = useRef([]);
  // updates modal position based on keypad
  useEffect(() => {
    if (isKeypad) {
      setState({
        ...state,
        top: hp(-5),
      });
    } else {
      setState({
        ...state,
        top: hp(27),
      });
    }
  }, [isKeypad]);
  useEffect(() => {
    if (isRename && selected.length > 0) {
      const selectedRun = selected[0] - 1;
      setTimeout(() => inputRef.current[selectedRun].focus(), 40);
    }
  }, [selected]);
  // updates run state based on props
  useEffect(() => {
    setState({
      ...state,
      runEdited: runData,
    });
  }, [runData]);

  const handleSubmit = () => {
    if (isDelete) {
      dispatch(deleteRuns(selected));
    } else if (isRename) {
      dispatch(editRuns(runEdited));
    }
    handleCancel();
    setState({
      ...state,
      selected: [],
    });
  };

  const onClick = (id) => {
    if (!selected.includes(id)) {
      setState((prev) => ({
        ...state,
        selected: [...prev.selected, id],
      }));
    } else {
      const index = selected.indexOf(id);
      setState({
        ...state,
        selected: removeItem([...selected], index),
      });
    }
  };

  const onChange = (e, id) => {
    const editedRun = runEdited.map((run) => {
      if (run.runId === id) {
        return { ...run, name: e };
      }
      return { ...run };
    });
    setState((prev) => ({
      ...prev,
      runEdited: editedRun,
    }));
  };
  const handleBackDrop = () => {
    setState({
      ...state,
      selected: [],
      runEdited: runData,
    });
    onBackdrop();
  };
  return (
    <Modal
      left={ left }
      top={ top }
      modalOpen={ modalOpen }
      onBackdropPress={ handleBackDrop }>
      <View style={ modalOptionContainer }>
        <View style={ modalView }>
          <View style={ header }>
            <Text style={ textStyle }>{headerTitle}</Text>
          </View>
          <View style={ line } />
          <View style={ body }>
            <ScrollView style={ modalScroll }>
              {runEdited.map((mode, index) => (
                <Fragment key={ mode.runId }>
                  <View style={ bodyStyle }>
                    {icon ? (
                      <Font
                        onPress={ () => onClick(mode.runId) }
                        name={ icon }
                        size={ hp(3) }
                        style={ iconStyle }
                      />
                    ) : (
                      <View style={ checkBoxContainer }>
                        <Checkbox
                          text={ mode.name }
                          handleSelection={ () => onClick(mode.runId) }
                          isSelected={ selected.includes(mode.runId) }
                        />
                      </View>
                    )}
                    {icon && (
                      <TextInput
                        onChangeText={ (e) => onChange(e, mode.runId) }
                        editable={ isRename && selected.includes(mode.runId) }
                        // eslint-disable-next-line no-return-assign
                        setRef={ (el) => (inputRef.current[index] = el) }
                        style={ bodyText }>
                        {mode.name}
                      </TextInput>
                    )}
                  </View>
                </Fragment>
              ))}
            </ScrollView>
          </View>
          <View style={ footer }>
            <View style={ footerButtonStyle }>
              <Button
                title={ buttonTitle }
                backgroundColor={ colors.blue }
                fontSize={ 24 }
                type="button"
                handleClick={ handleSubmit }
                highlightColor={ colors.blue }
                color={ colors.white }
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FooterModal;
