import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;
const styles = StyleSheet.create({
  tileStyle: {
    display: 'flex',
    height: wp(15),
    width: wp(28),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 1.5,
    margin: 25,
    backgroundColor: colors.white,
    borderRadius: 9,
    borderColor: colors.grey,
    borderWidth: 4,
  },
  batteryContainer: {
    display: 'flex',
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    display: 'flex',
    flex: 6,
    flexDirection: 'row',
    padding: 5,
  },
  tileFooter: {
    display: 'flex',
    flex: 3,
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
  },
  iconStyle: {
    display: 'flex',
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  textContainer: {
    display: 'flex',
    flex: 5.5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  sensorStyle: {
    flex: 5,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: fonts[22],
    marginBottom: 10,
  },
  toggleContainer: {
    display: 'flex',
    flex: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconsStyle: {
    display: 'flex',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  icons: {
    display: 'flex',
    flex: 6,
  },
  imageStyle: {
    height: wp(2),
  },
});

export default styles;
