import { StyleSheet } from 'react-native';
import config from '../../config';

const { fonts } = config;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  label: {
    marginLeft: 10,
    fontSize: fonts[24],
    marginTop: 1,
  },
});

export default styles;
