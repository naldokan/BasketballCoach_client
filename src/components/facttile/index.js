import React from 'react';
import { ScaleLoader } from 'react-spinners';

export default ({ children, caption, size }) => (
  <div className='text-center'>
    <div style={{ fontSize: (size * 3) + 'rem' }} className='text-dark'>
      {children === undefined ?
        <ScaleLoader color={'#78b7ec'} loading={true} />
        : children}
    </div>
    <div style={{ fontSize: size + 'rem' }} className='text-muted'>
      {caption}
    </div>
  </div>
)