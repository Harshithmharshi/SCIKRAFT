import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;
const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    height: hp(6),
  },
  pickerStyle: {
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
  },
  itemStyle: {
    height: hp(5),
    justifyContent: 'flex-start',
    marginLeft: wp(0.5),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  labelStyle: {
    textAlign: 'center',
    color: colors.black,
    fontSize: fonts[20],
  },
});

export default styles;
