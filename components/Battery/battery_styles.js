import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import config from '../../config';

const { colors, fonts } = config;
const styles = StyleSheet.create({
  parent: {
    width: wp(3.1),
    height: wp(1.5),
    borderRadius: 3.55,
    display: 'flex',
    flexDirection: 'row',
    borderColor: colors.black,
    borderWidth: 1,
    margin: 10,
  },
  text: {
    fontSize: fonts[11],
  },
  iconStyle: {
    paddingLeft: 12,
  },
  textContainer: {
    alignSelf: 'center',
  },
});
export default styles;
