import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import styles from './header_styles';
import config from '../../config';
import Modal from '../Modal';
import { getMeasure } from '../../utils';
import TextInput from '../TextInput';
import { renamePage } from '../../redux/actions';

const { colors } = config;
const {
  mainContainer,
  menuList,
  navigationText,
  modalContainer,
  modalText,
  iconContainer,
  navigatorStyle,
  navigateTextContainer,
  pageText,
} = styles;
const initialState = {
  childTop: 1,
  childLeft: 1,
  childModalOpen: false,
  selectedPage: null,
  isEditing: [],
  selectedIndex: null,
  pageName: null,
};
const options = [{ value: 'Delete Page' }, { value: 'Rename Page' }];
const PageNavigator = ({
  menuItem,
  width,
  handlePageNavigator,
  deletePage,
  closeMainModal,
}) => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const {
    childLeft,
    childTop,
    childModalOpen,
    selectedPage,
    isEditing,
    selectedIndex,
    pageName,
  } = state;
  const navigatortIconRef = useRef([]);
  const inputRef = useRef([]);
  const openModal = (ref, offset, clickedPage, clickedIndex) => {
    getMeasure(ref, (x, y, w, h, px, py) => {
      setState({
        ...state,
        childLeft: px + offset.x,
        childTop: py + offset.y,
        childModalOpen: true,
        selectedPage: clickedPage,
        selectedIndex: clickedIndex,
      });
    });
  };
  const closeModal = () => {
    const isNotEditing = isEditing.every((value) => value === false);
    if (isNotEditing) {
      setState({
        ...state,
        childModalOpen: false,
        selectedPage: null,
      });
    } else {
      setState({
        ...state,
        childModalOpen: false,
      });
    }
  };
  const onChange = (e) => {
    setState({
      ...state,
      pageName: e,
    });
  };
  const handleOnBlur = async () => {
    if (pageName !== null && pageName !== '') {
      await dispatch(renamePage(selectedPage, pageName));
    }
    const editing = [...isEditing];
    editing[selectedIndex] = false;
    setState({
      ...state,
      isEditing: editing,
      selectedIndex: null,
      selectedPage: null,
    });
    closeMainModal();
  };
  useEffect(() => {
    const isPageEditing = new Array(menuItem.length).fill(false);
    setState({
      ...state,
      isEditing: isPageEditing,
    });
  }, []);
  useEffect(() => {
    if (isEditing[selectedIndex]) {
      setTimeout(() => inputRef.current[selectedIndex].focus(), 40);
    }
  }, [isEditing]);
  const handlePageDelete = (id, value) => {
    if (value === 'Delete Page') {
      deletePage(id);
      closeModal();
    } else {
      const editing = [...isEditing];
      editing[selectedIndex] = true;
      setState({
        ...state,
        isEditing: editing,
        childModalOpen: false,
      });
    }
  };

  return (
    <View style={ { ...mainContainer, width: width + width / 6 } }>
      {menuItem.map(({ name, id }, index) => (
        <View style={ navigatorStyle } key={ id }>
          <View
            style={
              index === selectedPage
                ? {
                    ...iconContainer,
                    backgroundColor: colors.red,
                  }
                : { ...iconContainer }
            }>
            <TouchableWithoutFeedback
              // eslint-disable-next-line no-return-assign
              ref={ (ref) => (navigatortIconRef.current[index] = ref) }
              onPress={ () =>
                openModal(
                  navigatortIconRef.current[index],
                  { x: -wp(22), y: -70 },
                  id,
                  index,
                )
              }>
              <Icon name="apps" size={ wp(2) } color={ colors.grey2 } />
            </TouchableWithoutFeedback>
          </View>
          <View style={ navigateTextContainer }>
            {isEditing[index] ? (
              <TextInput
                handleOnBlur={ () => handleOnBlur() }
                style={ pageText }
                onChangeText={ (e) => onChange(e) }
                // eslint-disable-next-line no-return-assign
                setRef={ (el) => (inputRef.current[index] = el) }
              />
            ) : (
              <TouchableWithoutFeedback onPress={ () => handlePageNavigator(id) }>
                <Text style={ navigationText }>{name}</Text>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      ))}
      <Modal
        left={ childLeft }
        top={ childTop }
        modalOpen={ childModalOpen }
        onBackdropPress={ closeModal }>
        <View style={ modalContainer }>
          {options.map(({ value }) => {
            return (
              <TouchableWithoutFeedback
                key={ value }
                onPress={ () => handlePageDelete(selectedPage, value) }>
                <View style={ menuList }>
                  <Text style={ modalText }>{value}</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default PageNavigator;
