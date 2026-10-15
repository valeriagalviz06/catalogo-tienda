import { IconRefresh } from './icons';

const ErrorState = ({ onRetry }) => (
  <div className="text-center py-12 px-4 bg-rose-50/50 rounded-xl border border-rose-100">
    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 font-bold">
      !
    </div>
    <h3 className="text-sm font-semibold text-slate-900">No se pudo conectar con el catálogo</h3>
    <p className="mt-1 text-xs text-slate-500 mb-4">
      Revisa que MySQL y el backend estén iniciados y vuelve a intentarlo.
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
    >
      <IconRefresh /> Reintentar
    </button>
  </div>
);

export default ErrorState;
