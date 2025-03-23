import { forwardRef } from "react";
import { useAppContext } from "@hooks/useAppContext";
import { useMutation } from "@apollo/client"; 
import { PLACE_ORDER } from "@graphql/mutations"; 

import CartItemList from "./CartItemList";

import "@styles/DropDownCart.scss";

export default forwardRef<HTMLDivElement>(function DropDownCart(_, ref) {
  const { cart, updateQuantity } = useAppContext();
  const [placeOrder, { loading, error }] = useMutation(PLACE_ORDER);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const { data } = await placeOrder({
        variables: {
          items: cart.map((item) => item.product.id),
        },
      });

      if (data?.placeOrder?.success) {
        alert("Order placed successfully!");
      } else {
        alert("Failed to place order.");
      }
    } catch {
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div ref={ref} className="cart-dropdown"> 
      <h3>
        <span id="cart-title">My Bag, </span>
        <span id="cart-count">{cart.length} items</span>
      </h3>

      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <CartItemList cart={cart} updateQuantity={updateQuantity} />
      )}

      <div className="cart-footer">
        <div className="total" data-testid="cart-total"> 
          <span>Total </span>
          <span id="amount" className="amount">
            $
            {cart
              .reduce(
                (total, item) =>
                  total + item.product.prices[0].amount * item.quantity,
                0
              )
              .toFixed(2)}
          </span>
        </div>

        <button className="place-order" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        {error && <p className="error">Error: {error.message}</p>}
      </div>
    </div>
  );
});
