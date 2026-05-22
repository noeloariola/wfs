'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/bouquets">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 flex gap-4"
              >
                {/* Product Image and selected wrapper images below */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.productImage}
                      alt={item.productTitle}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Wrapper selections */}
                  <div className="mt-2 flex items-center gap-2">
                    {item.wrapperSelections && item.wrapperSelections.length > 0 ? (
                      item.wrapperSelections.map((w, i) => (
                        <div key={i} className="w-10 h-10 relative rounded overflow-hidden border">
                          <Image src={w.variantImage} alt={w.variantId} fill className="object-cover" />
                        </div>
                      ))
                    ) : item.wrapperVariantImage ? (
                      <div className="w-10 h-10 relative rounded overflow-hidden border">
                        <Image src={item.wrapperVariantImage} alt={`${item.productTitle} wrapper`} fill className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.productTitle}
                    </h2>
                    {item.wrapperColor && item.wrapperVariantId && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Wrapper Color:</span>{' '}
                          {item.wrapperColor}
                        </p>
                        <p>
                          <span className="font-semibold">Variant:</span>{' '}
                          {item.wrapperVariantId}
                        </p>
                      </div>
                    )}
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      ₱{item.productPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateItemQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemQuantity(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₱{(item.productPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₱{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex flex-col text-gray-600">
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Message us on our Facebook page to know the shipping fee</span>
                </div>
                <div className="text-sm text-right text-gray-500 mt-1">
                  Shipping fee depends on the dropoff location.
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₱{getTotalPrice().toLocaleString()}
              </span>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg mb-3 transition-colors">
              Proceed to Checkout
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors mb-4"
            >
              Clear Cart
            </button>

            <Link href="/bouquets">
              <button className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2 px-4 rounded-lg">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
