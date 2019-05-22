import React from 'react';
import { ScaleLoader } from 'react-spinners';

export default ({ score, caption, size }) => (
  <div className='text-center'>
    <div style={{ fontSize: (size * 3) + 'rem' }} className='text-dark'>
      {score || (
        <ScaleLoader
          color={'#78b7ec'}
          loading={true}
        />
      )}
    </div>
    <div style={{ fontSize: size + 'rem' }} className='text-muted'>
      {caption}
    </div>
  </div>
)