import { IconSearch } from './icons';

const EmptyState = ({ onReset }) => (
  <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-200">
    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
      <IconSearch />
    </div>
    <h3 className="text-sm font-semibold text-slate-900">No se encontraron productos</h3>
    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
      No hay coincidencias para los filtros aplicados. Intenta cambiar los criterios de búsqueda.
    </p>
    {onReset && (
      <button
        onClick={onReset}
        className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
      >
        Limpiar filtros
      </button>
    )}
  </div>
);

export default EmptyState;
