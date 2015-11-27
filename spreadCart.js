/**
 Creates a shopping cart icon and a shopping cart at an indicated DIV. Must be configured via spreadCart_config and spreadCart_lang.
 **/

//// CONSTANTS ////

var DEFAULT_ICON_ID = "spreadCartIcon"; // ID of plugin-provided cart icon

//// CONSTRUCTOR ////

function SpreadCartPlugin(config, stringsByLanguage) {
    // config - values from spreadCart_config
    // strings - values from a language of spreadCart_lang
    // showDefaultIcon - whether we're using the plugin-provided icon

    this.config = config;
    this.strings = stringsByLanguage[config.lang];
    this.showDefaultIcon = (this.config.clickTargetID == DEFAULT_ICON_ID);
    var cart = this;

    cart.buildCustomMiniBasket();

    window.onSpreadShopLoaded = function(e) {
        cart.buildCustomMiniBasket();
        if(cart.showDefaultIcon) {
            jQuery('#addToBasket').on("click", function() {
                cart.updateQuantity();
            });
        }
    };

    this.insertMiniBasketCaller();
    if(this.showDefaultIcon)
        this.updateQuantity();
}

//// PRESENTATION METHODS ////

//button to display minibasket is appended to defined basket container, binding function to display basket to button
SpreadCartPlugin.prototype.insertMiniBasketCaller = function() {
    var clickableID = '#'+this.config.clickTargetID;;
    var cart = this;

    if(this.showDefaultIcon) {
        jQuery('#miniBasket').remove();
        jQuery(clickableID).append('<div id="miniBasket" '+
        'class="fa fa-shopping-cart fa-2x">'+
        '<div id="totalQuantity"></div></div>');
        clickableID = '#miniBasket';
    }

    jQuery(clickableID).on("click", function() {
        cart.showMiniBasket();
    });
};

SpreadCartPlugin.prototype.buildCustomMiniBasket = function() {
    var basketData = this.getBasketData();
    var cart = this;

    if(!$('#emptyMiniBasketContainer').length) {

        jQuery('body').prepend('<div id="miniBasketBackground" style="display: none"></div>');
        jQuery('body').prepend('<div id="miniBasketContainer" style="display: none"></div>');
        jQuery('#miniBasketContainer').append('<div id="emptyMiniBasketContainer" style="display: none"></div>');
        jQuery('#emptyMiniBasketContainer').append('<div id="miniEmptyNotice">'+this.strings.emptyCart+'</div><div id="miniEmptyOptions"></div></div>');
        jQuery('#miniEmptyOptions').append('<button class="miniBasketButton" id="miniCloseEmptyCart">'+this.strings.continueShopping+'</button>');

        jQuery('#miniCloseEmptyCart').on("click", function() {
            cart.showMiniBasket();
        });
        jQuery('#miniBasketBackground').on("click", function() {
            cart.showMiniBasket();
        });
    }

    if(!$('#filledMiniBasketContainer').length && basketData !== null &&
        typeof basketData.apiBasketId !== "undefined") {

        jQuery('#miniBasketContainer').append('<div id="filledMiniBasketContainer" style="display: none"></div>');
        jQuery('#filledMiniBasketContainer').append('<div id="miniBasketDetails"></div>');

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

        jQuery('#continueShoppingLink').on("click", function() {
            cart.showMiniBasket();
        });
        this.updateBasketContent();
    }
};

//function to update the minibasket after removing basket items
SpreadCartPlugin.prototype.updateBasketContent = function() {
    var basketData = this.getBasketData();
    var cart = this;

    if(basketData === null || basketData.orderListItems === null || basketData.orderListItems.length == 0 ) {
        jQuery('#emptyMiniBasketContainer').css({"display":"inline"});
        jQuery('#filledMiniBasketContainer').css({"display":"none"});
    }

    else {
        jQuery('#emptyMiniBasketContainer').css({"display":"none"})
        jQuery('#filledMiniBasketContainer').css({"display":"inline"});

        jQuery('#miniBasketContent').html(" ");
        jQuery.each( basketData.orderListItems, function(index ){
            jQuery('#miniBasketContent').append('<div class="basketItem" id="basketItem-'+index+'"></div>');
            jQuery('#basketItem-'+index).append('<img style="width:30%" src="'+cart.config.mediaURL+basketData.orderListItems[index].productId+'?appearanceId='+basketData.orderListItems[index].appearanceId+'"/>');
            jQuery('#basketItem-'+index).append('<div class="basketItemInformation" id="basketItemInformation-'+index+'"></div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemName">'+basketData.orderListItems[index].ptName+'</div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemQuantity">'+cart.strings.quantity+':<div  style="padding-left:0px"><input id="newQuantity-'+index+'" type="number" value="'+basketData.orderListItems[index].quantity+'"> <i id="updateQuantity-'+index+'" class="fa fa-refresh">Update</i></div></div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemSize">'+cart.strings.size+": "+basketData.orderListItems[index].sizeName+'</div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemColor">'+cart.strings.color+": "+basketData.orderListItems[index].appearanceName+'</div>');
            jQuery('#basketItem-'+index).append('<div class="basketItemPrice " style="display:inline">'+cart.fixPrice(basketData.orderListItems[index].price)+'</div>');
            if(cart.strings.deleteItem) {
                jQuery('#basketItemInformation-'+index).append('<div  class="miniBasketButton fa fa-trash"  style="padding-left:0px" id="delete-'+index+'"><a>'+cart.strings.deleteItem+'</a></div>');
                jQuery('#delete-'+index).on("click",function() {
                    cart.deleteItem(basketData.orderListItems[index].apiId)

                });
                jQuery('#updateQuantity-'+index).on("click",function() {
                    cart.updateItem(basketData.orderListItems[index].apiId,jQuery('#newQuantity-'+index).val( ),basketData.orderListItems[index].apiProductId,basketData.orderListItems[index].appearanceId,basketData.orderListItems[index].sizeId)

                });
            }
        });

        var basketTotal = basketData.priceTotal;
        var itemTotal = basketData.priceItems;
        var shippingCosts = basketData.priceShipping;
        jQuery('#priceTotal').html(this.fixPrice(basketTotal));
        jQuery('#priceItems').html(this.fixPrice(itemTotal));
        jQuery('#priceShipping').html(this.fixPrice(shippingCosts));
    }

    this.updateQuantity();
    return true;
};

