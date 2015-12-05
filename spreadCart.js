/******************************************************************************
SpreadCartPlugin is a shopping cart for SpreadShop that can be shared across multiple pages of a hosting web site. It creates a shopping cart icon at the indicated div and shows the number of items in the cart in a red bubble, although a user-provided clickable element can be used instead. It is configured via spreadCart_config and spreadCart_lang.
******************************************************************************/

//// CONSTANTS ////

var ADD_TO_BASKET_ID = "addToBasket"; // ID of SpreadShop button
var DEFAULT_ICON_ID = "spreadCartIcon"; // ID of plugin-provided cart icon
var SPREADSHOP_WAIT_MILLIS = 500; // millis between checks for SpreadShop

//// CONSTRUCTOR ////

function SpreadCartPlugin(config, stringsByLanguage) {
    // config - values from spreadCart_config
    // strings - values from a language of spreadCart_lang
    // showDefaultIcon - whether we're using the plugin-provided icon
    // basketID - ID of basket in use by SpreadShop
    // basket - SpreadCartBasket loaded via Spreadshirt API
    // lastTotalQuantity - total quantity of items last displayed
    // updateTriesLeft - number of attempts to update total quantity remaining
    // updateTimer - timer that periodically tries to update total quantity
    // basketChanged - whether user modified the basket while viewing

    this.config = config;
    this.strings = stringsByLanguage[config.lang];
    this.showDefaultIcon = (this.config.clickTargetID == DEFAULT_ICON_ID);
    this.basketID = null;
    this.basket = null;
    this.lastTotalQuantity = 0;
    this.updateTriesLeft = 0;
    this.updateTimer = null;
    this.basketChanged = false;
    var plugin = this;

    this.buildCustomMiniBasket();
    this.insertMiniBasketCaller();
    this.loadBasket(function(loaded) {
        plugin.displayTotalQuantity(); // display 0 if no basket
    });
    
    if(this.pageHasSpreadShop() && this.showDefaultIcon) {
    
        if(this.config.decouple) {
            jQuery('*').bind("mousedown.clickmap", function(evt) {
                plugin.clickUpdateListener();
            });
        }    
        else
            this.installSpreadShopMonitor();
    }
}

SpreadCartPlugin.prototype.pageHasSpreadShop = function() {
    return (typeof spread_shop_config !== 'undefined');
};

/** periodically check to see whether SpreadShop has loaded, and once it loads, install a listener on the button that adds items to the shopping cart **/

SpreadCartPlugin.prototype.installSpreadShopMonitor = function() {

    var $addButton = jQuery('#'+ADD_TO_BASKET_ID);
    var plugin = this;

    if($addButton.length) {
        $addButton.on("click", function() {
            plugin.clickUpdateListener();
        });
    }
    else {
        setTimeout(function() {
            plugin.installSpreadShopMonitor();
        }, SPREADSHOP_WAIT_MILLIS);
    }
};

//// PRESENTATION METHODS ////

//button to display minibasket is appended to defined basket container, binding function to display basket to button
SpreadCartPlugin.prototype.insertMiniBasketCaller = function() {
    var clickableID = '#'+this.config.clickTargetID;;
    var plugin = this;
    
    if(this.showDefaultIcon) {
        jQuery('#miniBasket').remove();
        jQuery(clickableID).append('<div id="miniBasket" '+
            'class="fa fa-shopping-cart fa-2x">'+
            '<div id="totalQuantity"></div></div>');
        clickableID = '#miniBasket';
    }

    jQuery(clickableID).on("click", function() {
        plugin.loadBasket(function(loaded) {
            plugin.openMiniBasket();
        });
    });
};

