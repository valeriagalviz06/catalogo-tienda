import React, { useState, useMemo, useEffect } from "react";
import StockBadge from "./components/StockBadge";

// ============================================================================
// 1. DATOS DE EJEMPLO (8 productos de tecnología)
// ============================================================================
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "MacBook Air M2 13\"",
    sku: "LAP-MBA-001",
    category: "Laptops",
    price: 1199.0,
    stock: 8,
    description: "Chip M2, 8GB RAM unificada, 256GB SSD, pantalla Liquid Retina."
  },
  {
    id: "prod-2",
    name: "Dell XPS 13 Plus",
    sku: "LAP-XPS-002",
    category: "Laptops",
    price: 1349.5,
    stock: 3, // Stock bajo
    description: "Intel Core i7 13va Gen, 16GB RAM, acabado en aluminio platino."
  },
  {
    id: "prod-3",
    name: "Monitor LG UltraWide 34\" WQHD",
    sku: "MON-LG-001",
    category: "Monitores",
    price: 489.0,
    stock: 0, // Agotado
    description: "Panel IPS curvo 21:9, HDR10, 100Hz, puertos USB-C y HDMI."
  },
  {
    id: "prod-4",
    name: "Monitor ASUS ProArt 27\" 4K",
    sku: "MON-ASUS-002",
    category: "Monitores",
    price: 520.0,
    stock: 6,
    description: "Calibración de color de fábrica Delta E < 2, 100% sRGB, DisplayPort."
  },
  {
    id: "prod-5",
    name: "Mouse Logitech MX Master 3S",
    sku: "ACC-LOG-001",
    category: "Accesorios",
    price: 99.99,
    stock: 14,
    description: "Sensor óptico 8K DPI silencioso, rueda MagSpeed, Bluetooth y Bolt."
  },
  {
    id: "prod-6",
    name: "Teclado Mecánico Keychron K2 V2",
    sku: "ACC-KEY-002",
    category: "Accesorios",
    price: 89.0,
    stock: 2, // Stock bajo
    description: "Formato 75%, switches Gateron Brown intercambiables, Bluetooth 5.1."
  },
  {
    id: "prod-7",
    name: "Hub USB-C Satechi Multi-puerto 8 en 1",
    sku: "ACC-SAT-003",
    category: "Accesorios",
    price: 65.0,
    stock: 0, // Agotado
    description: "Salida HDMI 4K 60Hz, Ethernet Gigabit, lector SD/MicroSD y PD 100W."
  },
  {
    id: "prod-8",
    name: "Base de Aluminio Ergonómica para Laptop",
    sku: "ACC-BAS-004",
    category: "Accesorios",
    price: 34.5,
    stock: 22,
    description: "Estructura plegable ventilada compatible con equipos de 11 a 17 pulgadas."
  }
];

const CATEGORIES = ["Laptops", "Monitores", "Accesorios"];

// Formateador de moneda en USD
const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD" }).format(amount);

// ============================================================================
// 2. ÍCONOS SVG MINIMALISTAS
// ============================================================================
const IconPlus = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ============================================================================
// 3. COMPONENTES VISUALES SECUNDARIOS
// ============================================================================



// Notificación Flotante (Toast)
const Toast = ({ notification, onClose }) => {
  if (!notification) return null;
  const isError = notification.type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center shadow-lg rounded-xl px-4 py-3 border text-sm transition-all duration-300 animate-slide-up bg-white text-slate-800 border-slate-200">
      <div className={`w-2.5 h-2.5 rounded-full mr-3 ${isError ? "bg-rose-500" : "bg-emerald-500"}`} />
      <span className="font-medium">{notification.message}</span>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none">
        &times;
      </button>
    </div>
  );
};

// Estado Esqueleto (Skeleton)
const SkeletonTable = () => (
  <div className="divide-y divide-slate-100 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-4 flex items-center justify-between space-x-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3 bg-slate-100 rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
      </div>
    ))}
  </div>
);

// Estado Vacío
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

// Estado de Error
const ErrorState = ({ onRetry }) => (
  <div className="text-center py-12 px-4 bg-rose-50/50 rounded-xl border border-rose-100">
    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 font-bold">
      !
    </div>
    <h3 className="text-sm font-semibold text-slate-900">Hubo un error al cargar el catálogo</h3>
    <p className="mt-1 text-xs text-slate-500 mb-4">No fue posible sincronizar los datos de los productos.</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
    >
      <IconRefresh /> Reintentar
    </button>
  </div>
);

