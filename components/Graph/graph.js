/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  createContainer,
  VictoryAxis,
  // VictoryTooltip,
  VictoryZoomContainer,
} from 'victory-native';
import { inv, matrix, multiply } from 'mathjs';
import Svg from 'react-native-svg';
import { get, throttle, defaultTo, isEmpty, last } from 'lodash';
import {
  getAllConnectedDevices,
  getDataById,
  getMeasure,
  getAllRunDetails,
  removeItem,
  getCurrentPageById,
  getSensorNameById,
} from '../../utils';
import Button from '../Button';
import Modal from '../Modal';
import AxisSelector from './axisSelector';
import styles from './graph_style';
import RunLegend from './runLegend';
import Tools from './tool';
import GraphSettings from './graphSettings';
import SlopeInfo from './slopeInfoModal';
import ZoomSettings from './zoomSettings';
import config from '../../config';
import { saveGraphConfig } from '../../redux/actions';

const { colors } = config;

const {
  legend,
  yAxisStyle,
  xAxisStyle,
  container,
  buttonContainer,
  legendContainer,
  graphContainer,
  xAxisContainer,
  // tooltipStyles,
} = styles;

let { yAxisContainer, toolsContainer } = styles;

const initialState = {
  startPoint: {},
  endPoint: {},
  data2: [],
  slope: null,
  incident: null,
  zoomDomain: null,
  mode: 1,
  reset: false,
  runIds: [{ id: -1, color: 'black' }],
  data1: [[{ x: 1, y: 1 }]],
  left: 0,
  top: 0,
  arbitraryTop: 0,
  modalOpen: false,
  modalName: null,
  modalWidth: 0,
  yAxis: '',
  xAxis: 'time',
  zoomDimension: 'xy',
  x1: '',
  y1: '',
  x2: '',
  y2: '',
  viewDataPoints: true,
  disabledTools: [false, false, false, false, false, false],
  graphHeight: 0,
  graphWidth: 0,
};
const zoomSettings = [
  { title: 'XY', id: 'xy' },
  { title: 'X only', id: 'x' },
  { title: 'Y only', id: 'y' },
];