SpreadCartPlugin.prototype.buildCustomMiniBasket = function() {
    var plugin = this;

    // build the dimmed basket background
    
    jQuery('body').prepend('<div id="miniBasketBackground" style="display: none"></div>');
    jQuery('#miniBasketBackground').on("click", function() {
        plugin.closeMiniBasket();
    });

    // build the empty basket
    
    jQuery('body').prepend('<div id="miniBasketContainer" style="display: none"></div>');
    jQuery('#miniBasketContainer').append('<div id="emptyMiniBasketContainer" style="display: none"></div>');
    jQuery('#emptyMiniBasketContainer').append('<div id="miniEmptyNotice">'+this.strings.emptyCart+'</div><div id="miniEmptyOptions"></div></div>');
    jQuery('#miniEmptyOptions').append('<button class="miniBasketButton" id="miniCloseEmptyCart">'+this.strings.continueShopping+'</button>');

    jQuery('#miniCloseEmptyCart').on("click", function() {
        plugin.closeMiniBasket();
    });
    
    // build the filled basket

    jQuery('#miniBasketContainer').append('<div id="filledMiniBasketContainer" style="display: none"></div>');
    jQuery('#filledMiniBasketContainer').append('<div id="miniBasketDetails"></div>');

    if(this.strings.information) {
        jQuery('#miniBasketDetails').append('<div id="miniBasketInfo">'+
                this.strings.information+'</div>');
    }
    jQuery('#miniBasketDetails').append('<div id="miniBasketContent"></div>');
    
    jQuery('#miniBasketDetails').append('<div id="miniBasketFooter"></div>');
    jQuery('#miniBasketFooter').append('<div class="row"> <div class="miniBasketLabel">'+this.strings.itemsTotal+':</div> <div class="miniBasketLabel miniBasketPrice" id="priceItems"></div> </div>');
    jQuery('#miniBasketFooter').append('<div class="row" id="miniBasketShippingLine"><div class="miniBasketLabel">'+this.strings.shippingFee+':</div> <div class="miniBasketLabel miniBasketPrice" id="priceShipping"></div> </div>');
    jQuery('#miniBasketFooter').append(' <div id="miniBasketTotalLine" class="row"> <div class="miniBasketLabel">'+this.strings.total+':</div> <div class="miniBasketLabel miniBasketPrice" id="priceTotal"></div> <div </div>');
    
    if(this.strings.vatInformation) {
        jQuery('#miniBasketFooter').append('<div class="miniBasketNote">'+this.strings.vatInformation+'</div> ');
    }
    if(this.strings.shippingInformation) {
        jQuery('#miniBasketFooter').append('<div class="miniBasketNote">'+this.strings.shippingInformation+'</div>');
    }
    jQuery('#miniBasketFooter').append('<meta content="http://schema.org/InStock" itemprop="availability"></div></div>');
    
    jQuery('#miniBasketFooter').append('<div id="miniBasketOptions"></div>');
    jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="continueShoppingLink">'+this.strings.continueShopping+'</button>');
    jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="miniBasketCheckoutLink">'+this.strings.goToCheckout+'</button>');

    jQuery('#continueShoppingLink').on("click", function() {
        plugin.closeMiniBasket();
    });
    jQuery('#miniBasketCheckoutLink').on("click", function() {
        window.location = plugin.getCheckoutURL();
    });
};

