import { StyleSheet } from 'react-native';
import config from '../../config';

const { colors } = config;

const styles = StyleSheet.create({
  textStyle: {
    color: colors.white,
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    height: '100%',
    width: '100%',
  },
});
export default styles;
