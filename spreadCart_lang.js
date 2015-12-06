/**
Language strings indexed by language abbreviation. Each language entry has the following structure, where each field provides a label in the language:

{
    information, // an optional note to help the user understand the cart
    currencyIndicator, // currency symbol to append to each monetary amount
    quantity, // quantity of listed product
    size, // size of a listed product
    color, // color of a listed product
    shippingInformation, // note about shipping (optionally empty)
    vatInformation, // note about taxes (optionally empty)
    deleteItem, // link for deleting item (leave empty to hide this link)
    itemsTotal, // total cost of items excluding shipping
    shippingFee, // fee for shipping
    total, // sum of itemsTotal and shippingTotal
    continueShopping, // link that closes shopping cart to continue shopping
    goToCheckout, // link that goes to the Spreadshirt checkout
    emptyCart, // message to display when the shopping cart is empty
}

Site developers are best off either using one of these sets of language strings or creating a new set of language strings. You may also have your site load these language strings and then subsequently modify them in your own script. It's best not to directly modify this script, so that you may overwrite this script with the latest versions of the shopping cart plugin, which may provide newly supported strings for each language.

This file also allows a site to dynamically select the language according to the client.

**/

var spreadCart_lang = {};

spreadCart_lang.de = {
    information: "",
    currencyIndicator: " &euro;",
    quantity: "Anzahl",
    size: "Gr&ouml;&szlig;e",
    color: "Farbe",
    shippingInformation: "inkl. Versand",
    vatInformation: "inkl. MwSt. EU",
    deleteItem: "Aus Warenkorb entfernen",
    itemsTotal: "Zwischensumme",
    shippingFee: "Versandkosten",
    total: "Gesamtbetrag",
    continueShopping: "Weiter Einkaufen",
    goToCheckout: "Zum Checkout",
    emptyCart: "Ihren Einkaufswagen ist leer",
    applyCoupon:"Gutschein einl&ouml;sen"
};

spreadCart_lang.en_us = {
    information: "",
    currencyIndicator: " $",
    quantity: "Quantity",
    size: "Size",
    color: "Color",
    shippingInformation: "",
    vatInformation: "(excludes any taxes that may apply)",
    deleteItem: "Delete Item",
    itemsTotal: "Subtotal",
    shippingFee: "Shipping Fee",
    total: "Total",
    continueShopping: "Continue Shopping",
    goToCheckout: "Checkout",
    emptyCart: "Your shopping cart is empty",
    applyCoupon:"Apply Coupon"
};

