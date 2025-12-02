import React, { useState } from 'react';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './RentalButton.css';

const RentalButton = ({ 
  estado, 
  onClick, 
  disabled = false,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonText = estado === 'DISPONIBLE' ? 'Alquilar' : 'Devolver';
  
  const baseClass = disabled ? 'rental-button rental-button--disabled' : 'rental-button';
  const finalClass = `${baseClass} ${className}`.trim();

  const handleClick = () => {
    if (estado === 'ALQUILADO') {
      setIsModalOpen(true);
    } else {
      onClick();
    }
  };

  const handleConfirm = () => {
    onClick();
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={finalClass}
        onClick={handleClick}
        disabled={disabled}
      >
        {buttonText}
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirmar Devolución"
        message="¿Estás seguro de que deseas devolver este libro? Esta acción no se puede deshacer."
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Sí, Devolver"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
};

export default RentalButton;
