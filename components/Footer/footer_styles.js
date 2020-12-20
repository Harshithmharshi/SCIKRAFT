import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;

const styles = StyleSheet.create({
  footerStyle: {
    backgroundColor: colors.red,
    width: '100%',
    height: hp(8),
    flexDirection: 'row',
  },
  title: {
    flex: 1,
  },
  timerStyle: {
    height: '100%',
    paddingLeft: hp(1),
    paddingRight: hp(1),
    paddingTop: hp(1),
  },
  iconContainer: {
    flexDirection: 'row',
    height: '100%',
    alignSelf: 'flex-end',
  },
  alignIcon: {
    alignSelf: 'flex-end',
    paddingRight: hp(2),
    flex: 1,
  },
  sensor: {
    maxHeight: hp(6.5),
    paddingLeft: 5,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  displayGroup: {
    flex: 1,
  },
  displayGroupContainer: {
    position: 'absolute',
  },
  settingsContainer: {
    display: 'flex',
    flex: 1,
  },
  settingsBody: {
    paddingLeft: 20,
  },
  settingsHeader: {
    display: 'flex',
    flex: 4,
    flexDirection: 'row',
    marginBottom: 30,
  },
  headerStyle: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  closeIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerText: {
    color: colors.black2,
    fontSize: fonts[32],
  },
  iconView: {
    marginRight: 20,
  },
  settingsContent: {
    display: 'flex',
    flex: 8,
    flexDirection: 'row',
  },
  itemContainer: {
    display: 'flex',
    flex: 2,
    marginRight: 5,
  },
  itemTextStyle: {
    color: '#201f1f',
    fontSize: fonts[24],
    marginLeft: 2,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  textContainer: {
    display: 'flex',
    flex: 0.25,
    alignSelf: 'center',
    height: hp(5.55),
  },
  textInputstyle: {
    padding: 0,
    textAlign: 'center',
    borderBottomLeftRadius: wp(0.6),
    borderTopLeftRadius: wp(0.6),
    backgroundColor: colors.white,
    height: hp(5.55),
  },
  dropdownContainer: {
    display: 'flex',
    flex: 0.5,
  },
  buttonStyle: {
    marginRight: 10,
    height: hp(6),
    width: wp(13),
  },

  modalOptionContainer: {
    height: hp(46.8),
    width: wp(25.2),
  },
  bodyStyle: {
    flexDirection: 'row',
  },

  textStyle: {
    fontSize: fonts[24],
    color: colors.blue,
  },
  modalView: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  header: {
    flex: 1.5,
    justifyContent: 'center',
    paddingLeft: 22,
  },
  body: {
    flex: 6,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 22,
  },
  liveSensorContainer: {
    justifyContent: 'flex-end',
  },
  footer: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    paddingLeft: 22,
  },
  bodyText: {
    fontSize: fonts[24],
    paddingTop: 22,
    width: '100%',
  },
  iconStyle: {
    color: colors.blue,
    paddingTop: 23,
    paddingRight: 20,
    paddingLeft: 4,
  },
  checkBoxContainer: {
    paddingTop: 15,
    paddingLeft: 4,
  },
  line: {
    borderBottomColor: colors.greyDark,
    borderBottomWidth: 4,
  },
  containerStyle: {
    minHeight: 150,
  },
  recordButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: hp(6),
    maxWidth: wp(12),
    marginLeft: 10,
    borderRadius: 7,
  },
  recordPlacement: {
    justifyContent: 'center',
  },
  footerButtonStyle: {
    height: wp(4.5),
    width: wp(14),
    paddingTop: 10,
  },
  settingsText: {
    height: hp(4),
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  checkboxStyle: {
    display: 'flex',
    flex: 1.5,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  labelTextStyle: {
    fontSize: fonts[24],
    alignItems: 'flex-start',
    display: 'flex',
    flex: 8.5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalScroll: {
    width: '100%',
  },
});
export default styles;
