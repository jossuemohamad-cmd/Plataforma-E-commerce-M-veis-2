export function clampQuantity(requested, stock) {
  const safeStock = Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
  const safeRequested = Number.isFinite(requested) ? Math.max(0, Math.floor(requested)) : 0;
  return Math.min(safeRequested, safeStock);
}

export function cartItemKey(productId, variantId) {
  return `${productId}:${variantId || 'default'}`;
}
