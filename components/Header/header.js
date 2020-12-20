/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-cycle */
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { find } from 'lodash';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import PageOptions from './pageOptions';
import styles from './header_styles';
import { Info } from '..';
import config from '../../config';
import SideBar from '../Sidebar/sidebar';
import {
  getMeasure,
  getCurrentPageById,
  getCurrentPageIndex,
} from '../../utils';
import Modal from '../Modal';
import PageNavigator from './pageNavigator';
import {
  addPage,
  changePage,
  renamePage,
  triggerAlert,
} from '../../redux/actions';
import TextInput from '../TextInput';

const { colors, fonts } = config;
const {
  headerMain,
  navIcon,
  textContainer,
  textStyle,
  infoContainer,
  textContainer2,
  textStyle2,
  pageNavigator,
  shareOption,
  forwardArrow,
  backwardArrow,
  navigatorContainer,
  pageOptionContainer,
  navigateOptionContainer,
  pageText,
} = styles;
const pageOptions = [
  { value: 'Add Page' },
  { value: 'Delete Page' },
  { value: 'Rename Page' },
];

const initialState = {
  modalOpen: false,
  modalName: null,
  left: 1,
  top: 1,
  width: 1,
  editPage: false,
  isEditing: false,
  editedName: '',
  forwardDisable: false,
  backwardDisable: false,
};
const modal = {
  name: 'delete_page',
  header: 'Are you sure you want to Delete?',
  buttons: [
    { title: 'Yes', isAction: true },
    { title: 'No', isAction: false },
  ],
};

