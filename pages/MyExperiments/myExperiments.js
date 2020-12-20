import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Font from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { reverse, sortBy } from 'lodash';
import styles from './myExperiments_styles';
import config from '../../config';
import Page from '../../components/Page';
import Checkbox from '../../components/Checkbox';
import { getFromLocal, removeItem } from '../../utils';
import { loadExp, triggerAlert, deleteExp } from '../../redux/actions';

const {
  container,
  mainHeader,
  header,
  body,
  leftEmptySpace,
  nameContainer,
  createdContainer,
  textStyle,
  openedContainer,
  experimentContainer,
  fontStyle,
  arrowContainer,
  textInputContainer,
  inputContainer,
  iconContainer,
  textInputStyle,
  buttonStyle,
  buttonContainer,
  openedContainerCheckbox,
  createdContainerCheckbox,
  nameContainerCheckbox,
  leftEmptySpaceCheckbox,

  // rightEmptySpace,
  // pencilIconContainer,
  // unsaveIconContainer,
  // saveIconContainer,
  // iconSpaceContainer,
  // iconsContainer,
} = styles;

const { colors } = config;

const headerProps = {
  display: true,
  type: 'type1',
  text: 'My Experiments',
};

const initialState = {
  text: '',
  pages: [],
  allPages: [],
  allBle: [],
  searchData: [],
  sortData: [],
  isSort: false,
  arrowChange: '',
  deleteCheckBox: false,
  isSelected: false,
  checkedId: '',
  isChecked: true,
  deleteId: [],
};

