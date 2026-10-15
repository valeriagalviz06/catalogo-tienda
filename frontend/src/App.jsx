import { useEffect, useMemo, useState } from "react";

import { createProduct, deleteProduct, getCategories, getProducts, updateProduct } from "./api/products";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import { IconPlus } from "./components/icons";
import ProductFilters from "./components/ProductFilters";
import ProductFormModal from "./components/ProductFormModal";
import ProductTable from "./components/ProductTable";
import SkeletonTable from "./components/SkeletonTable";
import Toast from "./components/Toast";
import { formatCurrency } from "./utils/format";

const normalizeCategoryName = (category) => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name || "";
};

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  category: normalizeCategoryName(product.category),
  categoryId: product.categoryId ?? product.category?.id,
  price: Number(product.price),
  stock: Number(product.stock),
  description: product.description || "",
});

const normalizeCategories = (categories = []) => categories.map((category) => ({
  id: category.id,
  name: normalizeCategoryName(category),
}));

export default function ProductCatalogApp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    let isActive = true;

    const loadCatalog = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const [categoryResponse, productResponse] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (!isActive) return;

        const loadedCategories = normalizeCategories(categoryResponse);
        const loadedProducts = productResponse.map(normalizeProduct);

        setCategories(loadedCategories);
        setProducts(loadedProducts);
      } catch {
        if (!isActive) return;
        setProducts([]);
        setCategories([]);
        setHasError(true);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadCatalog();
    return () => {
      isActive = false;
    };
  }, [reloadKey]);

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

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    const categoryId = categories.find((category) => category.name === productData.category)?.id;
    const payload = {
      name: productData.name,
      sku: productData.sku,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      categoryId: productData.categoryId ?? categoryId,
    };

    try {
      const savedProduct = editingProduct
        ? await updateProduct(editingProduct.id, payload)
        : await createProduct(payload);

      const normalizedSavedProduct = normalizeProduct(savedProduct);

      if (editingProduct) {
        setProducts((prev) => prev.map((item) => (item.id === normalizedSavedProduct.id ? normalizedSavedProduct : item)));
        showToast("Producto actualizado con éxito");
      } else {
        setProducts((prev) => [normalizedSavedProduct, ...prev]);
        showToast("Producto creado con éxito");
      }
    } catch {
      showToast("No se pudo guardar el producto en la base de datos.", "error");
      return;
    }

    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Producto eliminado", "success");
    } catch {
      showToast("No se pudo eliminar el producto de la base de datos.", "error");
      return;
    }
    setProductToDelete(null);
  };

  const handleReload = () => setReloadKey((current) => current + 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Catálogo de productos</h1>
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

        <ProductFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories.map((category) => category.name)}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onReset={handleResetFilters}
        />

        <main className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <SkeletonTable />
          ) : hasError ? (
            <ErrorState onRetry={handleReload} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState onReset={searchTerm || selectedCategory !== "all" ? handleResetFilters : null} />
          ) : (
            <ProductTable
              products={filteredProducts}
              formatCurrency={formatCurrency}
              onEdit={handleOpenEditModal}
              onDelete={setProductToDelete}
            />
          )}

          {!isLoading && !hasError && filteredProducts.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
              <span className="text-[11px] text-slate-400">Precios expresados en USD</span>
            </div>
          )}
        </main>
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        existingSkus={products.map((p) => ({ id: p.id, sku: p.sku }))}
        categories={categories.map((category) => category.name)}
      />

      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />

      <Toast notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
}