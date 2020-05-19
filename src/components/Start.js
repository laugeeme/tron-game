import React from 'react';
import Button from 'components/Button';

function Start({ onClick }) {
  return (
    <div className="play-info">
      {' '}
      <Button onClick={onClick}>Comenzar</Button>
    </div>
  );
}

export default Start;