const Header = ({ text, type, display, menuDisplay, handleMenuClick }) => {
  const [state, setState] = useState(initialState);
  const {
    left,
    top,
    modalName,
    modalOpen,
    width,
    editPage,
    editedName,
    forwardDisable,
    backwardDisable,
  } = state;
  const reduxState = useSelector((currentState) => currentState, shallowEqual);
  const dispatch = useDispatch();
  const {
    page: { pages, currentPage },
    ble: { devices },
  } = reduxState;

  const { name: pageName } = getCurrentPageById(pages, currentPage);
  const index = getCurrentPageIndex(pages, currentPage);

  const pageSettings = useRef();
  const inputRef = useRef();
  const navigationRef = useRef([]);

  const handleShare = () => {
    const shareModal = {
      name: 'share_page',
      header: 'Please select the format to share?',
      buttons: [
        { title: 'PDF', isAction: 'pdf' },
        { title: 'CSV', isAction: 'csv' },
      ],
    };
    const emptyShareModal = {
      name: 'share_page',
      header: 'There is no run data',
      buttons: [],
      isSoft: true,
    };
    const findRuns = find(devices, 'runs');
    if (findRuns) {
      dispatch(triggerAlert(null, shareModal));
    } else {
      dispatch(triggerAlert(null, emptyShareModal));
    }

    // writeCSV(devices);
  };

  useEffect(() => {
    if (editPage) {
      setTimeout(() => inputRef.current.focus(), 40);
    }
  }, [editPage]);
  const closeModal = () => {
    setState({
      ...state,
      modalOpen: false,
    });
  };

  const handlePageNavigator = (id) => {
    dispatch(changePage(id));
    closeModal();
  };
  const handleRenamePage = () => {
    setState({
      ...state,
      editPage: true,
      modalOpen: false,
    });
  };
  const handleOnFocus = () => {
    setState({
      ...state,
      isEditing: true,
    });
  };
  const handleOnBlur = () => {
    setState({
      ...state,
      isEditing: false,
      editPage: false,
    });
    if (editedName !== null && editedName !== '') {
      dispatch(renamePage(currentPage, editedName));
    }
  };
  const onChange = (e) => {
    setState({
      ...state,
      editedName: e,
    });
  };
  const handlePageOptions = (value) => {
    switch (value) {
      case 'Add Page':
        dispatch(addPage(value));
        closeModal();
        break;
      case 'Delete Page':
        dispatch(triggerAlert(null, modal));
        closeModal();
        break;
      case 'Rename Page':
        handleRenamePage();
        break;
      default:
        closeModal();
        break;
    }
  };
  useEffect(() => {
    const isForwardDisabled = pages.length === 1 || pages.length - 1 === index;
    const isBackwardDisabled = pages.length === 1 || currentPage === 0;
    setState({
      ...state,
      forwardDisable: isForwardDisabled,
      backwardDisable: isBackwardDisabled,
    });
  }, [currentPage, pageName]);

  const openModal = (name, ref, offset) => {
    getMeasure(ref, (x, y, w, h, px, py) => {
      setState({
        ...state,
        left: px + offset.x,
        top: py + offset.y,
        arbitraryTop: py,
        modalOpen: true,
        modalName: name,
        width: w,
      });
    });
  };

  const getModalChild = (name) => {
    switch (name) {
      case 'pageSettings':
        return (
          <PageOptions
            menuItem={ pageOptions }
            handlePageOptions={ handlePageOptions }
          />
        );
      case 'pageNavigator':
        return (
          <PageNavigator
            menuItem={ pages }
            width={ width }
            handlePageNavigator={ handlePageNavigator }
            deletePage={ () => dispatch(triggerAlert(null, modal)) }
            closeMainModal={ closeModal }
          />
        );
      default:
        return null;
    }
  };
  const modalChild = useMemo(() => getModalChild(modalName), [
    modalName,
    currentPage,
  ]);

  const handleArrowClick = (isForward) => {
    isForward
      ? dispatch(changePage(index + 1))
      : dispatch(changePage(index - 1));
  };
  if (display) {
    const pageOptionStyle =
      modalName === 'pageSettings' && modalOpen
        ? {
            ...pageOptionContainer,
            backgroundColor: colors.red,
            borderTopLeftRadius: 10,
          }
        : { ...pageOptionContainer };
    return (
      <>
        {type === 'type1' ? (
          <View style={ headerMain }>
            <View style={ navIcon }>
              <TouchableWithoutFeedback
                onPress={ () => handleMenuClick(true) }
                style={ navIcon }>
                <Icon
                  name="menu-outline"
                  size={ wp(4.5) }
                  color={ colors.black2 }
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={ textContainer }>
              <Text style={ textStyle }>{text}</Text>
            </View>
            <View style={ infoContainer }>
              <Info />
            </View>
            <SideBar menuDisplay={ menuDisplay } />
          </View>
        ) : (
          <View style={ headerMain }>
            <View style={ navIcon }>
              <TouchableWithoutFeedback onPress={ () => handleMenuClick(true) }>
                <Icon name="menu-outline" size={ wp(4.5) } color={ colors.black } />
              </TouchableWithoutFeedback>
            </View>
            <View style={ textContainer2 }>
              <Text style={ textStyle2 }>{text}</Text>
            </View>
            <View style={ pageNavigator }>
              <View style={ backwardArrow }>
                <TouchableWithoutFeedback
                  onPress={ () => !backwardDisable && handleArrowClick(false) }
                  disabled={ backwardDisable }
                  hitSlop={ { top: 10, bottom: 10, left: 10, right: 10 } }>
                  <View style={ { padding: 5 } }>
                    <Icon
                      name="chevron-back"
                      size={ wp(2.5) }
                      color={ backwardDisable ? colors.greyLight : colors.black }
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={ navigatorContainer }>
                <View style={ pageOptionStyle }>
                  <TouchableWithoutFeedback
                    onPress={ () =>
                      openModal('pageSettings', pageSettings.current, {
                        x: -wp(6),
                        y: -hp(2),
                      })
                    }
                    ref={ pageSettings }>
                    <Icon name="apps" size={ wp(2) } color={ colors.grey2 } />
                  </TouchableWithoutFeedback>
                </View>
                <View style={ navigateOptionContainer }>
                  <TouchableWithoutFeedback
                    onPress={ () =>
                      openModal('pageNavigator', navigationRef.current, {
                        x: -100,
                        y: -hp(3),
                      })
                    }
                    ref={ navigationRef }>
                    {editPage ? (
                      <TextInput
                        setRef={ inputRef }
                        style={ pageText }
                        editable={ editPage }
                        handleOnFocus={ () => handleOnFocus() }
                        handleOnBlur={ () => handleOnBlur() }
                        onChangeText={ (e) => onChange(e) }>
                        {pageName}
                      </TextInput>
                    ) : (
                      <Text>{pageName}</Text>
                    )}
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={ forwardArrow }>
                <TouchableWithoutFeedback
                  onPress={ () => !forwardDisable && handleArrowClick(true) }
                  disabled={ forwardDisable }
                  hitSlop={ { top: 10, bottom: 10, left: 10, right: 10 } }>
                  <View style={ { padding: 5 } }>
                    <Icon
                      name="chevron-forward"
                      size={ wp(2.5) }
                      color={ forwardDisable ? colors.greyLight : colors.black }
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={ shareOption }>
              <TouchableWithoutFeedback onPress={ () => handleShare() }>
                <FontAwesome
                  name="share-square-o"
                  size={ fonts[36] }
                  color={ colors.black2 }
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={ infoContainer }>
              <Info />
            </View>
            <SideBar menuDisplay={ menuDisplay } />
            <Modal
              left={ left }
              top={ top }
              modalOpen={ modalOpen }
              onBackdropPress={ closeModal }>
              {modalChild}
            </Modal>
          </View>
        )}
      </>
    );
  }
  return null;
};
export default Header;
