import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  mainContainer: {
    width: wp(95),
    display: 'flex',
    flex: 1,
  },
  closeButtonContainer: {
    display: 'flex',
    flex: 0.5,
    alignItems: 'flex-end',
    marginRight: 30,
  },
  childContainer: {
    display: 'flex',
    flex: 9.5,
  },
});

export default styles;