// ============================================================================
// 4. MODAL FORMULARIO (Creación / Edición)
// ============================================================================
const ProductFormModal = ({ isOpen, onClose, onSave, editingProduct, existingSkus }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        description: editingProduct.description || "",
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
        category: editingProduct.category
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        description: "",
        price: "",
        stock: "0",
        category: ""
      });
    }
    setErrors({});
    setServerError("");
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "El nombre es obligatorio";
    if (!formData.sku.trim()) errs.sku = "El SKU es obligatorio";
    
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.price = "El precio debe ser un número mayor a 0";
    }

    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(Number(formData.stock))) {
      errs.stock = "El stock debe ser un número entero mayor o igual a 0";
    }

    if (!formData.category) {
      errs.category = "Debes seleccionar una categoría";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    // Simular latencia y validación de backend (ej. SKU único)
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const normalizedSku = formData.sku.trim().toUpperCase();
    const isDuplicate = existingSkus.some(
      (item) => item.sku.toUpperCase() === normalizedSku && item.id !== editingProduct?.id
    );

    if (isDuplicate) {
      setIsSubmitting(false);
      setServerError(`El SKU "${normalizedSku}" ya está registrado en otro producto.`);
      return;
    }

    onSave({
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      sku: normalizedSku,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      description: formData.description.trim()
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {editingProduct ? "Editar producto" : "Agregar producto"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
            &times;
          </button>
        </div>

        {serverError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center">
            <span className="font-semibold mr-1">Error de validación:</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nombre <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Monitor 27 pulgadas"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-rose-300 focus:ring-rose-200" : "border-slate-300 focus:ring-indigo-200 focus:border-indigo-500"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          {/* SKU y Categoría (2 columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ej. MON-27-001"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.sku ? "border-rose-300 focus:ring-rose-200" : "border-slate-300 focus:ring-indigo-200 focus:border-indigo-500"
                }`}
              />
              {errors.sku && <p className="mt-1 text-xs text-rose-600">{errors.sku}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categoría <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  errors.category ? "border-rose-300 focus:ring-rose-200" : "border-slate-300 focus:ring-indigo-200 focus:border-indigo-500"
                }`}
              >
                <option value="">Selecciona una opción</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
            </div>
          </div>

          {/* Precio y Stock (2 columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Precio (USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price ? "border-rose-300 focus:ring-rose-200" : "border-slate-300 focus:ring-indigo-200 focus:border-indigo-500"
                }`}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.stock ? "border-rose-300 focus:ring-rose-200" : "border-slate-300 focus:ring-indigo-200 focus:border-indigo-500"
                }`}
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Descripción (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descripción <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalles técnicos, conectividad o notas del producto..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 5. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
// ============================================================================
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

// ============================================================================
// 6. COMPONENTE PRINCIPAL (APP)
// ============================================================================
export default function ProductCatalogApp() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Estados de interfaz y feedback
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [notification, setNotification] = useState(null);

  // Estados de modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Toast auto-cierre
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Filtrado reactivo en memoria
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  // Handlers CRUD
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) => (item.id === productData.id ? productData : item))
      );
      showToast("Producto actualizado con éxito");
    } else {
      setProducts((prev) => [productData, ...prev]);
      showToast("Producto creado con éxito");
    }
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setProductToDelete(null);
    showToast("Producto eliminado", "success");
  };

  // Simulación de recarga (para probar Skeleton / Error)
  const handleReloadSimulated = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Catálogo de productos
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Administra el inventario, categorías y precios de tu tienda.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-100 transition-colors focus:ring-2 focus:ring-indigo-300"
          >
            <IconPlus /> Agregar producto
          </button>
        </header>

        {/* BARRA DE HERRAMIENTAS (Filtros y Búsqueda) */}
        <section className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Input de Búsqueda */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            {/* Selector de Categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para limpiar filtros */}
          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 self-center md:self-auto px-2 py-1 rounded"
            >
              Limpiar filtros
            </button>
          )}
        </section>

        {/* CONTENEDOR PRINCIPAL: TABLA / TARJETAS / ESTADOS */}
        <main className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <SkeletonTable />
          ) : hasError ? (
            <ErrorState onRetry={handleReloadSimulated} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState onReset={searchTerm || selectedCategory !== "all" ? handleResetFilters : null} />
          ) : (
            <>
              {/* VISTA ESCRITORIO: TABLA (Visible en md en adelante) */}
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
                    {filteredProducts.map((p) => (
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
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="py-4 px-6">
                          <StockBadge stock={p.stock} />
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                            title="Editar"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
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

              {/* VISTA MÓVIL: TARJETAS APILADAS (Visible en pantallas < md) */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredProducts.map((p) => (
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

                    {p.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    )}

                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-50">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="inline-flex items-center text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                      >
                        <IconEdit /> <span className="ml-1">Editar</span>
                      </button>
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="inline-flex items-center text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg"
                      >
                        <IconTrash /> <span className="ml-1">Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pie de tabla con resumen */}
          {!isLoading && !hasError && filteredProducts.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
              <span className="text-[11px] text-slate-400">Precios expresados en USD</span>
            </div>
          )}
        </main>
      </div>

      {/* MODAL CREAR / EDITAR */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        existingSkus={products.map((p) => ({ id: p.id, sku: p.sku }))}
      />

      {/* MODAL CONFIRMACIÓN DE ELIMINACIÓN */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />

      {/* TOAST DE NOTIFICACIONES */}
      <Toast notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
}