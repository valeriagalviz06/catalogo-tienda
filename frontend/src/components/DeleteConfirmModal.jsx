import { IconTrash } from './icons';

const DeleteConfirmModal = ({ isOpen, product, onClose, onConfirm }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-scale-in">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconTrash />
        </div>
        <h3 className="text-base font-bold text-slate-900">Eliminar producto</h3>
        <p className="text-sm text-slate-600 mt-2">
          ¿Seguro que quieres eliminar <strong className="text-slate-900">"{product.name}"</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="mt-6 flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm shadow-rose-200 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
