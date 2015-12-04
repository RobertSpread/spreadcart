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

    //api key, needed to apply vouchers
    apiKey:"0a95d972-cbd2-455c-b5e3-9727d34bc02e",
    
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
    proxyPath: "proxy.php"
};

var strings = spreadCart_lang[spreadCart_config.lang];
// change strings as desired for particular site