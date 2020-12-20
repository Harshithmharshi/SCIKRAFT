import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 8,
    backgroundColor: colors.red,
  },
  curve: {
    width: '100%',
    height: hp(65),
    backgroundColor: colors.white,
    borderBottomLeftRadius: wp(38),
    borderBottomRightRadius: wp(38),
  },

  logo: {
    display: 'flex',
    flex: 1,
    alignSelf: 'flex-start',
  },
  info: {
    display: 'flex',
    flex: 1,
    alignSelf: 'flex-end',
  },
  footerText: {
    color: colors.white,
    fontSize: fonts[20],
    paddingLeft: wp(5),
    paddingRight: wp(5),
    textAlign: 'center',
    fontWeight: 'normal',
    fontFamily: 'ProximaNova',
  },
  footerLink: {
    color: colors.white,
    fontSize: fonts[20],
    paddingLeft: wp(5),
    paddingRight: wp(5),
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    padding: 10,
    margin: 10,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  tileContainer: {
    height: wp(18),
    width: wp(26),
    margin: 10,
  },
  tileGroup: {
    flex: 1,
    flexDirection: 'row',
  },
  tileGroupContainer: {
    position: 'absolute',
    top: hp(45),
    left: wp(20),
  },
  centerDevice: {
    height: hp(45),
    width: wp(30),
    position: 'absolute',
    top: hp(8),
    left: wp(42),
  },
  leftDevice: {
    height: hp(27),
    width: wp(28),
    position: 'absolute',
    top: hp(26),
    left: wp(18),
  },
  rightDevice: {
    height: hp(40),
    width: wp(13),
    position: 'absolute',
    top: hp(10),
    left: wp(68),
  },
});
export default styles;
