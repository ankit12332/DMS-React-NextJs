import styles from '../../styles/commonModal.module.css'; // Import the CSS module for the modal

const CommonModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleCloseClick = (e) => {
    if (e.target.id === "modalBackdrop") {
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4 z-50 ${isOpen ? styles.modalEnter : ''}`} onClick={handleCloseClick}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
        <div className="bg-gradient-to-r from-gray-800 to-blue-800 p-4 text-white text-lg font-semibold">
          {title}
          <span onClick={onClose} className="text-white float-right cursor-pointer">✕</span>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CommonModal;