const VictoryGraphTooltip = ({
  menuDisplay,
  currentPage,
  graphIndex,
  counts,
  handleLongPress,
}) => {
  const [state, setState] = useState(initialState);
  const reduxState = useSelector((currentState) => currentState, shallowEqual);
  const legendRef = useRef();
  const yAxisRef = useRef();
  const xAxisRef = useRef();
  const optRefs = useRef([]);
  const dispatch = useDispatch();
  const {
    ble: { isReceiving, runNumber, update },
    page: { pages, save },
  } = reduxState;
  const { graph } = getCurrentPageById(pages, currentPage);
  const connectedSensors = getAllConnectedDevices(reduxState);
  const runData = getAllRunDetails(connectedSensors);
  const sensors = connectedSensors.map((sensor) => {
    return {
      name: get(sensor, 'device.name', ''),
      id: get(sensor, 'device.id', ''),
      sUnit: get(sensor, 'unit', null),
      sParameter: get(sensor, 'parameter', null),
    };
  });
  const {
    endPoint,
    startPoint,
    slope,
    data2,
    // incident,
    mode,
    reset,
    zoomDomain,
    runIds,
    data1,
    left,
    top,
    modalOpen,
    modalName,
    yAxis,
    xAxis,
    modalWidth,
    zoomDimension,
    x1,
    y1,
    x2,
    y2,
    viewDataPoints,
    disabledTools,
    graphHeight,
    graphWidth,
  } = state;
  let xMin;
  let xMax;

  const getCurrentRunData = ({ x, y }) => {
    if (!x || !y) {
      return [[]];
    }
    const param = isReceiving ? 'graphData' : 'data';
    return runIds.map(({ id }) => {
      const yData =
        get(getDataById(reduxState, y)[0], 'type', '') === 'manual'
          ? get(getDataById(reduxState, y)[0], `runs[1]${[param]}`, [])
          : get(getDataById(reduxState, y)[0], `runs[${id}]${[param]}`, []);
      let xData = [];
      if (x === 'time') {
        xData = get(getDataById(reduxState, y)[0], `runs[${id}]${[param]}`, []);
        const graphData = xData.map((value, index) => {
          return {
            x: value && parseInt(value.time, 10),
            y: yData[index] ? defaultTo(get(yData[index], 'payload', 0), 0) : 0,
          };
        });
        return graphData;
      }
      xData =
        get(getDataById(reduxState, x)[0], 'type', '') === 'manual'
          ? get(getDataById(reduxState, x)[0], `runs[1]${[param]}`, [])
          : get(getDataById(reduxState, x)[0], `runs[${id}]${[param]}`, []);
      return xData.map((xVal, index) => {
        return {
          x: xVal.payload,
          y: yData[index] ? defaultTo(get(yData[index], 'payload', 0), 0) : 0,
        };
      });
    });
  };
  const onPageFocus = () => {
    if (connectedSensors.length) {
      const firstSensor = connectedSensors[0];
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          yAxis: firstSensor.device.id,
        }));
      }, 100);
    }
  };
  useEffect(() => {
    if (graph[graphIndex] && get(graph[graphIndex], 'runIds', []).length > 0) {
      const {
        graphSettings: { showDataPoints },
        runIds,
        xAxis,
        yAxis,
      } = graph[graphIndex];
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          xAxis,
          yAxis,
          runIds,
          viewDataPoints: showDataPoints,
        }));
      }, 100);
    } else {
      onPageFocus();
    }
  }, [currentPage]);

  useEffect(() => {
    if (!isReceiving && xAxis) {
      dispatch(
        saveGraphConfig({
          currentPage,
          graphIndex,
          graphSettings: { showDataPoints: viewDataPoints },
          runIds,
          xAxis,
          yAxis,
        }),
      );
    }
  }, [save, xAxis, yAxis, viewDataPoints, runIds]);

  // triggers whenever data is receiving, xAxis, yAxis is updated
  useEffect(() => {
    if (yAxis && xAxis) {
      setState((pre) => ({
        ...pre,
        data1: getCurrentRunData({ x: xAxis, y: yAxis }),
      }));
    }
  }, [update, isReceiving, yAxis, xAxis]);

  const rescale = () => {
    setState({
      ...state,
      reset: true,
      zoomDomain: null,
    });
  };

  useEffect(() => {
    rescale();
    setState((pre) => ({
      ...pre,
      data1: getCurrentRunData({ x: xAxis, y: yAxis }),
    }));
  }, [runIds.length]);

  // updates the run number
  useEffect(() => {
    if (runNumber > 0) {
      setState((prev) => ({ ...prev, zoomDomain: null }));
    }
    setState((prev) => {
      return {
        ...prev,
        runIds: [{ id: runNumber, color: get(last(runData), 'color', 'red') }],
        startPoint: {},
        endPoint: {},
        data2: [],
        slope: null,
        incident: null,
        x1: '',
        y1: '',
        x2: '',
        y2: '',
      };
    });
  }, [runNumber, runData.length]);

  useEffect(() => {
    if (reset) {
      setState((prev) => {
        return {
          ...prev,
          reset: false,
          zoomDomain: null,
        };
      });
    }
  }, [reset]);

  const calculateSlope = (fit) => {
    const { endPoint, startPoint } = state;
    if (isEmpty(endPoint) || isEmpty(startPoint)) return;
    const filterData = data1[0].filter(
      ({ x }) => x >= startPoint.x && x <= endPoint.x,
    );
    const X = [];
    filterData.map(({ x }) => X.push(x));
    const Y = [];
    filterData.map(({ y }) => Y.push(y));
    const X2 = X.map((ele) => ele * ele);
    const xy = X.map((val, index) => val * Y[index]);
    const sumX = X.reduce((acc, val) => acc + val);
    const sumY = Y.reduce((acc, val) => acc + val);
    const sumXY = xy.reduce((acc, val) => acc + val);
    const sumX2 = X2.reduce((acc, val) => {
      return acc + val;
    });
    const matA = matrix([
      [sumX2, sumX],
      [sumX, X2.length],
    ]);
    const invA = inv(matA);
    const matB = matrix([[sumXY], [sumY]]);
    let [newSlope, newIncident] = multiply(invA, matB).toArray();
    newIncident = Math.round(newIncident * 100) / 100;
    newSlope = Math.round(newSlope * 100) / 100;
    const data = X.map(
      (val) => Math.round((newSlope * val + newIncident) * 100) / 100,
    );
    const calculatedData = [];
    if (fit) {
      X.map((xVal, index) =>
        calculatedData.push({ x: xVal, y: data[index], hideDot: true }),
      );
    }
    setState({
      ...state,
      incident: newIncident,
      slope: newSlope,
      curveFitting: data,
      data2: calculatedData,
      isSelecting: false,
      modalName: 'Calculate slope',
      modalOpen: true,
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y,
      left: wp(30),
      top: hp(30),
    });
  };
  const changeMode = () => {
    setState({
      ...state,
      mode: mode === 2 ? 1 : 2,
    });
  };
  const handleSelectPoint = (points) => {
    const selectedPoints = points[1].data;
    setState({
      ...state,
      startPoint: selectedPoints[0],
      endPoint: last(selectedPoints),
      data2: [],
      slope: null,
      incident: null,
      x1: null,
      y1: null,
      x2: null,
      y2: null,
    });
  };
  let NewContainer;
  switch (mode) {
    case 1:
      NewContainer = VictoryZoomContainer;
      break;
    case 2:
      NewContainer = createContainer('zoom', 'selection');
      break;
    default:
      break;
  }
  const handleZoom = (domain) => {
    setState({
      ...state,
      zoomDomain: domain,
    });
  };
  const throttledZoom = throttle(handleZoom, 1000);
  const yMin = data1 && Math.min(...data1[0].map((value) => value.y)) - 2;
  const yMax = data1 && Math.max(...data1[0].map((value) => value.y)) + 2;
  if (!isReceiving && data1) {
    xMin = Math.min(...data1[0].map((value) => value.x)) - 2;
    xMax = Math.max(...data1[0].map((value) => value.x)) + 2;
  }
  const points = zoomDomain
    ? data1 &&
      data1[0].filter((point) => {
        return (
          point.x >= zoomDomain.x[0] &&
          point.x <= zoomDomain.x[1] &&
          point.y >= zoomDomain.y[0] &&
          point.y <= zoomDomain.y[1]
        );
      })
    : data1 && data1[0];

  const openModal = (ref, offset, name) => {
    getMeasure(ref, (x, y, w, h, px, py) => {
      setState({
        ...state,
        left: px + offset.x,
        top: py + offset.y,
        arbitraryTop: py,
        modalOpen: true,
        modalName: name,
        modalWidth: w,
      });
    });
  };

  const onBackdropPress = () => {
    setState({
      ...state,
      modalOpen: false,
    });
  };

  const handleAxisSelect = (id, name) => {
    return name === 'xAxis'
      ? setState({
          ...state,
          [name]: id,
          modalOpen: false,
        })
      : setState({
          ...state,
          [name]: id,
          modalOpen: false,
        });
  };

  const handleTool = (toolId) => {
    switch (toolId) {
      case 2:
        rescale();
        break;
      case 3:
        changeMode();
        break;
      case 4:
        calculateSlope(true);
        break;
      case 5:
        calculateSlope(false);
        break;
      default:
        break;
    }
  };
  const handleMultiRuns = (color, id) => {
    let runs = [...runIds];
    const index = runs.findIndex((run) => run.id === id);
    if (id === 'All') {
      runs = color
        ? runData.map((ele) => {
            return { id: ele.runId, color: ele.color };
          })
        : [{ id: -1, color: 'black' }];
    } else if (index > -1 && runs.length > 1) {
      removeItem(runs, index);
    } else {
      const dummyIndex = runs.findIndex((run) => run.id === -1);
      if (dummyIndex > -1) {
        removeItem(runs, dummyIndex);
      }
      runs.push({ color, id });
    }
    setState({
      ...state,
      runIds: [...runs],
      startPoint: {},
      endPoint: {},
      data2: [],
      slope: null,
      incident: null,
      zoomDomain: null,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      modalOpen: true,
    });
  };

  const handleZoomAxis = (id) => {
    setState((prev) => ({
      ...prev,
      zoomDimension: id,
      modalOpen: false,
    }));
  };
  const handleGraphSettings = () => {
    setState((prev) => ({
      ...prev,
      viewDataPoints: !viewDataPoints,
      modalOpen: false,
    }));
  };

  const getModalChild = (name) => {
    switch (name) {
      case 'legend':
        return (
          <RunLegend
            runs={ runData }
            width={ modalWidth }
            handleCheck={ handleMultiRuns }
            runIds={ runIds }
          />
        );
      case 'yAxis':
        return (
          <AxisSelector
            sensors={ sensors }
            name={ name }
            selected={ yAxis }
            handleAxisSelect={ handleAxisSelect }
          />
        );
      case 'xAxis':
        return (
          <AxisSelector
            sensors={ sensors }
            name={ name }
            handleAxisSelect={ handleAxisSelect }
            selected={ xAxis }
          />
        );
      case 'Graph Settings':
        return (
          <GraphSettings
            handleCheckBox={ handleGraphSettings }
            isSelected={ viewDataPoints }
          />
        );
      case 'Zoom Setting':
        return (
          <ZoomSettings
            options={ zoomSettings }
            handleClick={ handleZoomAxis }
            selectedValue={ zoomDimension }
          />
        );
      case 'Calculate slope':
        return <SlopeInfo x1={ x1 } y1={ y1 } x2={ x2 } y2={ y2 } slope={ slope } />;
      default:
        return <Text>jdfksd</Text>;
    }
  };

  const modalChild = useMemo(() => getModalChild(modalName), [
    modalName,
    runData.length,
    yAxis,
    xAxis,
    runIds,
    viewDataPoints,
    zoomDimension,
    slope,
    connectedSensors.length,
  ]);
  const getGraphLayout = (event) => {
    const { layout } = event.nativeEvent;
    setState({
      ...state,
      graphHeight: layout.height,
      graphWidth: layout.width,
    });
  };
  const zoom = zoomDomain !== 'xy' ? { zoomDomain } : {};

  const { graphCount, tableCount, textCount, parameterCount } = counts;
  if (graphCount === 1 && tableCount + textCount + parameterCount === 1) {
    yAxisContainer = { ...yAxisContainer, flex: 0.9 };
    toolsContainer = { ...toolsContainer, flex: 2 };
  } else if (
    graphCount === 2 &&
    tableCount + textCount + parameterCount === 0
  ) {
    yAxisContainer = { ...yAxisContainer, flex: 0.8 };
    toolsContainer = { ...toolsContainer, flex: 1.8 };
  } else if (
    graphCount === 1 &&
    tableCount + textCount + parameterCount === 0
  ) {
    yAxisContainer = { ...yAxisContainer, flex: 0.4 };
    toolsContainer = { ...toolsContainer, flex: 1 };
  } else if (
    graphCount === 1 &&
    tableCount === 1 &&
    (textCount === 1 || parameterCount === 1)
  ) {
    toolsContainer = { ...toolsContainer, flex: 2.9 };
  } else if (graphCount === 1 && textCount + parameterCount === 2) {
    yAxisContainer = { ...yAxisContainer, flex: 0.9 };
    toolsContainer = { ...toolsContainer, flex: 2 };
  }

  // Toggling of curvefit and slope calculation
  useEffect(() => {
    let disabled;
    if (runIds.length > 1) {
      disabled = [false, false, true, true, true, false];
    } else if ((isEmpty(endPoint) || isEmpty(startPoint)) && slope === null) {
      disabled = [false, false, false, true, true, false];
    } else if (slope === null) {
      disabled = [false, false, false, true, false, false];
    } else {
      disabled = [false, false, false, false, false, false];
    }
    setState((prev) => ({
      ...prev,
      disabledTools: disabled,
    }));
  }, [endPoint, startPoint, slope, runIds.length]);

  return (
    <>
      <TouchableWithoutFeedback
        onLongPress={ () => handleLongPress('graph', graphIndex) }
        style={ { width: '100%', height: '100%' } }>
        <View pointerEvents={ menuDisplay ? 'none' : 'auto' } style={ container }>
          <View style={ yAxisContainer }>
            <View style={ yAxisStyle } ref={ yAxisRef }>
              <Button
                title="Y-AXIS"
                backgroundColor={ colors.grey }
                type="button"
                handleClick={ () =>
                  openModal(yAxisRef.current, { x: -20, y: -44.5 }, 'yAxis')
                }
                highlightColor={ colors.grey2 }
              />
            </View>
            {yAxis !== '' && (
              <View>
                <Text
                  style={ {
                    marginTop: hp(20),
                    transform: [{ rotate: '-90deg' }],
                    width: 200,
                  } }>
                  {getSensorNameById(yAxis, connectedSensors)}
                </Text>
              </View>
            )}
          </View>
          <View style={ buttonContainer }>
            <View style={ legendContainer }>
              <View ref={ legendRef } style={ legend }>
                <Button
                  title="Run Legend >"
                  backgroundColor={ colors.grey }
                  type="button"
                  handleClick={ () =>
                    openModal(legendRef.current, { x: -65, y: -19 }, 'legend')
                  }
                  highlightColor={ colors.grey2 }
                />
              </View>
            </View>
            <View
              style={ graphContainer }
              onLayout={ (event) => {
                getGraphLayout(event);
              } }>
              <View>
                {data1 && data1[0].length === 0 && (
                  <VictoryChart
                    scale={ { x: 'linear', y: 'linear' } }
                    width={ graphWidth }
                    height={ graphHeight }>
                    <VictoryAxis tickValues={ [0, 1, 2, 3, 4, 5] } />
                    <VictoryAxis
                      dependentAxis
                      tickValues={ [0, 1, 2, 3, 4, 5] }
                      maxDomain={ { x: 3 } }
                    />
                  </VictoryChart>
                )}
                {data1.every((data) => data.length > 0) && (
                  <VictoryChart
                    width={ graphWidth }
                    height={ graphHeight }
                    scale={ { x: 'linear', y: 'linear' } }
                    containerComponent={
                      reset ? (
                        <Svg />
                      ) : (
                        <NewContainer
                          responsive={ false }
                          { ...zoom }
                          zoomDimension={ zoomDimension }
                          onZoomDomainChange={ throttledZoom }
                          allowPan={ mode !== 2 }
                          selectionStyle={ {
                            fill: 'tomato',
                            fillOpacity: 0.5,
                            stroke: 'tomato',
                            strokeWidth: 2,
                          } }
                          onSelection={ (points) => handleSelectPoint(points) }
                          // labelComponent={
                          //   <VictoryTooltip
                          //     cornerRadius={ 0 }
                          //     style={ tooltipStyles }
                          //     flyoutHeight={ 40 }
                          //   />
                          // }
                          // labels={ ({ datum }) => `x : ${datum.x}, y : ${datum.y}` }
                          // voronoiBlacklist={ ['line1', 'line2'] }
                        />
                      )
                    }>
                    <VictoryAxis
                      dependentAxis
                      domain={ [yMin, yMax] }
                      style={ {
                        grid: { stroke: 'grey', strokeWidth: 0.1 },
                      } }
                    />
                    <VictoryAxis
                      dependentAxis={ false }
                      fixLabelOverlap
                      style={ {
                        grid: { stroke: 'grey', strokeWidth: 0.2 },
                      } }
                      domain={ !isReceiving && [xMin, xMax] }
                      tickCount={ 10 }
                      tickFormat={ (num) => num.toFixed(2) }
                    />
                    {data1.map((data, index) => (
                      <VictoryLine
                        style={ {
                          data: {
                            stroke: get(runIds[index], 'color', 'red'),
                          },
                        } }
                        key={ get(runIds[index], 'id', 'red') }
                        data={ data }
                        name="line1"
                      />
                    ))}

                    <VictoryLine
                      style={ {
                        data: { stroke: 'green' },
                      } }
                      data={ data2 }
                      name="line2"
                    />
                    {((points.length <= 10 && viewDataPoints) || mode === 2) &&
                      runIds.length === 1 && (
                        <VictoryScatter
                          style={ {
                            data: {
                              fill: ({ active, datum }) => {
                                const val =
                                  startPoint.x <= datum.x &&
                                  datum.x <= endPoint.x;
                                return active || val ? 'red' : 'blue';
                              },
                            },
                          } }
                          size={ 7 }
                          data={ points }
                        />
                      )}
                  </VictoryChart>
                )}
              </View>
              {xAxis && (
                <View>
                  <Text style={ { marginTop: -10, alignSelf: 'center' } }>
                    {getSensorNameById(xAxis, connectedSensors)}
                  </Text>
                </View>
              )}
            </View>
            <View style={ xAxisContainer }>
              <View style={ xAxisStyle } ref={ xAxisRef }>
                <Button
                  title="X-AXIS"
                  backgroundColor={ colors.grey }
                  type="button"
                  handleClick={ () =>
                    openModal(
                      xAxisRef.current,
                      { x: -300, y: -180 - sensors.length * 20 },
                      'xAxis',
                    )
                  }
                  highlightColor={ colors.grey2 }
                />
              </View>
              <Modal
                left={ left }
                top={ top }
                modalOpen={ modalOpen }
                onBackdropPress={ () => onBackdropPress() }>
                {modalChild}
              </Modal>
            </View>
          </View>
          <View style={ toolsContainer }>
            <Tools
              openToolModal={ openModal }
              optRefs={ optRefs }
              handleToolSelect={ handleTool }
              mode={ mode }
              disabledTools={ disabledTools }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default VictoryGraphTooltip;
