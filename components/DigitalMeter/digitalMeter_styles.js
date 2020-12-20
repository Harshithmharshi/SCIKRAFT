import { StyleSheet } from 'react-native';
import config from '../../config';

const { colors } = config;

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sensorItem: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },
  tileContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 10,
  },
  imageContainer: {
    display: 'flex',
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  tileTextContainer: {
    display: 'flex',
    flex: 5,
    alignItems: 'center',
  },
});

export default styles;
