import React from 'react';
import { ScaleLoader } from 'react-spinners';
import './styles.scss';

export default ({ children, caption, size, titleFontSize, contentFontSize }) => {
  return (
    <div className='text-center fact-tile'>
      <div style={{ fontSize: (contentFontSize || (size * 3)) + 'rem' }}>
        {children === undefined ?
          <ScaleLoader color={'#78b7ec'} loading={true} />
          : children}
      </div>
      <div style={{ fontSize: (titleFontSize || size) + 'rem' }} className='title'>
        {caption}
      </div>
    </div>
  )
}