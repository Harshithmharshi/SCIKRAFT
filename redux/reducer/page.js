import moment from 'moment';
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
import { getCurrentPageIndex, removeItem } from '../../utils';

/*
const modal = {
  name: 'save_experiment',
  header: 'Are you sure you want to save?',
  input: {
    display: true,
    id: 'expId',
    placeHolder: 'Experiment Name',
    onChange: 'onExpNameChange',
  },
  buttons: [
    { title: 'Yes', isAction: true },
    { title: 'No', isAction: false },
  ],
};
*/

const initialState = {
  pages: [
    {
      layout: {
        type1: {
          table: 0,
          graph: 0,
        },
        type2: {
          text: 0,
          parameter: 0,
        },
      },
      elementsCount: {
        table: 0,
        graph: 0,
        text: 0,
        parameter: 0,
      },
      table: [
        {
          colConfig: [],
        },
      ],
      graph: [
        {
          graphSettings: {},
          xAxis: '',
          yAxis: '',
          runIds: [],
          updated: false,
        },
      ],
      text: [
        {
          value: '',
        },
      ],
      parameter: [
        {
          selectedSensor: null,
        },
      ],
      name: 'Page 1',
      id: 0,
    },
  ],
  currentPage: 0,
  save: false,
  count: 0,
  modal: {},
  nextRoute: {},
  name: '',
  createdOn: '',
  lastOpened: '',
  uid: '',
  isLoaded: false,
  isExpanded: false,
  refresh: false,
};

