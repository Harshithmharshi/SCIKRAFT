import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;
const styles = StyleSheet.create({
  headerMain: {
    backgroundColor: colors.grey,
    height: hp(9.5),
    flexDirection: 'row',
    width: '100%',
    elevation: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  navIcon: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    display: 'flex',
    flex: 1,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: fonts[32],
  },
  textContainer2: {
    display: 'flex',
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textStyle2: {
    fontSize: fonts[26],
  },
  shareOption: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 3.4,
  },
  pageNavigator: {
    display: 'flex',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backwardArrow: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-start',
  },
  forwardArrow: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
  },
  navigatorContainer: {
    display: 'flex',
    flex: 8,
    borderWidth: 1,
    borderColor: colors.grey2,
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: hp(6),
    borderRadius: 5,
  },
  pageOptionContainer: {
    display: 'flex',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  navigateOptionContainer: {
    display: 'flex',
    flex: 8,
    justifyContent: 'center',
  },
  // page options
  container: {
    backgroundColor: colors.red,
    padding: 10,
    width: wp(13),
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  pageText: {
    fontSize: fonts[20],
  },
  menuList: {
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: fonts[18],
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.white,
  },
  // page navigator
  mainContainer: {
    backgroundColor: colors.white,
    width: wp(15),
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    margin: 10,
  },
  navigationText: {
    color: colors.black,
  },
  modalContainer: {
    backgroundColor: colors.red,
    width: wp(15),
    padding: 15,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  modalText: {
    color: colors.white,
    fontSize: fonts[18],
    paddingBottom: 5,
    paddingTop: 5,
  },
  iconContainer: {
    display: 'flex',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigatorStyle: {
    display: 'flex',
    flexDirection: 'row',
    height: hp(6),
  },
  navigateTextContainer: {
    display: 'flex',
    flex: 8,
    justifyContent: 'center',
  },
});

export default styles;
