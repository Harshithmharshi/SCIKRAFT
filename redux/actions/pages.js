import moment from 'moment';
// eslint-disable-next-line import/no-cycle
import { connectDevice } from './ble';
import {
  storeToLocal,
  getFromLocal,
  removeItem,
  isPopNeeded,
} from '../../utils';
import {
  ADD_PAGE,
  SAVE_TABLE,
  CHANGE_PAGE,
  SET_PAGE_LAYOUT,
  SAVE_PAGE,
  DELETE_PAGE,
  SAVE_GRAPH,
  RENAME_PAGE,
  TRIGGER_ALERT,
  SAVE_EXP,
  DISMISS_MODAL,
  EXP_NAME,
  LOAD_EXP,
  SET_MODAL,
  SAVE_TEXT,
  FORCE_REFRESH_PAGE,
  SAVE_DIGITAL_PARAMETER,
  RENAME_EXP_NAME,
  DELETE_EXP,
} from '../types';

export const savePage = () => {
  return (dispatch) => {
    dispatch({
      type: SAVE_PAGE,
      payload: true,
    });
  };
};

export const addPage = () => {
  return (dispatch, getState) => {
    const {
      page: { count },
    } = getState();
    dispatch(savePage());
    setTimeout(() => {
      dispatch({
        type: ADD_PAGE,
        payload: count + 1,
      });
    }, 500);
  };
};

export const saveTableConfig = ({
  currentPage,
  tableConfig,
  tableIndex,
  runId,
  columns,
}) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_TABLE,
      currentPage,
      tableConfig: {
        colConfig: tableConfig,
        runId,
        columns,
      },
      tableIndex,
    });
  };
};
export const saveGraphConfig = ({
  currentPage,
  graphIndex,
  graphSettings,
  runIds,
  xAxis,
  yAxis,
  updated,
}) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_GRAPH,
      currentPage,
      graphConfig: {
        graphSettings,
        runIds,
        xAxis,
        yAxis,
        updated,
      },
      graphIndex,
    });
  };
};

export const changePage = (currentPageIndex) => {
  return (dispatch) => {
    dispatch(savePage());
    setTimeout(() => {
      dispatch({
        type: CHANGE_PAGE,
        payload: currentPageIndex,
      });
    }, 500);
  };
};

export const setPageLayout = (pageLayout, elementsCount) => {
  return (dispatch, getState) => {
    const {
      page: { pages, currentPage },
    } = getState();
    const tableCount = pages[currentPage].table.length;
    const parameterCount = pages[currentPage].parameter.length;
    const textCount = pages[currentPage].text.length;
    const graphCount = pages[currentPage].graph.length;
    const modifiedElements = isPopNeeded(elementsCount, {
      table: tableCount,
      parameter: parameterCount,
      text: textCount,
      graph: graphCount,
    });
    dispatch({
      type: SET_PAGE_LAYOUT,
      payload: { pageLayout, elementsCount, modifiedElements },
    });
  };
};

export const deletePage = (pageIndex) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_PAGE,
      payload: pageIndex,
    });
  };
};
export const renamePage = (page, pageName) => {
  return (dispatch) => {
    dispatch({
      type: RENAME_PAGE,
      payload: { page, pageName },
    });
  };
};

export const triggerAlert = (nextRoute, modal) => {
  return (dispatch) => {
    dispatch({
      type: TRIGGER_ALERT,
      payload: nextRoute,
      modal,
    });
  };
};

export const saveExperimentLocally = (save) => {
  let allPage;
  let allBle;
  return async (dispatch, getState) => {
    const { page, ble } = getState();
    if (save) {
      const savedPage = await getFromLocal('page');
      const savedBle = await getFromLocal('ble');
      if (savedPage) {
        allPage = savedPage;
        allBle = savedBle;
      } else {
        allPage = [];
        allBle = [];
      }
      if (!page.isLoaded) {
        allPage.push(page);
        allBle.push(ble);
      } else {
        const index = allPage.findIndex((p) => p.uid === page.uid);
        allPage.splice(index, 1, page);
        allBle.splice(index, 1, ble);
      }
      await storeToLocal('page', allPage);
      await storeToLocal('ble', allBle);
    }
    dispatch({
      type: SAVE_EXP,
    });
  };
};

export const dismissModal = () => {
  return (dispatch) => {
    dispatch({
      type: DISMISS_MODAL,
    });
  };
};

export const addExpName = (name) => {
  return (dispatch) => {
    dispatch({
      type: EXP_NAME,
      payload: name,
      uid: moment.now(),
    });
  };
};

export const loadExp = (exp) => {
  return (dispatch) => {
    dispatch({
      type: LOAD_EXP,
      payload: exp,
    });
    exp.ble.devices.forEach((dev) => {
      dispatch(connectDevice(dev.device.id, false));
    });
  };
};

export const setModal = () => {
  return (dispatch) => [
    dispatch({
      type: SET_MODAL,
    }),
  ];
};

export const saveTextEditor = ({ currentPage, textValue, textIndex }) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_TEXT,
      currentPage,
      textValue,
      textIndex,
    });
  };
};

export const deleteExperiment = () => {
  let allPage;
  let allBle;
  return async (dispatch, getState) => {
    const {
      page: { nextRoute },
    } = getState();
    const savedPage = await getFromLocal('page');
    const savedBle = await getFromLocal('ble');
    const pageIndex = savedPage.findIndex((page) => page.uid === nextRoute);
    const bleIndex = savedBle.findIndex((ble) => ble.uid === nextRoute);
    allPage = removeItem(savedPage, pageIndex);
    allBle = removeItem(savedBle, bleIndex);
    await storeToLocal('page', allPage);
    await storeToLocal('ble', allBle);
    dispatch({
      type: FORCE_REFRESH_PAGE,
    });
  };
};

export const renameExpName = (name) => {
  return async (dispatch, getState) => {
    const {
      page: { nextRoute },
    } = getState();
    const savedPage = await getFromLocal('page');
    const ChangeExpName = savedPage.filter((exp) => {
      const id = exp;
      if (id.uid === nextRoute) {
        id.name = name;
      }
      return id;
    });
    await storeToLocal('page', ChangeExpName);
    dispatch({
      type: RENAME_EXP_NAME,
    });
  };
};

export const deleteExp = (deleteId) => {
  return async (dispatch) => {
    const savedPage = await getFromLocal('page');
    const deleteExpId = savedPage.filter((exp) => {
      return !deleteId.includes(exp.uid);
    });
    await storeToLocal('page', deleteExpId);
    dispatch({
      type: DELETE_EXP,
    });
  };
};

export const saveDigitalParameter = ({
  parameterIndex,
  selectedSensor,
  currentPage,
}) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_DIGITAL_PARAMETER,
      parameterIndex,
      payload: { selectedSensor },
      currentPage,
    });
  };
};
