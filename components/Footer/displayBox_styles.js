import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;

const styles = StyleSheet.create({
  parent: {
    display: 'flex',
    height: hp(12.85),
    width: wp(17.5),
    padding: 5,
    margin: 5,
    borderRadius: 7,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.grey,
    shadowColor: colors.black,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flex: 4,
    flexDirection: 'row',
  },
  nameContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeStyle: {
    fontSize: fonts[20],
    color: colors.black,
  },
  body: {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: colors.black,
    fontSize: fonts[20],
  },
  iconStyle: {
    height: hp(7),
  },
  messageStyle: {
    marginTop: hp(3),
    textAlign: 'center',
  },
});
export default styles;
