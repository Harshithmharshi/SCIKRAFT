import { StyleSheet } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
import config from '../../config';

const { colors } = config;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginRight: 50,
    flex: 0.6,
  },
  pageContent: {
    display: 'flex',
    flex: 9.4,
  },
});

export default styles;
