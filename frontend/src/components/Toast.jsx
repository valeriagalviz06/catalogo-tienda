const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center shadow-lg rounded-xl px-4 py-3 border text-sm transition-all duration-300 animate-slide-up bg-white text-slate-800 border-slate-200">
      <div className={`w-2.5 h-2.5 rounded-full mr-3 ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
      <span className="font-medium">{notification.message}</span>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none">
        &times;
      </button>
    </div>
  );
};

export default Toast;
