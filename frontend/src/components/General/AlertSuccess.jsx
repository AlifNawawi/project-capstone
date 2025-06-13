import React, { useEffect, useState } from 'react';

const AlertSuccess = ({
  message,
  autoDismiss = false,
  duration = 5000,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-sm relative">
      {message}
      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        className="absolute top-1 right-2 text-green-500 hover:text-green-700 font-bold"
      >
        ×
      </button>
    </div>
  );
};

export default AlertSuccess;
