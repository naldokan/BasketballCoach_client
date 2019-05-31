import React from 'react';
import cx from 'classnames';
import './styles.scss'


export default ({ children, className }) => (
  <div className={cx('fancy-box', className)}>
    { children }
  </div>
)