import { apiFetch } from './client';

export async function getCategories() {
  return apiFetch('/categories');
}

export async function getProducts() {
  return apiFetch('/products');
}

export async function createProduct(payload) {
  return apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id, payload) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });
}