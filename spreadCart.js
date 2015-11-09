basketContainer="myBasket";//id of the div the minibasket should use
tld="de"; //.com,.de,.co.uk or any other supported domain
shopID="0";//your shop id
mediaURL="//image.spreadshirtmedia.net/image-server/v1/products/";
returnURL= encodeURIComponent(window.location.href);// location from where the customer enters checkout
updateCycle=0;
translations={}
translations.currencyIndicator="$";
translations.continueShopping="Continue Shopping";
translations.goToCheckout="Go to Checkout";
translations.total="Total:";
translations.shippingTotal="Shipping Cots:"
translations.itemsTotal="Items Total";

jQuery( document ).ready(function() {
    buildCustomMiniBasket();
    });

function insertMiniBasketCaller(){
    jQuery('#miniBasket').remove();
    jQuery('#'+basketContainer).append('<div id="miniBasket" class="miniBasketButton  viewBasketDetails fa fa-shopping-cart"><div id="totalQuantity"></div></div>');
    jQuery('#miniBasket').on("click",function(){showMiniBasket()});
    }

function updateMiniBasketQuantity(){
    totalQuantity=getBasketTotalQuantity()
    jQuery('#totalQuantity').html(totalQuantity);
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


function deleteBasketItem(){

}

function addBasketItem(){

}

function buildCustomMiniBasket(){
    basketData=getBasketData();
    insertMiniBasketCaller();
    updateMiniBasketQuantity()
    jQuery("body").append('<div id="miniBasketBackground" style="display: none"></div>')
    jQuery('body').append('<div id="miniBasketDetails" style="display:none"></div>');
    jQuery('#miniBasketDetails').append('<div id="miniBasketContent"></div>');
    jQuery('#miniBasketDetails').append('<div id="miniBasketFooter"></div>');

    jQuery.each( basketData.orderListItems, function(index ){
            jQuery('#miniBasketContent').append('<div class="basketItem" id="basketItem-'+index+'"></div>');
            jQuery('#basketItem-'+index).append('<img style="width:8em" src="'+mediaURL+basketData.orderListItems[index].productId+'"/>');
            jQuery('#basketItem-'+index).append('<div class="basketItemInformation" id="basketItemInformation-'+index+'"></div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemName">'+basketData.orderListItems[index].ptName+'</div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemQuantity">Quantity:'+basketData.orderListItems[index].quantity+'</div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemSize">Size:'+basketData.orderListItems[index].sizeName+'</div>');
            jQuery('#basketItem-'+index).append('<div class="basketItemPrice " style="display:inline">'+fixPrice(basketData.orderListItems[index].price)+'</div>')
        jQuery('#basketItemInformation-'+index).append('<button "class="miniBasketButton" id="delete-'+index+'" style="position: absolute;right:20px">Delete</button>');
        jQuery('#delete-'+index).on("click",function(){deleteItem(basketData.orderListItems[index].apiId)});

    });

    jQuery('#miniBasketFooter').append('<div class="row"> <div class="miniBasketLabel">'+translations.itemsTotal+'</div> <div class="miniBasketLabel miniBasketPrice" id="priceItems">'+fixPrice(basketData.priceItems)+'</div> </div>');
    jQuery('#miniBasketFooter').append('<div class="row"><div class="miniBasketLabel">'+translations.shippingTotal+'</div> <div class="miniBasketLabel miniBasketPrice" id="price-shipping-bottom">'+fixPrice(basketData.priceShipping)+'</div> </div>');
    jQuery('#miniBasketFooter').append(' <div class="row topLine total"> <div class="miniBasketLabel">'+translations.total+'</div> <div class="miniBasketLabel miniBasketPrice" id="price-total">'+fixPrice(basketData.priceTotal)+'</div> </div><div class="Price" itemscope="null" itemtype="http://schema.org/Offer" itemprop="offers"><div class="Item vat customLink">inkl. MwSt. EU</div> <div class="Item shipping customLink">inkl. Versand</div><meta content="http://schema.org/InStock" itemprop="availability"></div></div>')
    jQuery('#miniBasketFooter').append('<div id="miniBasketOptions"></div>');
        jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="continueShoppingLink" style="position: absolute;left:20px">'+translations.continueShopping+'</button>');
        jQuery('#miniBasketOptions').append('<button class="miniBasketButton" id="checkoutLink" style="position: absolute;right:20px">'+translations.goToCheckout+'</button>');
        jQuery('#checkoutLink').on("click",function(){window.location="https://checkout.spreadshirt."+tld+"/?basketId="+basketData.apiBasketId+"&shopId="+shopID+"&emptyBasketUrl="+returnURL});
        jQuery('#continueShoppingLink').on("click",function(){showMiniBasket()});

    }

    function showMiniBasket(){
        $( "#miniBasketDetails" ).toggle("display");
        $( "#miniBasketBackground" ).toggle("display");
        }


function deleteItem(id){
    basketData=getBasketData()
    jQuery.ajax({
        url:'proxy.php',
        data:{"basketItemId":id,
            "basketId":basketData.apiBasketId,
        "platformTLD":tld},
        type:'POST'
    });
    for (var i=0;i<basketData.orderListItems.length;i++) {
        if (basketData.orderListItems[i].apiId===id) {
            basketData.priceTotal=basketData.priceTotal-(basketData.orderListItems[i].price*basketData.orderListItems[i].quantity);
            basketData.priceItems=basketData.priceItems-(basketData.orderListItems[i].price*basketData.orderListItems[i].quantity);
            basketData.orderListItems.splice(i,1)
            jQuery('#basketItem-'+i).remove()

        }
    }
    localStorage.setItem("mmBasket",JSON.stringify(basketData));
    updateTotal(basketData.priceTotal,basketData.priceItems)
}


function updateTotal(newTotal,newItemTotal){
    jQuery('#price-total').html(fixPrice(newTotal));
    jQuery('#priceItems').html(fixPrice(newItemTotal));
}

function fixPrice(value){
    return value.toFixed(2)+""+translations.currencyIndicator

}