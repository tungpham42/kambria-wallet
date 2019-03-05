import React from 'react';
import PropTypes from 'prop-types';


export const Button = (props) => {
  let customStyle = props.customStyle ? props.customStyle : {};
  let onClickFunc = props.onClick ? props.onClick : null;
  if (props.bgColor) customStyle.backgroundColor = props.bgColor;
  if (props.textColor) customStyle.color = props.textColor;

  return props.disabled ?
    <button className={'btn btn-primary btn-sm'} style={customStyle} onClick={onClickFunc} disabled>
      {props.children}
    </button> :
    <button className={'btn btn-primary btn-sm'} style={customStyle} onClick={onClickFunc}>
      {props.children}
    </button>;
};

Button.propTypes = {
  modalTarget: PropTypes.string,
  customStyle: PropTypes.object,
  textColor: PropTypes.string,
  onClickFunc: PropTypes.func,
  disabled: PropTypes.bool,
  bgColor: PropTypes.string
};