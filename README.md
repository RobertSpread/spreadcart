# spreadcart
This JS plugin provides a simple shopping cart for SpreadShirt's embedded javascript SpreadShop. The plugin only allows for deleting items from the cart and not for updating quantities, but it delegates deletion to a proxy server, here exemplified in PHP. The plugin can optionally display the number of items in the cart next to a shopping cart icon. It is architected to support multiple languages but so far only provides a few languages.

How it works:
* SpreadShirt's Spreadshop script defines basket data in the local storage.
* The plugin reads data from local storage and renders an access point to an order overview, along with a link to the checkout.

How to use:
* Download the files (e.g. git clone).
* Place the files `spreadCart.js`, `spreadCart_lang.js`, and `spreadCart.css` on your web site and have your pages pull them in.
* Look at the provided `index.html` for an example of how to set up and configure your pages to use the scripts. Comments explain the parameters.
* If you add any language strings to `spreadCart_lang.js`, please consider checking them in or otherwise supplying them to us for check in.
