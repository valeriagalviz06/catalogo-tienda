import StockBadge from './StockBadge';
import { IconEdit, IconTrash } from './icons';

const ProductTable = ({ products, formatCurrency, onEdit, onDelete }) => (
  <>
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="py-3.5 px-6">Nombre</th>
            <th className="py-3.5 px-6">SKU</th>
            <th className="py-3.5 px-6">Categoría</th>
            <th className="py-3.5 px-6">Precio</th>
            <th className="py-3.5 px-6">Stock</th>
            <th className="py-3.5 px-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-4 px-6 font-medium text-slate-900">
                <div>{p.name}</div>
                {p.description && (
                  <div className="text-xs text-slate-400 font-normal truncate max-w-xs">
                    {p.description}
                  </div>
                )}
              </td>
              <td className="py-4 px-6 text-slate-500 font-mono text-xs">{p.sku}</td>
              <td className="py-4 px-6">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {p.category}
                </span>
              </td>
              <td className="py-4 px-6 font-semibold text-slate-800">{formatCurrency(p.price)}</td>
              <td className="py-4 px-6">
                <StockBadge stock={p.stock} />
              </td>
              <td className="py-4 px-6 text-right space-x-2">
                <button
                  onClick={() => onEdit(p)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                  title="Editar"
                >
                  <IconEdit />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  title="Eliminar"
                >
                  <IconTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="md:hidden divide-y divide-slate-100">
      {products.map((p) => (
        <div key={p.id} className="p-4 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">{p.name}</h4>
              <span className="text-xs font-mono text-slate-400">{p.sku}</span>
            </div>
            <StockBadge stock={p.stock} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{p.category}</span>
            <span className="text-sm font-bold text-slate-800">{formatCurrency(p.price)}</span>
          </div>

          {p.description && <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>}

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-50">
            <button
              onClick={() => onEdit(p)}
              className="inline-flex items-center text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
            >
              <IconEdit /> <span className="ml-1">Editar</span>
            </button>
            <button
              onClick={() => onDelete(p)}
              className="inline-flex items-center text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg"
            >
              <IconTrash /> <span className="ml-1">Eliminar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default ProductTable;
