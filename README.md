# spreadcart
This JS plugin provides a simple shopping cart for SpreadShirt's embedded javascript SpreadShop. The plugin only allows for deleting items from the cart and not for updating quantities, but it delegates deletion to a proxy server, here exemplified in PHP. The plugin can optionally display the number of items in the cart next to a shopping cart icon. It is architected to support multiple languages but so far only provides a few languages.

To prevent users from being confused over the presence of two shopping carts begin displayed on the web page, this plugin hides the SpreadShop cart so that only this plugin cart is available. This also prevents the item counts on the two shopping carts from getting out of sync. This measure to reduce user confusion comes at a cost to functionality. At present, the plugin cart only allows you to delete items and not to otherwise change quantities, and it only allows deletion if you employ the provided proxy server.

You can deploy the plugin in any of the following ways according to you prioritize consistency vs. functionality:

(1) Deploy the default configuration. The SpreadShop cart is hidden, and the plugin cart is the only means for accessing the shopping cart. The user can delete items from the cart if you also deploy the proxy server. The user cannot otherwise change the quantities of items in the cart.

(2) Enable both the plugin cart and the SpreadShop cart. If the user makes changes in the SpreadShop cart, the item counts reported by the two carts will differ until the user displays the plugin cart again. This is done by setting `showBasketIcon` to true and adding the following CSS anywhere *after* `spreadCart.css` is loaded: `#basketButton{display: inline-block !important;}`.

(3) Enable both carts, but disable the item count on the plugin cart, so the user will not see count discrepancies. This is done by setting `showBasketIcon` to false and adding the following CSS anywhere *after* `spreadCart.css` is loaded: `#basketButton{display: inline-block !important;}`. You will also need to add your own clickable element for displaying the cart, such as the following: `<a id="myPluginCartLink" href="#">Shopping Cart</a>`.

How it works:
* SpreadShirt's Spreadshop script defines basket data in the local storage.
* The plugin reads data from local storage and renders an access point to an order overview, along with a link to the checkout.

How to use:
* Download the files (e.g. download the zip or do a git clone).
* Place the files `spreadCart.js`, `spreadCart_lang.js`, and `spreadCart.css` on your web site and have your pages pull them in.
* Look at the provided `spreadCart_config.js` for an example of how to set up and configure your pages to use the plugin. Comments explain the parameters.
* If you add any language strings to `spreadCart_lang.js`, please consider checking them in or otherwise supplying them to us for check in.