export default (state = initialState, action) => {
  const {
    type,
    payload,
    currentPage,
    tableIndex,
    tableConfig,
    graphIndex,
    graphConfig,
    modal,
    uid,
    textValue,
    textIndex,
    parameterIndex,
  } = action;
  let table;
  let graph;
  let updatedPage;
  let pageIndex;
  let removeId;
  let navId;
  let currentPageId;
  let renamePageId;
  let parameter;
  const { pages, currentPage: currentPageState, isExpanded } = { ...state };
  let layout;
  let newPage = {};
  let text = {};
  switch (type) {
    case ADD_PAGE:
      newPage = {
        layout: {
          type1: {
            table: 0,
            graph: 0,
          },
          type2: {
            text: 0,
            parameter: 0,
          },
        },
        elementsCount: {
          table: 0,
          graph: 0,
          text: 0,
          parameter: 0,
        },
        table: [
          {
            colConfig: [],
          },
        ],
        graph: [
          {
            graphSettings: {},
            xAxis: '',
            yAxis: '',
            updated: false,
            runIds: [],
          },
        ],
        text: [
          {
            value: '',
          },
        ],
        parameter: [
          {
            selectedSensor: null,
          },
        ],
        name: `Page ${payload + 1}`,
        id: payload,
      };
      return {
        ...state,
        currentPage: payload,
        pages: state.pages.concat(newPage),
        save: false,
        count: payload,
      };
    case SAVE_TABLE:
      pageIndex = getCurrentPageIndex(pages, currentPage);
      updatedPage = state.pages[pageIndex];
      table = updatedPage.table;
      table[tableIndex] = tableConfig;
      updatedPage = { ...updatedPage, table };
      pages[pageIndex] = updatedPage;
      return {
        ...state,
        pages,
      };
    case SAVE_GRAPH:
      pageIndex = getCurrentPageIndex(pages, currentPage);
      updatedPage = state.pages[pageIndex];
      graph = updatedPage.graph;
      graph[graphIndex] = graphConfig;
      updatedPage = { ...updatedPage, graph };
      pages[pageIndex] = updatedPage;
      return {
        ...state,
        pages,
      };
    case CHANGE_PAGE:
      return {
        ...state,
        currentPage: state.pages[payload].id,
        save: false,
      };
    case SET_PAGE_LAYOUT:
      layout = [...pages];
      currentPageId = layout.findIndex((page) => page.id === currentPageState);
      layout[currentPageId].layout = payload.pageLayout;
      layout[currentPageId].elementsCount = payload.elementsCount;
      for (let i = 0; i < payload.modifiedElements.length; i++) {
        layout[currentPageId][payload.modifiedElements[i]].length =
          payload.elementsCount[payload.modifiedElements[i]];
      }
      return {
        ...state,
        pages: layout,
      };
    case SAVE_PAGE:
      return {
        ...state,
        save: payload,
      };
    case DELETE_PAGE:
      updatedPage = pages;
      removeId = updatedPage.findIndex((page) => page.id === payload);
      // if there is only one page
      navId = updatedPage[0].id;
      if (updatedPage.length === 1) {
        layout = [...pages];
        layout[removeId].layout = {
          type1: {
            table: 0,
            graph: 0,
          },
          type2: {
            text: 0,
            parameter: 0,
          },
        };
      }

      // if deleting first page
      else if (removeId === 0) {
        navId = updatedPage[removeId + 1].id;
        updatedPage = removeItem(updatedPage, removeId);
      }

      // if it is not first page then go to previous page
      else {
        navId = updatedPage[removeId - 1].id;
        updatedPage = removeItem(updatedPage, removeId);
      }

      return {
        ...state,
        pages: updatedPage,
        currentPage: payload === currentPageState ? navId : currentPageState,
      };
    case RENAME_PAGE:
      updatedPage = pages;
      renamePageId = updatedPage.findIndex((page) => page.id === payload.page);
      updatedPage[renamePageId].name = payload.pageName;
      return {
        ...state,
        pages: updatedPage,
      };
    case TRIGGER_ALERT:
      return {
        ...state,
        nextRoute: payload || state.nextRoute,
        modal,
      };
    case SAVE_EXP:
      return {
        ...state,
        ...initialState,
        pages: [
          {
            layout: {
              type1: {
                table: 0,
                graph: 0,
              },
              type2: {
                text: 0,
                parameter: 0,
              },
            },
            elementsCount: {
              table: 0,
              graph: 0,
              text: 0,
              parameter: 0,
            },
            table: [
              {
                colConfig: [],
              },
            ],
            graph: [
              {
                graphSettings: {},
                xAxis: '',
                yAxis: '',
                runIds: [],
                updated: false,
              },
            ],
            text: [
              {
                value: '',
              },
            ],
            parameter: [
              {
                selectedSensor: null,
              },
            ],
            name: 'Page 1',
            id: 0,
          },
        ],
      };
    case DISMISS_MODAL:
      return {
        ...state,
        modal: {},
      };
    case EXP_NAME:
      return {
        ...state,
        name: payload,
        createdOn: state.isLoaded
          ? state.createdOn
          : moment().format('YYYY-MM-DD'),
        lastOpened: moment().format('YYYY-MM-DD'),
        uid,
      };
    case LOAD_EXP: {
      return {
        ...payload.page,
        modal: {},
        isLoaded: true,
      };
    }
    case SET_MODAL:
      return {
        ...state,
        isExpanded: !isExpanded,
      };
    case DELETE_EXP:
      return {
        ...state,
        refresh: !state.refresh,
      };
    case SAVE_TEXT:
      pageIndex = getCurrentPageIndex(pages, currentPage);
      updatedPage = state.pages[pageIndex];
      text = updatedPage.text;
      text[textIndex] = textValue;
      updatedPage = { ...updatedPage, text };
      pages[pageIndex] = updatedPage;
      return {
        ...state,
        pages,
      };
    case FORCE_REFRESH_PAGE:
      return {
        ...state,
        refresh: !state.refresh,
      };
    case RENAME_EXP_NAME:
      return {
        ...state,
        refresh: !state.refresh,
      };

    case SAVE_DIGITAL_PARAMETER:
      pageIndex = getCurrentPageIndex(pages, currentPage);
      updatedPage = state.pages[pageIndex];
      parameter = updatedPage.parameter;
      parameter[parameterIndex] = payload;
      updatedPage = { ...updatedPage, parameter };
      pages[pageIndex] = updatedPage;
      return {
        ...state,
        pages,
      };
    default:
      return state;
  }
};
