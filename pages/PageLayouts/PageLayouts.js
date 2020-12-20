import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Layouts from './Layouts';

const w33h100 = {
  width: '33%',
  height: '100%',
};

const w50h100 = {
  width: '50%',
  height: '100%',
};

const w100h100 = {
  width: '100%',
  height: '100%',
};

const w50h50 = {
  width: '50%',
  height: '50%',
};

// const w50h80 ={
//   width:'50%',
//   height:'20%',
// }

const w100h20 = {
  width: wp(100),
  height: '100%',
};

const PageLayouts = ({ layout, menuDisplay, currentPage }) => {
  const [type1Styles, setType1Styles] = useState({});
  const [type2Styles, setType2Styles] = useState({});
  const tableCount = layout.type1.table;
  const graphCount = layout.type1.graph;
  const textCount = layout.type2.text;
  const parameterCount = layout.type2.parameter;

  const updateType1Style = () => {
    if (graphCount + tableCount === 1 && textCount + parameterCount === 2)
      setType1Styles(w50h100);
    else if (graphCount + tableCount === 2 && textCount + parameterCount === 1)
      setType1Styles(w50h100);
    else if (
      (graphCount === 1 || tableCount === 1) &&
      textCount + parameterCount === 1
    )
      setType1Styles(w50h100);
    else if (
      graphCount === 2 ||
      tableCount === 2 ||
      graphCount + tableCount === 2
    )
      setType1Styles(w50h100);
    else if (graphCount === 1 || tableCount === 1) setType1Styles(w100h100);
  };

  const updateType2Style = () => {
    if (graphCount + tableCount === 1 && textCount + parameterCount === 2)
      setType2Styles(w50h50);
    else if (graphCount + tableCount === 2 && textCount + parameterCount === 1)
      setType2Styles(w100h20);
    else if (
      (graphCount === 1 || tableCount === 1) &&
      textCount + parameterCount === 1
    )
      setType2Styles(w50h100);
    else if (textCount + parameterCount === 3) setType2Styles(w33h100);
    else if (textCount + parameterCount === 4) setType2Styles(w50h50);
    else if (textCount + parameterCount === 1) setType2Styles(w100h100);
    else if (textCount + parameterCount === 2) setType2Styles(w50h100);
  };

  useEffect(() => {
    updateType1Style();
    updateType2Style();
  }, [layout]);

  return (
    <View style={ { flex: 1 } }>
      <Layouts
        counts={ { tableCount, graphCount, textCount, parameterCount } }
        layout={ layout }
        type1={ tableCount + graphCount }
        type2={ textCount + parameterCount }
        type1Styles={ type1Styles }
        type2Styles={ type2Styles }
        menuDisplay={ menuDisplay }
        currentPage={ currentPage }
      />
    </View>
  );
};

export default PageLayouts;

// Core logic
// 1 Type1 - 100%
// 1 Type2 - 100%
// 2 Type2 - 50 % each - vertically split
// 2 Type1 - 50% each - vertically split
// 1 Type2 - 40 % + 1 Type1 - 60 % - vertically split
// 2 Type + 1 Type2 (type vertically split (50 50), type2 and type1 80 20)
// 3 Type2- 33% vertically split
// 4 Type2  - 25% quadrant split
