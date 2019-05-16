import React from 'react';

export default ({ score, caption, size }) => (
  <div className='text-center'>
    <div style={{ fontSize: (size * 2) + 'rem' }} className='text-dark'>
      {score}
    </div>
    <div style={{ fontSize: size + 'rem' }} className='text-muted'>
      {caption}
    </div>
  </div>
)