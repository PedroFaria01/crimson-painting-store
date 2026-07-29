import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage'

export default function ProductCard({ product, showDesc = false, imgHeight = 'h-[180px]' }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="flex flex-col bg-cp-surface border border-cp-border rounded-md overflow-hidden hover:border-cp-gold-dim transition-colors"
    >
      <PlaceholderImage label={product.placeholder} className={`w-full ${imgHeight}`} />
      <div className="flex flex-col gap-2 p-[18px] flex-1">
        <div className="font-cinzel text-[10px] tracking-[1.5px] text-cp-gold uppercase">
          {product.categoryLabel}
        </div>
        <div className="text-[17px] font-semibold text-cp-cream">{product.name}</div>
        {showDesc && (
          <div className="text-sm text-cp-muted-2 leading-snug">{product.desc}</div>
        )}
        <div className="mt-auto font-cinzel text-base text-cp-muted pt-1">
          {product.price}
        </div>
      </div>
    </Link>
  )
}
