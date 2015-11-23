# spreadcart

This JS plugin provides a simple shopping cart for SpreadShirt's embedded javascript SpreadShop. The plugin only allows for deleting items from the cart and not for updating quantities, but it delegates deletion to a proxy server. Proxy servers are provided for PHP and node.js. The plugin can optionally display the number of items in the cart next to a shopping cart icon. It is architected to support multiple languages but so far only provides a few languages.

## Read-Only Mode

If you are unable to place a proxy server on your web site, you can still use the plugin in a read-only mode. Users will be able to see the contents of the shopping cart but not change quantities or delete items. However, SpreadShirt still provides the option to modify the cart on checkout. To do without the proxy server, just set the language string `deleteItem` to null.

## How it works:

* SpreadShirt's Spreadshop script defines basket data in the local storage.
* The plugin reads data from local storage and renders an access point to an order overview, along with a link to the checkout.
* Changes made to the shopping cart are directed to the proxy server on your web site, which then delegates the job to the online SpreadShirt API.

## How to use:

* Download the files (e.g. download the zip or do a git clone).
* Place the files `spreadCart.js`, `spreadCart_lang.js`, and `spreadCart.css` on your web site and have your pages pull them in.
* Look at the provided `spreadCart_config.js` for an example of how to set up and configure your pages to use the plugin. Comments explain the parameters.
* If you add any language strings to `spreadCart_lang.js`, please consider checking them in or otherwise supplying them to us for check in.
* If you are able to, place one of the provided proxy servers on your web site.

## Presentation Options

To prevent users from being confused over the presence of two shopping carts being displayed on the web page, this plugin hides the SpreadShop cart so that only this plugin cart is available. This also prevents the item counts on the two shopping carts from getting out of sync. This measure to reduce user confusion comes at a cost to functionality. At present, the plugin cart only allows you to delete items and not to otherwise change quantities, and it only allows deletion if you employ the provided proxy server.

You can deploy the plugin in any of the following ways according to how you prioritize consistency vs. functionality:

(1) Deploy the default configuration. The SpreadShop cart is hidden, and the plugin cart is the only means for accessing the shopping cart. The user can delete items from the cart if you also deploy the proxy server. The user cannot otherwise change the quantities of items in the cart.

(2) Enable both the plugin cart and the SpreadShop cart. If the user makes changes in the SpreadShop cart, the item counts reported by the two carts will differ until the user displays the plugin cart again. This is done by adding the following CSS anywhere *after* `spreadCart.css` is loaded: `#basketButton{display: inline-block !important;}`.

(3) Enable both carts, but disable the item count on the plugin cart, so the user will not be concerned with apparent quantity discrepancies. This is done by setting `clickTargetID` to an ID other than `spreadCartIcon` and putting this ID on your own custom element. Here's an example custom element: `<a id="mySpreadCartLink">Shopping Cart</a>`. You may also want to induce link-like pointer behavior with the following CSS: `#mySpreadCartLink:hover {cursor:pointer;}`. In addition, to show the SpreadShop cart, add the following CSS anywhere *after* `spreadCart.css` is loaded: `#basketButton{display: inline-block !important;}`. 

## Deploying a Proxy Server

We provide two proxy servers, one for PHP and one for node.js. The proxy server must go on the same web site as your store, because browsers only allow javascript to send data to the site from which the javascript was downloaded.

### PHP

Installing the PHP proxy should be just a matter of placing `proxy.php` in the root directory of your web site. You may place it in a different directory by changing the `proxyPath` configuration parameter. The provided configuration `spreadCart_config.js` defaults to using the PHP proxy.

### node.js

You have two options for installing the node.js proxy. Both use the node.js express framework. You will need to use npm to install the required modules, which are listed at the top of `server.js` and `cart.js`.

If you're already running a node.js server, place the `cart.js` script in your `routes` directory and route to it from your server. The suggested route is `/cart`. Set the `proxyPath` configuration parameter to whatever route you use. You won't need the `server.js` script.

If you are not already running node.js but have the ability to do so, you can use the provided basic server `server.js` to do the job. Place `server.js` and `cart.js` in the root directory and set the `proxyPath` configuration parameter to `/cart`. This server serves files from a `/public` directory that you create. Just put your SpreadShirt store HTML and supporting files in there.