SpreadCartPlugin.prototype.buildCartItems = function() {
    var plugin = this;

    if(this.basket === null)
        return;
    jQuery('#miniBasketContent').html(" ");
    jQuery.each(this.basket.basketItems, function(itemIndex){
        var basketItem = plugin.basket.basketItems[itemIndex];
        
        var itemDivID = 'basketItem-'+ basketItem.id;
        jQuery('#miniBasketContent').append('<div class="basketItem" id="'+ itemDivID +'"></div>');
        var itemDiv = jQuery('#'+ itemDivID);
        itemDiv.append('<img style="width:30%" src="'+ plugin.config.mediaURL + basketItem.element.id +'?appearanceId='+  basketItem.element.properties['appearance'] +'"/>');
        
        var infoDivID = 'basketItemInformation-'+ basketItem.id;
        itemDiv.append('<div class="basketItemInformation" id="'+ infoDivID +'"></div>');
        var infoDiv = jQuery('#'+ infoDivID);
        infoDiv.append('<div class="basketItemName">'+ basketItem.description +'</div>');
        infoDiv.append('<div class="basketItemQuantity">'+ plugin.strings.quantity +": "+ basketItem.quantity +'</div>');
        infoDiv.append('<div class="basketItemSize">'+ plugin.strings.size +": "+ basketItem.element.properties['sizeLabel'] +'</div>');
        infoDiv.append('<div class="basketItemColor">'+ plugin.strings.color +": "+ basketItem.element.properties['appearanceLabel'] +'</div>');
        itemDiv.append('<div class="basketItemPrice " style="display:inline">'+ plugin.formatPrice(plugin.basket.getUndiscountedItemCost(itemIndex)) +'</div>');
        
        if(plugin.strings.deleteItem) {
            infoDiv.append('<div  class="miniBasketButton fa fa-trash"  style="padding-left:0px" id="delete-'+ basketItem.id +'"><a>'+ plugin.strings.deleteItem +'</a></div>');
            jQuery('#delete-'+ basketItem.id).on("click", function() {
                plugin.requestDeleteItem(basketItem.id, itemDivID)
            });
        }
    });
};

SpreadCartPlugin.prototype.displayTotalQuantity = function() {
    var totalQuantity = this.getBasketTotalQuantity();
    
    if(this.config.stateHandler !== null) {
        if(totalQuantity == 0) {
            if(this.lastTotalQuantity > 0)
                this.config.stateHandler(null);
        }
        else if(this.lastTotalQuantity === 0)
            this.config.stateHandler(this.getCheckoutURL());
    }
    this.lastTotalQuantity = totalQuantity;
    
    if(this.showDefaultIcon)
        jQuery('#totalQuantity').html(totalQuantity);
};

SpreadCartPlugin.prototype.updateCartTotals = function() {

    // may need to switch to or from an empty cart 
    if(this.basket === null || this.basket.basketItems.length == 0 ) {
        jQuery('#emptyMiniBasketContainer').css({"display":"inline"});
        jQuery('#filledMiniBasketContainer').css({"display":"none"});
    }
    else {
        jQuery('#emptyMiniBasketContainer').css({"display":"none"})
        jQuery('#filledMiniBasketContainer').css({"display":"inline"});
        
        var itemTotal = this.basket.getUndiscountedItemSubtotal();
        var shippingCosts = this.basket.getShippingCost();
        var priceTotal = this.basket.getUndiscountedTotal();
        
        jQuery('#priceItems').html(this.formatPrice(itemTotal));
        jQuery('#priceShipping').html(this.formatPrice(shippingCosts));
        jQuery('#priceTotal').html(this.formatPrice(priceTotal));
    }
};

SpreadCartPlugin.prototype.openMiniBasket = function() {
    this.basketChanged = false;
    this.displayTotalQuantity(); // basket may have just loaded
    this.buildCartItems();
    this.updateCartTotals();
    $("#miniBasketContainer").toggle(true);
    $("#miniBasketBackground").toggle(true);
};

SpreadCartPlugin.prototype.closeMiniBasket = function() {

    // have to reload pages that have SpreadShop to force SpreadShop to reload
    // the basket from the Spreadshirt API and get any changes made here
    if(this.pageHasSpreadShop() && this.basketChanged)
        location.reload();
    else {
        $("#miniBasketContainer").toggle(false);
        $("#miniBasketBackground").toggle(false);
    }
};

//// BASKET METHODS ////

SpreadCartPlugin.prototype.clickUpdateListener = function() {
    var plugin = this;

    if(this.updateTimer !== null)
        clearTimeout(this.updateTimer);

    this.updateTriesLeft = this.config.updateTries;
    this.updateTimer = setTimeout(function() {
            plugin.tryUpdatingQuantity();
        }, this.config.updateMillis);
};