const MyExperimentsPage = () => {
  const [state, setState] = useState(initialState);
  const navigation = useNavigation();
  const {
    text,
    pages,
    allBle,
    searchData,
    sortData,
    isSort,
    arrowChange,
    deleteCheckBox,
    deleteId,
  } = state;
  const dispatch = useDispatch();
  const reduxState = useSelector((currentState) => currentState, shallowEqual);
  const {
    page: { refresh },
  } = reduxState;

  useEffect(() => {
    async function getExp() {
      const savedExp = (await getFromLocal('page')) || [];
      const savedBle = (await getFromLocal('ble')) || [];
      setState({
        ...state,
        allPages: savedExp,
        pages: reverse(savedExp),
        allBle: savedBle,
        searchData: savedExp,
        sortData: savedExp,
      });
    }
    getExp();
  }, [refresh]);

  const handleSearch = () => {
    // yet to handle
  };

  // const clearText = () => {
  //   setState({
  //     ...state,
  //     text: '',
  //   });
  // };

  const handleSortExpName = (key) => {
    const sortExp = sortData.sort((a, b) => a.name.localeCompare(b.name));
    const sortExpDate = sortBy(sortData, 'createdOn');
    const sortExpLastDate = sortBy(sortData, 'lastOpened');
    let sortExpData = {};
    if (key === 'ASC') {
      sortExpData = sortExp;
    } else if (key === 'CRE') {
      sortExpData = sortExpDate;
    } else if (key === 'LAST') {
      sortExpData = sortExpLastDate;
    } else {
      sortExpData = sortData;
    }
    setState({
      ...state,
      isSort: !isSort,
      arrowChange: key,
      pages: isSort ? sortExpData : reverse(sortExpData),
    });
  };

  const handleTextChange = (e) => {
    const searchPage = searchData.filter((item) => {
      const expName = item.name.toLowerCase();
      const searchValue = e.toLowerCase();
      return expName.indexOf(searchValue) > -1;
    });
    setState({
      ...state,
      pages: reverse(searchPage),
      text: e,
    });
  };

  const onExperimentClick = (page) => {
    const ble = allBle.filter((b) => page.uid === b.uid)[0];
    dispatch(loadExp({ page, ble }));
    navigation.replace('ExperimentPage');
  };

  const ondeleteClick = () => {
    setState({ ...state, deleteCheckBox: true });
  };

  const deleteExperiment = (uid) => {
    const modal = {
      name: 'delete_exp',
      header: 'Are you sure you want to Delete?',
      buttons: [
        { title: 'Yes', isAction: true },
        { title: 'No', isAction: false },
      ],
    };
    dispatch(triggerAlert(uid, modal));
  };

  const handleRenameExpName = (uid, expName) => {
    const modal = {
      name: 'rename_exp',
      header: 'Edit File Name',
      input: {
        display: true,
        id: 'expId',
        onChange: 'onRenameExpNameChange',
        default: expName,
      },
      buttons: [{ title: 'Yes', isAction: true }],
    };
    dispatch(triggerAlert(uid, modal));
  };

  const onCheckboxChange = (id) => {
    if (!deleteId.includes(id)) {
      setState((prev) => ({
        ...state,
        deleteId: [...prev.deleteId, id],
      }));
    } else {
      const index = deleteId.indexOf(id);
      setState({
        ...state,
        deleteId: removeItem([...deleteId], index),
      });
    }
  };

  const handleSelectAll = () => {
    if (deleteId.length > 1) {
      setState({
        ...state,
        deleteId: [],
      });
    } else {
      setState({
        ...state,
        deleteId: pages.map((id) => id.uid),
      });
    }
  };

  const handleDelete = () => {
    setState({ ...state, deleteId, deleteCheckBox: false });
    dispatch(deleteExp(deleteId));
  };

  const onCloseCheckbox = () => {
    setState({ ...state, deleteCheckBox: false });
  };

  return (
    <Page headerProps={ headerProps }>
      <TouchableWithoutFeedback onPress={ onCloseCheckbox }>
        <View style={ container }>
          <View style={ mainHeader }>
            <View style={ textInputContainer }>
              <View style={ inputContainer }>
                <TextInput
                  style={ textInputStyle }
                  placeholder="Search by name"
                  clearText
                  value={ text }
                  onChangeText={ (e) => handleTextChange(e) }
                />
              </View>
              <View style={ iconContainer }>
                <TouchableWithoutFeedback onPress={ handleSearch }>
                  <Icon
                    name="search-outline"
                    size={ 20 }
                    color={ colors.darkGrey }
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
          <View style={ header }>
            <View style={ leftEmptySpace } />
            {deleteCheckBox ? (
              <>
                <View style={ buttonContainer }>
                  <TouchableWithoutFeedback>
                    <View style={ buttonStyle }>
                      <Button
                        title="Select All"
                        type="button"
                        size={ 20 }
                        onPress={ () => handleSelectAll() }
                      />
                      <Button
                        title="Delete"
                        type="button"
                        size={ 20 }
                        onPress={ () => handleDelete() }
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={ nameContainerCheckbox }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Experiment Name</Text>
                  </TouchableWithoutFeedback>
                  <View style={ arrowContainer }>
                    <TouchableWithoutFeedback
                      onPress={ () => handleSortExpName('ASC') }>
                      {arrowChange === 'ASC' && isSort ? (
                        <Font name="long-arrow-up" size={ 20 } />
                      ) : (
                        <Font name="long-arrow-down" size={ 20 } />
                      )}
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={ createdContainerCheckbox }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Created On</Text>
                  </TouchableWithoutFeedback>
                  <View style={ arrowContainer }>
                    <TouchableWithoutFeedback
                      onPress={ () => handleSortExpName('CRE') }>
                      {arrowChange === 'CRE' && isSort ? (
                        <Font name="long-arrow-up" size={ 20 } />
                      ) : (
                        <Font name="long-arrow-down" size={ 20 } />
                      )}
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={ openedContainerCheckbox }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Last Opened</Text>
                  </TouchableWithoutFeedback>
                  <View style={ arrowContainer }>
                    <TouchableWithoutFeedback
                      onPress={ () => handleSortExpName('LAST') }>
                      {arrowChange === 'LAST' && isSort ? (
                        <Font name="long-arrow-up" size={ 20 } />
                      ) : (
                        <Font name="long-arrow-down" size={ 20 } />
                      )}
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={ openedContainerCheckbox }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Edit</Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={ openedContainer }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Delete</Text>
                  </TouchableWithoutFeedback>
                </View>
              </>
            ) : (
              <>
                <View style={ nameContainer }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Experiment Name</Text>
                  </TouchableWithoutFeedback>
                  <View style={ arrowContainer }>
                    <TouchableWithoutFeedback
                      onPress={ () => handleSortExpName('ASC') }>
                      {arrowChange === 'ASC' && isSort ? (
                        <Font name="long-arrow-up" size={ 20 } />
                      ) : (
                        <Font name="long-arrow-down" size={ 20 } />
                      )}
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={ createdContainer }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Created On</Text>
                  </TouchableWithoutFeedback>
                  <View style={ arrowContainer }>
                    <TouchableWithoutFeedback
                      onPress={ () => handleSortExpName('CRE') }>
                      {arrowChange === 'CRE' && isSort ? (
                        <Font name="long-arrow-up" size={ 20 } />
                      ) : (
                        <Font name="long-arrow-down" size={ 20 } />
                      )}
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={ openedContainer }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Last Opened</Text>
                  </TouchableWithoutFeedback>
                  <View style={ arrowContainer }>
                    <TouchableWithoutFeedback
                      onPress={ () => handleSortExpName('LAST') }>
                      {arrowChange === 'LAST' && isSort ? (
                        <Font name="long-arrow-up" size={ 20 } />
                      ) : (
                        <Font name="long-arrow-down" size={ 20 } />
                      )}
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={ openedContainer }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Edit</Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={ openedContainer }>
                  <TouchableWithoutFeedback>
                    <Text style={ textStyle }>Delete</Text>
                  </TouchableWithoutFeedback>
                </View>
              </>
            )}

            {/* <View style={rightEmptySpace}>
        </View> */}
          </View>
          <View style={ body }>
            <ScrollView>
              {pages.map((page) => {
                if (page.uid)
                  return (
                    <TouchableWithoutFeedback
                      onPress={ () => onExperimentClick(page) }
                      onLongPress={ () => ondeleteClick() }
                      key={ page.uid }>
                      <View style={ experimentContainer } key={ page.uid }>
                        <View style={ leftEmptySpace } />
                        {deleteCheckBox ? (
                          <>
                            <View style={ openedContainerCheckbox }>
                              <View style={ leftEmptySpaceCheckbox } />
                              <Checkbox
                                handleSelection={ () =>
                                  onCheckboxChange(page.uid)
                                }
                                isSelected={ deleteId.includes(page.uid) }
                              />
                            </View>
                            <View style={ nameContainerCheckbox }>
                              <Text style={ fontStyle }>{page.name}</Text>
                            </View>
                            <View style={ createdContainerCheckbox }>
                              <Text style={ fontStyle }>{page.createdOn}</Text>
                            </View>
                            <View style={ openedContainerCheckbox }>
                              <Text style={ fontStyle }>{page.lastOpened}</Text>
                            </View>
                            <View style={ openedContainerCheckbox }>
                              <TouchableWithoutFeedback
                                onPress={ () =>
                                  handleRenameExpName(page.uid, page.name)
                                }>
                                <Icon
                                  name="pencil"
                                  size={ 30 }
                                  color={ colors.blue }
                                />
                              </TouchableWithoutFeedback>
                            </View>
                            <View style={ openedContainer }>
                              <TouchableWithoutFeedback
                                onPress={ () => deleteExperiment(page.uid) }>
                                <Icon
                                  name="trash-bin"
                                  size={ 30 }
                                  color={ colors.black }
                                />
                              </TouchableWithoutFeedback>
                            </View>
                          </>
                        ) : (
                          <>
                            <View style={ nameContainer }>
                              <Text style={ fontStyle }>{page.name}</Text>
                            </View>
                            <View style={ createdContainer }>
                              <Text style={ fontStyle }>{page.createdOn}</Text>
                            </View>
                            <View style={ openedContainer }>
                              <Text style={ fontStyle }>{page.lastOpened}</Text>
                            </View>
                            <View style={ openedContainer }>
                              <TouchableWithoutFeedback
                                onPress={ () =>
                                  handleRenameExpName(page.uid, page.name)
                                }>
                                <Icon
                                  name="pencil"
                                  size={ 30 }
                                  color={ colors.blue }
                                />
                              </TouchableWithoutFeedback>
                            </View>
                            <View style={ openedContainer }>
                              <TouchableWithoutFeedback
                                onPress={ () => deleteExperiment(page.uid) }>
                                <Icon
                                  name="trash-bin"
                                  size={ 30 }
                                  color={ colors.black }
                                />
                              </TouchableWithoutFeedback>
                            </View>
                          </>
                        )}
                        {/* <View style={pencilIconContainer}>
                <Text style={ fontStyle }>Delete</Text>
                  </View> */}
                        {/* <View style={ openedContainer }>
                  <Text style={ fontStyle }>Delete</Text>
                </View> */}
                        {/* <View style={rightEmptySpace}>
                  <View style={pencilIconContainer}>
                  </View>
                  <View style={unsaveIconContainer}>
                  </View>
                  <View style={saveIconContainer}>
                  </View>
                  <View style={iconSpaceContainer}>
                  </View>
              </View> */}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                return null;
              })}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Page>
  );
};
export default MyExperimentsPage;
