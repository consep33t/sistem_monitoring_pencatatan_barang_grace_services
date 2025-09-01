"use client";
import React from "react";

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg">Konfirmasi</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn rounded btn-error" onClick={onConfirm}>
            Ya
          </button>
          <button className="btn rounded" onClick={onCancel}>
            Tidak
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmModal;
