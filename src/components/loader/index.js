import React from 'react';
import { BeatLoader } from 'react-spinners';
import cx from 'classnames';
import './styles.scss';

export default ({ loading, bottom }) => (
  <div className={cx('loader', { bottom, loading })}>
    <BeatLoader
      sizeUnit={"px"}
      size={15}
      color={'#78b7ec'}
      loading={loading}
    />
  </div>
)