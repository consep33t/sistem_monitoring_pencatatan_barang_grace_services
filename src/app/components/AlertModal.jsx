"use client";

const AlertModal = ({ show, type = "success", message = "", onClose }) => {
  if (!show) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/50 absolute inset-0" onClick={onClose}></div>
      <div
        className={`p-4 rounded shadow-lg text-white ${bgColor} z-10 max-w-sm w-full`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button className="ml-4 font-bold text-xl" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
