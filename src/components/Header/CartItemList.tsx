import { CartItemListProps } from "@interfaces/interfaces";

export default function CartItemList({
  cart,
  updateQuantity,
}: CartItemListProps) {
  return (
    <>
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <div className="attributes">
            <h3>{item.product.name}</h3>
            <p>
              {item.product.prices[0].currency.symbol}
              {item.product.prices[0].amount.toFixed(2)}
            </p>

            {item.product.attributes.map((attr) => {
              const kebabCaseAttrName = attr.name
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <div
                  key={attr.name}
                  className="attribute-group"
                  data-testid={`cart-item-attribute-${kebabCaseAttrName}`}
                >
                  <p className="attribute-label">{attr.name}:</p>
                  <div className="attribute-options">
                    {attr.items.map((option) => {
                      const isSelected =
                        item.selectedAttributes[attr.name] === option.value;
                      const kebabCaseAttrName = attr.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      const kebabCaseOption = option.value
                        .toLowerCase()
                        .replace(/\s+/g, "-");

                      return (
                        <button
                          key={option.id}
                          className={`${
                            attr.type === "swatch"
                              ? "swatch-option"
                              : "text-option"
                          } ${isSelected ? "selected" : ""}`}
                          style={
                            attr.type === "swatch"
                              ? { backgroundColor: option.value }
                              : {}
                          }
                          data-testid={`cart-item-attribute-${kebabCaseAttrName}-${kebabCaseOption}${
                            isSelected ? "-selected" : ""
                          }`}
                        >
                          {attr.type === "swatch" ? "" : option.displayValue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-item-quantity">
            <button
              onClick={() => updateQuantity(item.product.id, 1)}
              data-testid="cart-item-amount-increase"
            >
              +
            </button>
            <span data-testid="cart-item-amount">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product.id, -1)}
              data-testid="cart-item-amount-decrease"
            >
              -
            </button>
          </div>

          <div>
            <img src={item.product.gallery[0]} alt={item.product.name} />
          </div>
        </div>
      ))}
    </>
  );
}
