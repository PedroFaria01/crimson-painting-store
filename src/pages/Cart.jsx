import { Link, useNavigate } from 'react-router-dom'
import PlaceholderImage from '../components/PlaceholderImage'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'
import { formatEUR } from '../lib/format'

export default function Cart() {
  const navigate = useNavigate()
  const {
    cartItems,
    changeQty,
    removeFromCart,
    subtotalDisplay,
    shippingDisplay,
    totalDisplay,
  } = useCart()

  return (
    <div className="max-w-[1100px] mx-auto px-10 pt-12 pb-[90px] w-full box-border animate-cp-fade">
      <h1 className="font-cinzel font-bold text-[34px] mb-8 text-cp-cream-bright">
        Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 text-cp-muted-2">
          <div className="text-[17px] mb-5">Your cart is empty.</div>
          <Button as={Link} to="/catalog" variant="solid">
            View Catalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div className="flex flex-col gap-[18px]">
            {cartItems.map((item) => {
              const lineTotal = formatEUR(item.product.priceNum * item.qty)
              return (
                <div
                  key={item.productId}
                  className="flex gap-[18px] bg-cp-surface border border-cp-border rounded-md p-4"
                >
                  <PlaceholderImage
                    label="photo"
                    rounded
                    className="w-[90px] h-[90px] shrink-0 rounded-md"
                  />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="font-semibold text-base text-cp-cream">
                      {item.product.name}
                    </div>
                    <div className="font-cinzel text-sm text-cp-muted">
                      {item.product.price}
                    </div>
                    <div className="flex items-center gap-3.5 mt-auto">
                      <div className="flex items-center border border-cp-border rounded">
                        <button
                          onClick={() => changeQty(item.productId, -1)}
                          className="w-[30px] h-[30px] bg-transparent border-none text-cp-cream text-[15px] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <div className="w-[30px] text-center text-sm">{item.qty}</div>
                        <button
                          onClick={() => changeQty(item.productId, 1)}
                          className="w-[30px] h-[30px] bg-transparent border-none text-cp-cream text-[15px] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          &#43;
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[13px] text-cp-muted-2 hover:text-cp-gold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="font-cinzel text-base text-cp-cream whitespace-nowrap">
                    {lineTotal}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-cp-surface border border-cp-border rounded-md p-[26px] lg:sticky lg:top-[90px]">
            <div className="font-cinzel text-lg font-bold mb-5 text-cp-cream-bright">
              Summary
            </div>
            <div className="flex justify-between text-[15px] text-cp-muted mb-2.5">
              <span>Subtotal</span>
              <span>{subtotalDisplay}</span>
            </div>
            <div className="flex justify-between text-[15px] text-cp-muted mb-[18px]">
              <span>Shipping</span>
              <span>{shippingDisplay}</span>
            </div>
            <div className="flex justify-between font-cinzel text-[19px] font-bold text-cp-cream-bright border-t border-cp-border pt-4 mb-6">
              <span>Total</span>
              <span>{totalDisplay}</span>
            </div>
            <Button
              variant="solid"
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
