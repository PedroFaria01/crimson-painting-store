import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import { useProducts } from '../../context/ProductsContext'
import { supabase } from '../../lib/supabaseClient'
import {
  createProduct,
  deleteProduct,
  fetchAllProductsForAdmin,
  updateProduct,
} from '../../services/products'

const EMPTY_FORM = {
  name: '',
  slug: '',
  categoryKey: '',
  price: '',
  pricePrefix: '',
  priceSuffix: '',
  shortDescription: '',
  longDescription: '',
  stock: '0',
  isActive: true,
  isFeatured: false,
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function productToForm(product, categories) {
  const category = categories.find((c) => c.key === product.category)
  return {
    name: product.name,
    slug: product.slug,
    categoryKey: category?.key || '',
    price: String(product.priceNum),
    pricePrefix: '',
    priceSuffix: '',
    shortDescription: product.desc,
    longDescription: product.longDesc,
    stock: String(product.stock),
    isActive: product.isActive,
    isFeatured: product.featured,
  }
}

export default function AdminProducts() {
  const { categories, reload: reloadStorefront } = useProducts()
  const adminCategories = categories.filter((c) => c.key !== 'all')

  const [products, setProducts] = useState([])
  const [categoryIdByKey, setCategoryIdByKey] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null) // null = closed, 'new' = create form
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function reload() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllProductsForAdmin()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  // fetchAllProductsForAdmin flattens category to { key, label }; writes need
  // the raw category_id, so look it up straight from Supabase once.
  useEffect(() => {
    supabase
      .from('categories')
      .select('id, key')
      .then(({ data }) => {
        if (data) setCategoryIdByKey(Object.fromEntries(data.map((c) => [c.key, c.id])))
      })
  }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId('new')
  }

  function openEdit(product) {
    setForm(productToForm(product, categories))
    setEditingId(product.id)
  }

  function closeForm() {
    setEditingId(null)
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        category_id: categoryIdByKey[form.categoryKey],
        price_cents: Math.round(parseFloat(form.price) * 100),
        price_prefix: form.pricePrefix || null,
        price_suffix: form.priceSuffix || null,
        short_description: form.shortDescription,
        long_description: form.longDescription,
        stock: parseInt(form.stock, 10) || 0,
        is_active: form.isActive,
        is_featured: form.isFeatured,
      }

      if (editingId === 'new') {
        await createProduct(payload)
      } else {
        await updateProduct(editingId, payload)
      }

      closeForm()
      await Promise.all([reload(), reloadStorefront()])
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setError(null)
    try {
      await deleteProduct(product.id)
      await Promise.all([reload(), reloadStorefront()])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-cp-muted-2">{products.length} products</p>
        <Button variant="solid" onClick={openCreate}>
          New Product
        </Button>
      </div>

      {error && <div className="text-sm text-cp-crimson-bright mb-4">{error}</div>}

      {editingId && (
        <form
          onSubmit={handleSubmit}
          className="bg-cp-surface border border-cp-border rounded-md p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Name"
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <input
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="Slug (auto from name if empty)"
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <select
            required
            value={form.categoryKey}
            onChange={(e) => updateField('categoryKey', e.target.value)}
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          >
            <option value="" disabled>
              Category
            </option>
            {adminCategories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="Price (e.g. 34.90)"
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <input
            value={form.pricePrefix}
            onChange={(e) => updateField('pricePrefix', e.target.value)}
            placeholder="Price prefix (optional, e.g. 'from')"
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <input
            value={form.priceSuffix}
            onChange={(e) => updateField('priceSuffix', e.target.value)}
            placeholder="Price suffix (optional, e.g. '/mini')"
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => updateField('stock', e.target.value)}
            placeholder="Stock"
            className="px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-cp-muted">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-cp-muted">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
              />
              Featured
            </label>
          </div>
          <textarea
            required
            value={form.shortDescription}
            onChange={(e) => updateField('shortDescription', e.target.value)}
            placeholder="Short description (catalog card)"
            rows={2}
            className="sm:col-span-2 px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <textarea
            required
            value={form.longDescription}
            onChange={(e) => updateField('longDescription', e.target.value)}
            placeholder="Long description (product page)"
            rows={3}
            className="sm:col-span-2 px-4 py-3 bg-cp-bg border border-cp-border rounded text-cp-cream text-sm"
          />
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit" variant="solid" disabled={saving}>
              {saving ? 'Saving…' : editingId === 'new' ? 'Create Product' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-cp-muted-2 py-8">Loading products…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-cp-surface border border-cp-border rounded-md px-5 py-3.5"
            >
              <div className="flex-1 min-w-0">
                <div className="text-cp-cream text-[15px] font-semibold truncate">
                  {product.name}
                </div>
                <div className="text-xs text-cp-muted-2">
                  {product.categoryLabel} · {product.price} · stock {product.stock}
                  {!product.isActive && ' · inactive'}
                </div>
              </div>
              <button
                onClick={() => openEdit(product)}
                className="font-cinzel text-xs tracking-wide uppercase text-cp-gold hover:text-cp-gold-bright"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product)}
                className="font-cinzel text-xs tracking-wide uppercase text-cp-muted-2 hover:text-cp-crimson-bright"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
