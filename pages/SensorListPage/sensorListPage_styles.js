import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.white,
  },
  settingsHeader: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    flex: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerText: {
    color: colors.black2,
    fontSize: fonts[32],
    marginLeft: wp(2),
  },
  mainContainer: {
    display: 'flex',
    width: wp(55),
    height: hp(67),
  },
  iconContainer: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'flex-end',
  },
  sensorTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  sensorText: {
    fontSize: fonts[26],
    marginTop: hp(10),
    marginLeft: wp(40),
  },
  iconView: {
    marginRight: wp(2),
  },
  buttonContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: wp(4),
    width: wp(16),
    alignSelf: 'center',
    margin: 10,
  },
  headerStyle: {
    display: 'flex',
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: fonts[36],
    marginLeft: 20,
  },
  dropdownContainer: {
    display: 'flex',
    flex: 7,
    paddingTop: 30,
  },
  dropdownStyle: {
    display: 'flex',
    flex: 5,
    alignItems: 'flex-start',
  },
  labelContainer: {
    display: 'flex',
    flex: 4,
    alignItems: 'flex-end',
    marginTop: 15,
  },
  dropdownContent: {
    paddingTop: 20,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  emptyContainer: {
    display: 'flex',
    flex: 1,
  },
  dropdown: { width: wp(20) },
  labelStyle: {
    fontSize: fonts[20],
    color: colors.lightBlack,
  },
  modal: {
    padding: 30,
  },
});

export default styles;
