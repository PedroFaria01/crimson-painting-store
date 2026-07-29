import { supabase } from '../lib/supabaseClient'

const PRODUCT_SELECT = '*, categories(key, label), product_images(url, alt, position)'

function formatPrice(row) {
  const amount = (row.price_cents / 100).toFixed(2)
  const prefix = row.price_prefix ? `${row.price_prefix} ` : ''
  const suffix = row.price_suffix || ''
  return `${prefix}€${amount}${suffix}`
}

function mapProduct(row) {
  const images = [...(row.product_images || [])].sort((a, b) => a.position - b.position)
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.key ?? null,
    categoryLabel: row.categories?.label ?? '',
    price: formatPrice(row),
    priceNum: row.price_cents / 100,
    desc: row.short_description,
    longDesc: row.long_description,
    stock: row.stock,
    isActive: row.is_active,
    featured: row.is_featured,
    images,
    // No product photography yet — components fall back to this label
    // via <PlaceholderImage> until product_images has real rows.
    placeholder: images[0]?.alt || `photo: ${row.name}`,
  }
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
  if (error) throw error
  return [{ key: 'all', label: 'All' }, ...data.map((c) => ({ key: c.key, label: c.label }))]
}

export async function fetchActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('created_at')
  if (error) throw error
  return data.map(mapProduct)
}

// --- Admin-only reads/writes. RLS enforces the actual permission check;
// these simply fail with a Postgres error if the caller isn't an admin. ---

export async function fetchAllProductsForAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapProduct)
}

export async function createProduct(input) {
  const { data, error } = await supabase.from('products').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id, patch) {
  const { data, error } = await supabase
    .from('products')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
