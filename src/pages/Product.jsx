import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PlaceholderImage from '../components/PlaceholderImage'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'
import { getProductById } from '../data/products'

export default function Product() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  // Reset local UI state whenever the visited product changes
  useEffect(() => {
    setQty(1)
    setJustAdded(false)
  }, [id])

  if (!product) {
    return (
      <div className="max-w-[1100px] mx-auto px-10 pt-12 pb-[90px] text-center animate-cp-fade">
        <p className="text-cp-muted mb-6">Product not found.</p>
        <Button as={Link} to="/catalog" variant="solid">
          Back to Catalog
        </Button>
      </div>
    )
  }

  function handleAddToCart() {
    addToCart(product.id, qty)
    setJustAdded(true)
  }

  return (
    <div className="max-w-[1100px] mx-auto px-10 pt-12 pb-[90px] w-full box-border animate-cp-fade">
      <Link
        to="/catalog"
        className="font-cinzel text-[13px] tracking-wide uppercase inline-block mb-7 text-cp-gold hover:text-cp-gold-bright"
      >
        &larr; Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <PlaceholderImage
          label={product.placeholder}
          rounded
          className="w-full h-[480px] rounded-lg"
        />

        <div>
          <div className="font-cinzel text-xs tracking-[2px] text-cp-gold uppercase mb-3.5">
            {product.categoryLabel}
          </div>
          <h1 className="font-cinzel font-bold text-[34px] mb-4 text-cp-cream-bright">
            {product.name}
          </h1>
          <div className="font-cinzel text-[26px] text-cp-muted mb-[22px]">
            {product.price}
          </div>
          <p className="text-base leading-[1.7] text-cp-muted mb-7">
            {product.longDesc}
          </p>

          <div className="flex items-center gap-5 mb-[26px]">
            <div className="flex items-center border border-cp-border rounded">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 bg-transparent border-none text-cp-cream text-lg cursor-pointer"
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <div className="w-10 text-center text-base">{qty}</div>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 bg-transparent border-none text-cp-cream text-lg cursor-pointer"
                aria-label="Increase quantity"
              >
                &#43;
              </button>
            </div>
            <Button variant="solid" onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>

          {justAdded && (
            <div className="text-sm text-cp-gold">Added to cart ✓</div>
          )}
        </div>
      </div>
    </div>
  )
}
