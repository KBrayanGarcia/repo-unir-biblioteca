import React from 'react';
import { BOOK_STATUS } from '../../types';
import './StatusBadge.css';

const StatusBadge = ({ estado }) => {
  return (
    <span className={`status-badge status-badge--${estado.toLowerCase()}`}>
      {estado === BOOK_STATUS.DISPONIBLE ? 'Disponible' : 'Alquilado'}
    </span>
  );
};

export default StatusBadge;