SpreadCartPlugin.prototype.tryUpdatingQuantity = function() {
    var plugin = this;

    this.loadBasket(function(loaded) {
        if(loaded) {
            if(plugin.lastTotalQuantity !== plugin.getBasketTotalQuantity())
                plugin.displayTotalQuantity();
            else {
                if(--plugin.updateTriesLeft > 0) {
                    plugin.updateTimer = setTimeout(function() {
                            plugin.tryUpdatingQuantity();
                        }, plugin.config.updateMillis);
                }
            }
        }
        else { // don't keep trying if basket is invalid
            plugin.updateTriesLeft = 0;
            plugin.displayTotalQuantity(); // display 0
        }
    });
};

SpreadCartPlugin.prototype.loadBasket = function(nextFunc) {

    // allow possibility that basket ID may dynamically change
    var shopBasketJSON = localStorage.getItem("mmBasket");
    var plugin = this;
    this.basketID = null;
    
    if(shopBasketJSON !== null && shopBasketJSON !== "") {
        var shopBasket = JSON.parse(shopBasketJSON);
        
        if(shopBasket !== null) {
            this.basketID = shopBasket.apiBasketId;
            this.requestReadBasket(nextFunc);
        }
    }
    
    // empty the basket if we ever lose the SpreadShop basket ID
    if(this.basketID === null) {
        this.basket = null;
        nextFunc();
    }
};

SpreadCartPlugin.prototype.getBasketTotalQuantity = function() {
    if(this.basket === null)
        return 0;
    return this.basket.getTotalQuantity();
};

SpreadCartPlugin.prototype.getCheckoutURL = function() {
    return "https://checkout.spreadshirt."+
            this.config.tld +"/?basketId="+ this.basketID +
            "&shopId="+ this.config.shopID +
            "&emptyBasketUrl="+ encodeURIComponent(this.config.returnURL);
}

//// SERVICE METHODS ////

SpreadCartPlugin.prototype.requestReadBasket = function(nextFunc) {
    var plugin = this;
    
    this.proxyRequest("read", this.basketID, {},
        function(data, status, xhr) {

            var basketDoc = jQuery.parseXML(xhr.responseJSON.xml);

            // update for successfully read (non-empty) basket
            if(jQuery(basketDoc).find('basketItem').length) {
                try {
                    plugin.basket = new SpreadCartBasket(basketDoc);
                }        
                catch(e) {
                    if(e instanceof ElementNotFoundException ||
                            e instanceof UnexpectedValueException)
                    {
                        alert(e.message);
                        // don't null the basket, in case it's temporary
                    }
                    else
                        throw e;
                }
                nextFunc(true);
            }
            
            // detect basket that becomes invalid after purchase
            else {
                plugin.basketID = null;
                plugin.basket = null;
                nextFunc(false);
            }
        });
};

SpreadCartPlugin.prototype.requestDeleteItem = function(itemID, itemDivID){
    var requestData = { "basketItemId": itemID };
    var plugin = this;

    this.proxyRequest("delete", this.basketID, requestData,
        function(data, status, xhr) {

            // provide the user with immediate feedback
            var itemDiv = jQuery('#'+ itemDivID);
            if(itemDiv.length) // if not already lost via loadBasket()
                itemDiv.remove();
            plugin.basketChanged = true;
                
            // reread the basket to get new shipping cost, etc.
            plugin.requestReadBasket(function(loaded) {
                plugin.displayTotalQuantity();
                plugin.updateCartTotals();
            });
        });
};

//// SUPPORT METHODS ////

