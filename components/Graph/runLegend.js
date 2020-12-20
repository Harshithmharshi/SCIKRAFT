import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from './graph_style';
import Checkbox from '../Checkbox';

const {
  modalTextStyle,
  parameterBody,
  legendElement,
  coloredElement,
  checkboxStyle,
  textView,
  elementView,
  legendView,
} = styles;

const RunLegend = ({ runs, width, handleCheck, runIds }) => {
  return (
    <View style={ { ...parameterBody, width } }>
      <ScrollView
        showsVerticalScrollIndicator={ false }
        contentContainerStyle={ legendView }>
        <View style={ legendElement }>
          <View style={ checkboxStyle }>
            <Checkbox
              handleSelection={ (e) => handleCheck(e, 'All') }
              isSelected={ runs.length === runIds.length }
            />
          </View>
          <View style={ textView }>
            <Text style={ { ...modalTextStyle } }>All</Text>
          </View>
        </View>
        {runs.map((run) => {
          const isSelected =
            runIds.findIndex((ele) => ele.id === run.runId) > -1;
          return (
            <View style={ legendElement } key={ run.runId }>
              <View style={ checkboxStyle }>
                <Checkbox
                  handleSelection={ () => handleCheck(run.color, run.runId) }
                  isSelected={ isSelected }
                  disabled={ isSelected && runIds.length === 1 }
                />
              </View>
              <View style={ elementView }>
                <View
                  style={ { ...coloredElement, backgroundColor: run.color } }
                />
              </View>
              <View style={ textView }>
                <Text style={ { ...modalTextStyle } }>{run.name}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default RunLegend;
