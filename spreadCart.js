/**
Creates a shopping cart icon and a shopping cart at an indicated DIV. Must be configured via pluginSpreadCart_config and pluginSpreadCart_lang.
**/

function SpreadCartPlugin(config, stringsByLanguage) {
    // config - values from pluginSpreadCart_config
    // strings - values from a language of pluginSpreadCart_lang

    this.config = config;
    this.strings = stringsByLanguage[config.lang];

    if(config.showBasketIcon) {
        // only update if requested in order to allow this feature to sidestep
        // possible issues with evolving SpreadShop implementations
        var cart = this;
    
        window.onSpreadShopLoaded = function(e) {
            jQuery('#basketButton').remove();
            jQuery('#addToBasket').on("click", function() {
                cart.updateQuantity();
            });
        };
    }
}

//button to display minibasket is appended to defined basket container, binding function to display basket to button
SpreadCartPlugin.prototype.insertMiniBasketCaller = function() {
    var clickableID = '#'+this.config.clickTargetID;;
    var cart = this;
    
    if(this.config.showBasketIcon) {
        jQuery('#miniBasket').remove();
        jQuery(clickableID).append('<div id="miniBasket" '+
            'class="miniBasketButton  fa fa-shopping-cart fa-2x">'+
            '<div id="totalQuantity"></div></div>');
        clickableID = '#miniBasket';
    }

    jQuery(clickableID).on("click", function() {
        cart.showMiniBasket();
    });
};

SpreadCartPlugin.prototype.getItemTotal = function() {
    var basketData = this.getBasketData();
    var itemTotal = basketData.priceItems;
    return itemTotal;
};

SpreadCartPlugin.prototype.getBasketTotal = function() {
    var basketData = this.getBasketData();
    var basketTotal = basketData.priceTotal;
    return basketTotal;
};


SpreadCartPlugin.prototype.getShippingTotal = function() {
    var basketData = this.getBasketData();
    var shippingFee = basketData.priceShipping;
    return shippingFee;
};

SpreadCartPlugin.prototype.getBasketTotalQuantity = function() {
    var totalQuantity = 0;
    var basketData = this.getBasketData();
    
    jQuery.each(basketData.orderListItems, function(index) {
        totalQuantity += basketData.orderListItems[index].quantity;
    });
    return totalQuantity;
};

SpreadCartPlugin.prototype.getBasketData = function() {
    var basketData = JSON.parse(localStorage.getItem("mmBasket"));
    return basketData;
};

SpreadCartPlugin.prototype.buildCustomMiniBasket = function() {
    var basketData = this.getBasketData();
    var cart = this;
    
    this.insertMiniBasketCaller();
    jQuery("body").prepend('<div id="miniBasketBackground" style="display: none"></div>');
    jQuery('body').prepend('<div id="miniEmptyCart"><div id="miniEmptyNotice">'+
        this.strings.emptyCart+'</div><div id="miniEmptyOptions"></div></div>');
    jQuery('#miniEmptyOptions').append('<button class="miniBasketButton" id="miniCloseEmptyCart">'+this.strings.continueShopping+'</button>');
    jQuery('body').prepend('<div id="miniBasketDetails" style="display:none"></div>');

    if(this.strings.information) {
        jQuery('#miniBasketDetails').append('<div id="miniBasketInfo">'+
                this.strings.information+'</div>');
    }
    jQuery('#miniBasketDetails').append('<div id="miniBasketContent"></div>');
    jQuery('#miniBasketDetails').append('<div id="miniBasketFooter"></div>');
    jQuery('#miniBasketFooter').append('<div class="row"> <div class="miniBasketLabel">'+this.strings.itemsTotal+':</div> <div class="miniBasketLabel miniBasketPrice" id="priceItems"></div> </div>');
    jQuery('#miniBasketFooter').append('<div class="row"><div class="miniBasketLabel">'+this.strings.shippingFee+':</div> <div class="miniBasketLabel miniBasketPrice" id="priceShipping"></div> </div>');
    jQuery('#miniBasketFooter').append(' <div class="row topLine total"> <div class="miniBasketLabel">'+this.strings.total+':</div> <div class="miniBasketLabel miniBasketPrice" id="priceTotal"></div> </div><div class="Price>');
    if(this.strings.vatInformation) {
        jQuery('#miniBasketFooter').append('<div class="" style="font-size: 60%">'+this.strings.vatInformation+'</div> ');
    }
    if(this.strings.shippingInformation) {
        jQuery('#miniBasketFooter').append('<div class="" style="font-size: 60%">'+this.strings.shippingInformation+'</div>');
    }
    jQuery('#miniBasketFooter').append('<meta content="http://schema.org/InStock" itemprop="availability"></div></div>');
    jQuery('#miniBasketFooter').append('<div id="miniBasketOptions"></div>');
    jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="continueShoppingLink">'+this.strings.continueShopping+'</button>');
    jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="checkoutLink">'+this.strings.goToCheckout+'</button>');
    jQuery('#checkoutLink').on("click", function() {
        window.location = "https://checkout.spreadshirt."+
            cart.config.tld+"/?basketId="+basketData.apiBasketId+
            "&shopId="+cart.config.shopID+
            "&emptyBasketUrl="+cart.config.returnURL;
    });

    jQuery('#miniCloseEmptyCart').on("click", function() {
        cart.showMiniBasket();
    });
    jQuery('#continueShoppingLink').on("click", function() {
        cart.showMiniBasket();
    });
    jQuery('#miniBasketBackground').on("click", function() {
        cart.showMiniBasket();
    });
    this.updateBasketContent();
};