SpreadCartPlugin.prototype.proxyRequest = function(action, basketID,
        requestData, successFunc) {

    var allRequestData = {
        "action": action,
        "platformTLD": this.config.tld,
        "basketId": basketID
    };

    var params = Object.keys(requestData);
    for(var i=0; i < params.length; ++i)
        allRequestData[params[i]] = requestData[params[i]];
    
    jQuery.ajax({
        url: this.config.proxyPath,
        type:'POST',
        data: allRequestData,
        dataType: "json",
        success: successFunc,
        error: this.ajaxError
    });
};

SpreadCartPlugin.prototype.ajaxError = function(xhr, status, err) {
    var msg = "unknown ajax error";

    if (xhr.status) {
        switch(xhr.status) {
        case 400:
            msg = xhr.responseText;
            break;
        case 404:
            msg = "proxy service not found";
            break;
        case 500:
            msg = xhr.responseJSON.message;
            break;
        }
    }
    alert("error: "+ msg);
};

// function to format prices properly. Basically defines that 2 decimals and a currency indicator is set
SpreadCartPlugin.prototype.formatPrice = function(value) {
    return value.toFixed(2)+""+this.strings.currencyIndicator;
};

//// INSTALLATION ////

//initiate basket when the document is ready
jQuery(document).ready(function() {

    // create cart on ready so cart config can be anywhere in page
    new SpreadCartPlugin(spreadCart_config, spreadCart_lang);
});

/******************************************************************************
SpreadCartBasket is a representation of the data in a SpreadShop shopping cart. It is initialized with the XML returned via the API for reading the cart.
******************************************************************************/

/** constructor. caller provides a jQuery object basketDoc representing the parsed XML document from the Spreadshirt API. caller must catch exceptions **/

function SpreadCartBasket(basketDoc) {
    // id (string)
    // basketItems[] (array)
    // . id (string)
    // . description (string)
    // . quantity (int)
    // . element
    // . . id (string)
    // . . properties[] (associative array)
    // . priceItem (priceInfo) - price per item without discounts
    // . price (priceInfo) - price per item with discounts
    // shipping
    // . priceItem (priceInfo)
    // . price (priceInfo)
    // priceItems (priceInfo) - total without shipping, without discounts
    // priceTotal (priceInfo) - total with shipping and discounts
    
    // each priceInfo is structured as follows:
    // . vatExcluded (float)
    // . vatIncluded (float)
    // . display (float)
    // . vat (float) - apparently only present in shipping element

    var $basket = jQuery(basketDoc).children('basket');
    var basket = this;
    
    // load basket-specific information
    
    this.id = basket.stringAttr($basket, 'basket', 'id');
    
    // load each basket item, if any
    
    this.basketItems = [];
    $basket.find('basketItem').each(function() {
        var $item = jQuery(this);
        var item = {};
        item.id = basket.stringAttr($item, "basketItem", 'id');
        item.description = basket.stringElem($item, 'description');
        item.quantity = basket.intElem($item, 'quantity');
        
        var $element = basket.getChildren($item, 'element');
        var element = item.element = {};
        element.id = basket.stringAttr($element, 'element', 'id');
        element.properties = {};
        $element.find('property').each(function() {
            var $property = jQuery(this);
            element.properties[$property.attr('key')] = $property.text();
        });
        
        item.priceItem = basket.getPriceInfo($item, 'priceItem');
        item.price = basket.getPriceInfo($item, 'price');
        
        basket.basketItems.push(item);
    });
    
    // load the shipping information
    
    var $shipping = basket.getChildren($basket, 'shipping');
    var shipping = basket.shipping = {};
    shipping.priceItem = basket.getPriceInfo($shipping, 'priceItem');
    shipping.price = basket.getPriceInfo($shipping, 'price');
    
    // load the shopping cart totals
    
    basket.priceItems = basket.getPriceInfo($basket, 'priceItems');
    basket.priceTotal = basket.getPriceInfo($basket, 'priceTotal');
}

//// ACCESSORS ////

