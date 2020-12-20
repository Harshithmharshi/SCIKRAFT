import React from 'react';
import { TouchableHighlight, Text } from 'react-native';
import styles from './button_style';
import config from '../../config';

const { fonts } = config;

const Button = ({
  title,
  backgroundColor,
  type,
  fontSize,
  handleClick,
  highlightColor,
  color,
  id,
  disabled,
  ...rest
}) => {
  const { textStyle, buttonStyle } = styles;
  const style =
    type === 'button'
      ? { backgroundColor, ...buttonStyle, elevation: 5 }
      : { ...buttonStyle };
  return (
    <TouchableHighlight
      style={ style }
      disabled={ disabled }
      onPress={ () => handleClick(id) }
      underlayColor={ highlightColor }
      { ...rest }>
      <Text style={ { ...textStyle, fontSize: fonts[fontSize], color } }>
        {title}
      </Text>
    </TouchableHighlight>
  );
};
export default Button;