//function to toggle the display of the basket and the basket background.
SpreadCartPlugin.prototype.showMiniBasket = function() {
    var basketData = this.getBasketData();
    
    if(basketData === null || basketData.orderListItems === null ||
            basketData.orderListItems.length == 0)
        $( "#miniEmptyCart" ).toggle("display");
    else {
        $( "#miniBasketDetails" ).toggle("display");
        this.updateBasketContent();
    }
    $( "#miniBasketBackground" ).toggle("display");
};

//deletes selected item from basket. needs proxy.php to delete it from the API basket. also updates basket in local storage that is needed to display the basket
SpreadCartPlugin.prototype.deleteItem = function(id){
    var basketData = getBasketData();
    
    jQuery.ajax({
        url:'proxy.php',
        type:'POST',
        data:{
            "basketItemId":id,
            "basketId":basketData.apiBasketId,
            "platformTLD":this.config.tld
            }
        });
    for (var i=0;i<basketData.orderListItems.length;i++) {
        if(basketData.orderListItems[i].apiId===id) {
            basketData.priceTotal=basketData.priceTotal-(basketData.orderListItems[i].price*basketData.orderListItems[i].quantity);
            basketData.priceItems=basketData.priceItems-(basketData.orderListItems[i].price*basketData.orderListItems[i].quantity);
            basketData.orderListItems.splice(i,1);
        }
    }
    localStorage.setItem("mmBasket",JSON.stringify(basketData));
    this.updateBasketContent();
};

// function to format prices properly. Basically defines that 2 decimals and a currency indicator is set
SpreadCartPlugin.prototype.fixPrice = function(value) {
    return value.toFixed(2)+""+this.strings.currencyIndicator;
};

//function to update the minibasket after removing basket items
SpreadCartPlugin.prototype.updateBasketContent = function() {
    var basketData = this.getBasketData();
    var cart = this;
    
    jQuery('#miniBasketContent').html(" ");
    jQuery.each( basketData.orderListItems, function(index ){
        jQuery('#miniBasketContent').append('<div class="basketItem" id="basketItem-'+index+'"></div>');
        jQuery('#basketItem-'+index).append('<img style="width:30%" src="'+cart.config.mediaURL+basketData.orderListItems[index].productId+'?appearanceId='+basketData.orderListItems[index].appearanceId+'"/>');
        jQuery('#basketItem-'+index).append('<div class="basketItemInformation" id="basketItemInformation-'+index+'"></div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemName">'+basketData.orderListItems[index].ptName+'</div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemQuantity">'+cart.strings.quantity+": "+basketData.orderListItems[index].quantity+'</div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemSize">'+cart.strings.size+": "+basketData.orderListItems[index].sizeName+'</div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemColor">'+cart.strings.color+": "+basketData.orderListItems[index].appearanceName+'</div>');
        jQuery('#basketItem-'+index).append('<div class="basketItemPrice " style="display:inline">'+cart.fixPrice(basketData.orderListItems[index].price)+'</div>');
        if(cart.strings.deleteItem) {
            jQuery('#basketItemInformation-'+index).append('<div  class="miniBasketButton fa fa-trash"  style="padding-left:0px" id="delete-'+index+'">'+cart.strings.deleteItem+'</div>');
            jQuery('#delete-'+index).on("click",function() {
                cart.deleteItem(basketData.orderListItems[index].apiId)
            });
        }
    });
    
    var totalQuantity = this.getBasketTotalQuantity();
    var basketTotal = this.getBasketTotal();
    var itemTotal = this.getItemTotal();
    var shippingCosts = this.getShippingTotal();
    jQuery('#totalQuantity').html(totalQuantity);
    jQuery('#priceTotal').html(this.fixPrice(basketTotal));
    jQuery('#priceItems').html(this.fixPrice(itemTotal));
    jQuery('#priceShipping').html(this.fixPrice(shippingCosts));
    return true;
};

SpreadCartPlugin.prototype.updateQuantity = function() {
    var totalQuantity = this.getBasketTotalQuantity();
    jQuery('#totalQuantity').html(totalQuantity);
};

//initiate basket when the document is ready
jQuery(document).ready(function() {

    // create cart on ready so cart config can be anywhere in page
    var cart = new SpreadCartPlugin(
        pluginSpreadCart_config,
        pluginSpreadCart_lang
    );
    cart.buildCustomMiniBasket();
});


