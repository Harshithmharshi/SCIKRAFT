import React, { useState, useMemo, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Graph, DigitalMeter } from '../../components';
import TextEditor from '../../components/TextEditor/textEditor';
import { setModal } from '../../redux/actions';
import styles from './layout_styles';

const { mainContainer, closeButtonContainer, childContainer } = styles;
const initialState = {
  modalOpen: false,
  modalName: null,
  selectedIndex: -1,
};

const Layouts = ({
  layout,
  type1Styles,
  type2Styles,
  menuDisplay,
  counts,
  currentPage,
}) => {
  const [state, setState] = useState(initialState);
  const { modalName, modalOpen, selectedIndex } = state;
  const { graphCount, tableCount, textCount } = counts;
  const totalCount = graphCount + tableCount + textCount;
  const reduxState = useSelector((currentState) => currentState, shallowEqual);

  const {
    page: { isExpanded },
  } = reduxState;

  const dispatch = useDispatch();
  const closeModal = (close) => {
    if (close) dispatch(setModal());
    setState((prev) => {
      return {
        ...prev,
        modalOpen: false,
        selectedIndex: -1,
        modalName: null,
      };
    });
  };
  const openModal = (name, index) => {
    if (totalCount > 1) {
      dispatch(setModal());
      setState({
        ...state,
        modalOpen: true,
        modalName: name,
        selectedIndex: index,
      });
    }
  };

  useEffect(() => {
    if (!isExpanded && totalCount > 1) {
      closeModal(false);
    }
  }, [isExpanded]);

  const getModalChild = (name) => {
    switch (name) {
      case 'table':
        return (
          <Table
            counts={ counts }
            currentPage={ currentPage }
            number={ selectedIndex }
          />
        );
      default:
        return (
          <Graph
            menuDisplay={ menuDisplay }
            counts={ counts }
            currentPage={ currentPage }
            graphIndex={ selectedIndex }
          />
        );
    }
  };
  const modalChild = useMemo(() => getModalChild(modalName), [modalName]);
  const getTableStyles = () => {
    const element = [];
    let i = 0;

    for (i = 0; i < layout.type1.table; i++) {
      element.push(
        <View style={ type1Styles } key={ i }>
          <Table
            counts={ counts }
            currentPage={ currentPage }
            number={ i }
            handleLongPress={ openModal }
          />
        </View>,
      );
    }

    return element;
  };

  const getGraphStyles = () => {
    const element = [];
    let i = 0;

    for (i = 0; i < layout.type1.graph; i++) {
      element.push(
        <View style={ type1Styles } key={ i }>
          <Graph
            menuDisplay={ menuDisplay }
            counts={ counts }
            currentPage={ currentPage }
            graphIndex={ i }
            handleLongPress={ openModal }
          />
        </View>,
      );
    }

    return element;
  };

  const getTextEditorStyles = () => {
    const element = [];
    let i = 0;

    for (i = 0; i < layout.type2.text; i++) {
      element.push(
        <View style={ type2Styles } key={ i }>
          <TextEditor
            currentPage={ currentPage }
            counts={ counts }
            id={ i }
            menuDisplay={ menuDisplay }
          />
        </View>,
      );
    }

    return element;
  };
  const getDigitalParameterStyles = () => {
    const element = [];
    let i = 0;

    for (i = 0; i < layout.type2.parameter; i++) {
      element.push(
        <View style={ type2Styles } key={ i }>
          <DigitalMeter
            currentPage={ currentPage }
            counts={ counts }
            parameterIndex={ i }
          />
        </View>,
      );
    }

    return element;
  };

  return (
    <View
      style={ {
        flexWrap: 'wrap',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      } }>
      {modalOpen && (
        <View style={ mainContainer }>
          <View style={ closeButtonContainer }>
            <TouchableWithoutFeedback onPress={ () => closeModal(true) }>
              <Icon name="close-circle-outline" size={ 35 } color="red" />
            </TouchableWithoutFeedback>
          </View>
          <View style={ childContainer }>{modalChild}</View>
        </View>
      )}
      {!modalOpen && (
        <>
          {getTableStyles().map((e) => e)}
          {getGraphStyles().map((e) => e)}
          {getTextEditorStyles().map((e) => e)}
          {getDigitalParameterStyles().map((e) => e)}
        </>
      )}
    </View>
  );
};

export default Layouts;
