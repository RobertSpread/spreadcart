var pluginSpreadCart_config = {

    // language ID, as used in the spreadCart_lang.js language strings
    lang: "en_us",

    // whether or not to render a shopping cart icon that shows the number
    // of items in the cart. when false, the page instead identifies an
    // element that is to open the shopping cart when clicked.

    showBasketIcon: true,

    // id (not a class) of the element that the user clicks on to open the
    // shopping cart. when showBasketIcon is true, clickTargetID must
    // identify a div. when showBasketIcon is false, clickTargetID
    // identifies the element that is to open the shopping cart when
    // clicked. For example, set showBasketIcon to false and clickTargetID
    // to 'myPluginCartLink' to have the following link open the cart:
    // "<a id='myPluginCartLink' href='#'>Shopping Cart</a>"

    clickTargetID: "myBasket",

    // .com,.de,.co.uk or any other supported domain
    tld: "de",

    // your shop id (the ID number, not the shop name)
    shopID: "0",

    //base URL the images will be pulled from. Needed to display product images in the basket. Change to .com (vs .net) for non-EU shops.
    mediaURL: "//image.spreadshirtmedia.net/image-server/v1/products/",

    // location from where the customer enters checkout
    returnURL: encodeURIComponent(window.location.href)
};

var strings = pluginSpreadCart_lang[pluginSpreadCart_config.lang];
// change strings as desired for particular site