//function to toggle the display of the basket and the basket background.
SpreadCartPlugin.prototype.showMiniBasket = function() {
    var basketData = this.getBasketData();
    $( "#miniBasketContainer" ).toggle("display");
    $( "#miniBasketBackground" ).toggle("display");
    this.updateBasketContent();
};

//// SERVICE METHODS ////

//deletes selected item from basket. needs proxy.php to delete it from the API basket. also updates basket in local storage that is needed to display the basket
SpreadCartPlugin.prototype.deleteItem = function(id){
    var basketData = this.getBasketData();
    var cart = this;
    var request=jQuery.ajax({
        url: this.config.proxyPath,
        type:'POST',
        data:{
            "operation": "delete",
            "basketItemId":id,
            "basketId":basketData.apiBasketId,
            "platformTLD":this.config.tld
        },
        dataType: "json",
        success: function(data, status, xhr) {
            for (var i=0; i < basketData.orderListItems.length; i++) {
                if(basketData.orderListItems[i].apiId===id) {
                    basketData.priceTotal = basketData.priceTotal -
                    (basketData.orderListItems[i].price*
                    basketData.orderListItems[i].quantity);
                    basketData.priceItems = basketData.priceItems -
                    (basketData.orderListItems[i].price*
                    basketData.orderListItems[i].quantity);
                    basketData.orderListItems.splice(i,1);
                    cart.putBasketData(basketData);
                    cart.updateBasketContent();

                }
            };


        },

        error: this.ajaxError
    });

};


SpreadCartPlugin.prototype.updateItem = function(id,quantity,productId,appearanceId,sizeId){
    var basketData = this.getBasketData();
    var cart = this;

    jQuery.ajax({
        url: this.config.proxyPath,
        type:'POST',
        data:{
            "operation": "update",
            "basketItemId":id,
            "quantity":quantity,
            "productId":productId,
            "appearanceId":appearanceId,
            "sizeId":sizeId,
            "basketId":basketData.apiBasketId,
            "platformTLD":this.config.tld
        },
        dataType: "json",

        success: function(data, status, xhr) {
            for (var i=0; i < basketData.orderListItems.length; i++) {
                if(basketData.orderListItems[i].apiId===id) {
                    basketData.priceTotal = basketData.priceTotal -
                    (basketData.orderListItems[i].price*
                    basketData.orderListItems[i].quantity)+basketData.orderListItems[i].price*quantity;
                    basketData.priceItems = basketData.priceItems -
                    (basketData.orderListItems[i].price*
                    basketData.orderListItems[i].quantity)+basketData.orderListItems[i].price*quantity;
                    basketData.orderListItems[i].quantity=quantity;
                    cart.putBasketData(basketData);
                    cart.updateBasketContent();

                }
            }

        },

        error: this.ajaxError
    });
};


//// BASKET METHODS ////

SpreadCartPlugin.prototype.getBasketData = function() {
    var basketData = JSON.parse(localStorage.getItem("mmBasket"));
    return basketData;
};

SpreadCartPlugin.prototype.putBasketData = function(basketData) {
    localStorage.setItem("mmBasket", JSON.stringify(basketData));
};

SpreadCartPlugin.prototype.getBasketTotalQuantity = function() {
    var totalQuantity = 0;
    var basketData = this.getBasketData();

    if (basketData !== null && basketData.orderListItems !== null) {
        jQuery.each(basketData.orderListItems, function(index) {
            totalQuantity += basketData.orderListItems[index].quantity;
        });
    }
    return totalQuantity;
};

SpreadCartPlugin.prototype.updateQuantity = function() {
    var totalQuantity = this.getBasketTotalQuantity();
    jQuery('#totalQuantity').html(totalQuantity);
};

//// SUPPORT METHODS ////

// function to format prices properly. Basically defines that 2 decimals and a currency indicator is set
SpreadCartPlugin.prototype.fixPrice = function(value) {
    return value.toFixed(2)+""+this.strings.currencyIndicator;
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
    //alert("error: "+ msg);
};

//// INSTALLATION ////

//initiate basket when the document is ready
jQuery(document).ready(function() {

    // create cart on ready so cart config can be anywhere in page
    new SpreadCartPlugin(spreadCart_config, spreadCart_lang);
});