SpreadCartBasket.prototype.getTotalQuantity = function() {
    var quantity = 0;

    for(var i=0; i < this.basketItems.length; ++i)
        quantity += this.basketItems[i].quantity;
    return quantity;
};

SpreadCartBasket.prototype.getDiscountedItemCost = function(itemIndex) {
    var item = this.basketItems[itemIndex];
    return item.quantity * item.price.vatExcluded;
};

SpreadCartBasket.prototype.getUndiscountedItemCost = function(itemIndex) {
    var item = this.basketItems[itemIndex];
    return item.quantity * item.priceItem.vatExcluded;
};

SpreadCartBasket.prototype.getDiscountedItemSubtotal = function() {
    var total = 0.0;
    for(var i=0; i < this.basketItems.length; ++i)
        total += this.getDiscountedItemCost(i);
    return total;
};

SpreadCartBasket.prototype.getUndiscountedItemSubtotal = function() {
    var total = 0.0;
    for(var i=0; i < this.basketItems.length; ++i)
        total += this.getUndiscountedItemCost(i);
    return total;
};

SpreadCartBasket.prototype.getShippingVat = function() {
    return this.shipping.price.vat;
};

SpreadCartBasket.prototype.getShippingCost = function() {
    return this.shipping.price.vatIncluded;
};

SpreadCartBasket.prototype.getDiscountedTotal = function() {
    return this.getDiscountedItemSubtotal() + this.getShippingCost();
};

SpreadCartBasket.prototype.getUndiscountedTotal = function() {
    return this.getUndiscountedItemSubtotal() + this.getShippingCost();
};

//// ELEMENT READERS ////

SpreadCartBasket.prototype.getChildren = function(parent, elemName) {

    var elem = parent.children(elemName);
    if (elem.length === 0)
        throw new ElementNotFoundException(elemName);
    return elem;
};

SpreadCartBasket.prototype.floatElem = function(parent, elemName) {
    return this.toFloat(elemName, this.getChildren(parent, elemName).text());
};

SpreadCartBasket.prototype.intElem = function(parent, elemName) {
    return this.toInt(elemName, this.getChildren(parent, elemName).text());
};

SpreadCartBasket.prototype.stringElem = function(parent, elemName) {
    return this.getChildren(parent, elemName).text();
};

SpreadCartBasket.prototype.stringAttr = function(elem, elemName, attrName) {

    var value = elem.attr(attrName);
    if (value === null)
        throw new ElementNotFoundException(elemName +":"+ attrName);
    return value;
};

SpreadCartBasket.prototype.getPriceInfo = function(parent, elemName) {

    var $priceInfo = this.getChildren(parent, elemName);
    var priceInfo = {};
    priceInfo.vatExcluded = this.floatElem($priceInfo, 'vatExcluded');
    priceInfo.vatIncluded = this.floatElem($priceInfo, 'vatIncluded');
    priceInfo.display = this.floatElem($priceInfo, 'display');
    
    var $vat = $priceInfo.children('vat');
    if ($vat.length !== 0)
        priceInfo.vat = this.toFloat('vat', $vat.text());
    return priceInfo;
}

//// LEXICAL PARSERS ////

SpreadCartBasket.prototype.toFloat = function(name, stringValue) {

    if (!jQuery.isNumeric(stringValue))
        throw new UnexpectedValueException(name, stringValue);
    return parseFloat(stringValue);
};

SpreadCartBasket.prototype.toInt = function(name, stringValue) {

    if (!jQuery.isNumeric(stringValue))
        throw new UnexpectedValueException(name, stringValue);
    return parseInt(stringValue);
};

//// Parsing Exceptions ////

function ElementNotFoundException(elemName) {
    this.message = "XML element <"+ elemName +"> not found";
}

function UnexpectedValueException(elemName, stringValue) {
    this.message = "Unexpected value in element <"+ elemName +">: "+
            stringValue;
}
