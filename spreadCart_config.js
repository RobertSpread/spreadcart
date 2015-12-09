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

    // location where the customer goes after checkout
    returnURL: encodeURIComponent(window.location.href),
    
    // relative URL to shopping cart proxy. must be on your store's web site,
    // as otherwise the browser will refuse for cross-origin security reasons.
    // the last component of the path is "proxy.php" when using the provided
    // PHP script or "/cart" when using the provided node.js server.
    proxyPath: "proxy.php",
    
    // whether or not to maximally decouple the shopping cart from the details
    // of the SpreadShop implementation. A value of false is more responsive to
    // the user and less taxing on the proxy server. A value of true allows
    // the shopping cart to keep working despite some possible unexpected
    // changes in the SpreadShop implementation. A value of true also allows
    // this plugin to mirror changes made via the SpreadShop shopping cart.
    decouple: false,
    
    // number of milliseconds to wait between attempts to use the Spreadshirt
    // API to update the shopping cart's total quantity indicator. This is also
    // the minimum amount of time required to update the indicator after a user
    // adds to the shopping cart. The lower this number, the more responsive
    // the web page is to the user, but the more traffic that is directed to
    // the proxy server. Only used when clickTargetID is "spreadCartIcon".
    updateMillis: 750,
    
    // maximum number of attempts to make trying to use the Spreadshirt API to
    // update the shopping cart's total quantity indicator. One attempt is made
    // every updateMillis milliseconds until either a number of attempts equal
    // to updateTries has been made or the shopping cart is found to have
    // changed. Lower numbers are less taxing on the proxy server but less
    // resilient to network and server latency issues. In any case, the user
    // need only open the shopping cart to force an update.  Only used when 
    // clickTargetID is "spreadCartIcon". Caution: If this number is too high,
    // Spreadshirt might think your server is misbehaving.
    updateTries: 6,
    
    // optional function that will be called when the first item is put in the
    // cart and the last item is removed from the cart. The called method takes
    // a single parameter, which is the checkout URL when an item is added to
    // the cart and null when the last item is removed from the cart.
    stateHandler: null
};

var strings = spreadCart_lang[spreadCart_config.lang];
// change strings as desired for particular site