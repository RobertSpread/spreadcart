basketContainer="myBasket";//id of the div the minibasket should use. needs to be an id not a class
tld="de"; //.com,.de,.co.uk or any other supported domain
shopID="0";//your shop id
mediaURL="//image.spreadshirtmedia.net/image-server/v1/products/";//base URl the images will be pulled from. Needed to display product images in the basket
returnURL= encodeURIComponent(window.location.href);// location from where the customer enters checkout
translations={};
translations.currencyIndicator="&euro;";//add the shop currency here
translations.continueShopping="Weiter Einkaufen";// link to close the basket aka. continue Shopping
translations.goToCheckout="Zum Checkout";//go to basket
translations.total="Gesamtbetrag:";//total of basket
translations.shippingTotal="Versandkosten:";//total of shipping
translations.itemsTotal="Zwischensumme:";//total price for items
translations.shippingInformation="inkl. Versand";//shipping information
translations.vatInformation="inkl. MwSt. EU";//cat information

//function to initiate basket when the document is ready
jQuery(document).ready(function(){
    buildCustomMiniBasket();
    });

//button to display minibasket is appended to defined basket container, binding function to display basket to button
function insertMiniBasketCaller(){
    jQuery('#miniBasket').remove();
    jQuery('#'+basketContainer).append('<div id="miniBasket" class="miniBasketButton  viewBasketDetails fa fa-shopping-cart"><div id="totalQuantity"></div></div>');
    jQuery('#miniBasket').on("click",function(){showMiniBasket()});
    }

function getItemTotal(){
    basketData = getBasketData();
    itemTotal=basketData.priceItems;
    return itemTotal;
    }

function getBasketTotal(){
    basketData = getBasketData()
    basketTotal=basketData.priceTotal;
    return basketTotal;
    }


function getShippingTotal(){
    basketData = getBasketData()
    shippingTotal=basketData.priceShipping;
    return shippingTotal;
}

function getBasketTotalQuantity(){
    totalQuantity=0;
    basketData = getBasketData();
    jQuery.each( basketData.orderListItems, function(index ) {
        totalQuantity += basketData.orderListItems[index].quantity;
        });
    return totalQuantity;
    }

function getBasketData() {
        basketData = JSON.parse(localStorage.getItem("mmBasket"));
        return basketData;
        }

function buildCustomMiniBasket(){
    basketData=getBasketData();
    insertMiniBasketCaller();
    jQuery("body").prepend('<div id="miniBasketBackground" style="display: none"></div>');
    jQuery('body').prepend('<div id="miniBasketDetails" style="display:none"></div>');
    jQuery('#miniBasketDetails').append('<div id="miniBasketContent"></div>');
    jQuery('#miniBasketDetails').append('<div id="miniBasketFooter"></div>');
    jQuery('#miniBasketFooter').append('<div class="row"> <div class="miniBasketLabel">'+translations.itemsTotal+'</div> <div class="miniBasketLabel miniBasketPrice" id="priceItems"></div> </div>');
    jQuery('#miniBasketFooter').append('<div class="row"><div class="miniBasketLabel">'+translations.shippingTotal+'</div> <div class="miniBasketLabel miniBasketPrice" id="priceShipping"></div> </div>');
    jQuery('#miniBasketFooter').append(' <div class="row topLine total"> <div class="miniBasketLabel">'+translations.total+'</div> <div class="miniBasketLabel miniBasketPrice" id="priceTotal"></div> </div><div class="Price" itemscope="null" itemtype="http://schema.org/Offer" itemprop="offers"><div class="Item vat customLink">'+translations.vatInformation+'</div> <div class="Item shipping customLink">'+translations.shippingInformation+'</div><meta content="http://schema.org/InStock" itemprop="availability"></div></div>');
    jQuery('#miniBasketFooter').append('<div id="miniBasketOptions"></div>');
    jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="continueShoppingLink" style="position: absolute;left:20px">'+translations.continueShopping+'</button>');
    jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="checkoutLink" style="position: absolute;right:20px">'+translations.goToCheckout+'</button>');
    jQuery('#checkoutLink').on("click",function(){window.location="https://checkout.spreadshirt."+tld+"/?basketId="+basketData.apiBasketId+"&shopId="+shopID+"&emptyBasketUrl="+returnURL});
    jQuery('#continueShoppingLink').on("click",function(){showMiniBasket()});
    updateBasketContent();
    }

//function to toggle the display of the basket and the basket background.
    function showMiniBasket(){
        $( "#miniBasketDetails" ).toggle("display");
        $( "#miniBasketBackground" ).toggle("display");
        updateBasketContent();
        }

//deletes selected item from basket. needs proxy.php to delete it from the API basket. also updates basket in local storage that is needed to display the basket
function deleteItem(id){
    basketData=getBasketData();
    jQuery.ajax({
        url:'proxy.php',
        type:'POST',
        data:{
            "basketItemId":id,
            "basketId":basketData.apiBasketId,
            "platformTLD":tld
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
    updateBasketContent();
    }


// function to format prices properly. Basically defines that 2 decimals and a currency indicator is set
function fixPrice(value){
    return value.toFixed(2)+""+translations.currencyIndicator;
    }

//function to update the minibasket after removing basket items
function updateBasketContent(){
    basketData=getBasketData();
    jQuery('#miniBasketContent').html("");
    jQuery.each( basketData.orderListItems, function(index ){
        jQuery('#miniBasketContent').append('<div class="basketItem" id="basketItem-'+index+'"></div>');
        jQuery('#basketItem-'+index).append('<img style="width:8em" src="'+mediaURL+basketData.orderListItems[index].productId+'"/>');
        jQuery('#basketItem-'+index).append('<div class="basketItemInformation" id="basketItemInformation-'+index+'"></div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemName">'+basketData.orderListItems[index].ptName+'</div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemQuantity">Quantity:'+basketData.orderListItems[index].quantity+'</div>');
        jQuery('#basketItemInformation-'+index).append('<div class="basketItemSize">Size:'+basketData.orderListItems[index].sizeName+'</div>');
        jQuery('#basketItem-'+index).append('<div class="basketItemPrice " style="display:inline">'+fixPrice(basketData.orderListItems[index].price)+'</div>');
        jQuery('#basketItemInformation-'+index).append('<button "class="miniBasketButton" id="delete-'+index+'" style="position: absolute;right:20px">Delete</button>');
        jQuery('#delete-'+index).on("click",function(){deleteItem(basketData.orderListItems[index].apiId)});
    });
    totalQuantity=getBasketTotalQuantity();
    basketTotal=getBasketTotal();
    itemTotal=getItemTotal();
    shippingCosts=getShippingTotal();
    jQuery('#totalQuantity').html(totalQuantity);
    jQuery('#priceTotal').html(fixPrice(basketTotal));
    jQuery('#priceItems').html(fixPrice(itemTotal));
    jQuery('#priceShipping').html(fixPrice(shippingCosts));

}