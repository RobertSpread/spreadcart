var spreadCart_config = {

    // language ID, as used in the spreadCart_lang.js language strings
    lang: "en_us",

    // id (not a class) of the element that the user clicks on to open the
    // shopping cart. When clickTargetID is set to "spreadCartIcon", the
    // plugin-provided icon is displayed on the element, and the element must
    // be a div. When clickTargetID is any other ID, it is an element you
    // provide that is to open the shopping cart when clicked. For example,
    // set clickTargetID to 'mySpreadCartLink' to have the following link open
    // the cart: "<a id='mySpreadCartLink'>Shopping Cart</a>"

    clickTargetID: "spreadCartIcon",

    // .com,.de,.co.uk or any other supported domain
    tld: "de",

    // your shop id (the ID number, not the shop name)
    shopID: "0",

    //base URL the images will be pulled from. Needed to display product images in the basket. Change to .com (vs .net) for non-EU shops.
    mediaURL: "//image.spreadshirtmedia.net/image-server/v1/products/",

    // location from where the customer enters checkout
    returnURL: encodeURIComponent(window.location.href),
    
    // relative URL to shopping cart proxy. must be on your store's web site,
    // as otherwise the browser will refuse for cross-origin security reasons.
    // the last component of the path is "proxy.php" when using the provided
    // PHP script or "/cart" when using the provided node.js server.
    proxyPath: "proxy.php",
    
    // optional function that will be called when the first item is put in the
    // cart and the last item is removed from the cart. The called method takes
    // a single parameter, which is the checkout URL when an item is added to
    // the cart and null when the last item is removed from the cart.
    stateHandler: null
};

var strings = spreadCart_lang[spreadCart_config.lang];
// change strings as desired for particular site