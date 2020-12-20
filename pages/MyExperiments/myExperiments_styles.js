import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  mainHeader: {
    flex: 1.2,
    borderBottomColor: colors.grey2,
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    height: hp(7),
    width: wp(50),
    marginLeft: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.grey2,
  },
  inputContainer: {
    flex: 9,
    justifyContent: 'center',
  },
  textInputStyle: {
    marginLeft: 20,
    padding: 0,
    fontSize: fonts[24],
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: colors.grey2,
    borderBottomWidth: 2,
  },
  body: {
    flex: 7.8,
  },
  leftEmptySpace: {
    flex: 0.2,
  },
  leftEmptySpaceCheckbox: {
    flex: 0.6,
  },
  rightEmptySpace: {
    flex: 1,
    flexDirection: 'row',
  },
  nameContainer: {
    flex: 1.6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  nameContainerCheckbox: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  createdContainer: {
    flex: 1.1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  createdContainerCheckbox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  openedContainer: {
    flex: 1.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  openedContainerCheckbox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  namedContainerCheckbox: {
    flex: 1.4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  arrowContainer: {
    marginLeft: 8,
  },
  textStyle: {
    color: colors.red,
    fontSize: fonts[20],
    fontWeight: 'bold',
  },

  experimentContainer: {
    height: hp(8),
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: colors.grey2,
    borderBottomWidth: 2,
  },
  pencilIconContainer: {
    flex: 0.3,
  },
  unsaveIconContainer: {
    flex: 0.3,
  },
  saveIconContainer: {
    flex: 0.3,
  },
  iconSpaceContainer: {
    flex: 0.1,
  },
  fontStyle: {
    fontSize: fonts[24],
    color: colors.black,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'nowrap',
    height: hp(7),
    width: wp(13),
    color: colors.red,
    fontSize: fonts[20],
    fontWeight: 'bold',
  },
});
export default styles;
