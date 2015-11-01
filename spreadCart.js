basketContainer="myBasket";//id of the div the minibasket should use
tld="de"; //.com,.de,.co.uk or any other supported domain
shopID="0";//your shop id
mediaURL="//image.spreadshirtmedia.net/image-server/v1/products/";
returnURL= encodeURIComponent(window.location.href);// location from where the customer enters checkout

jQuery( document ).ready(function() {
    buildCustomMiniBasket();

    function getBasketData() {
        basketData = JSON.parse(localStorage.getItem("mmBasket"));
        return basketData;
    }

    function buildCustomMiniBasket(){
        totalQuantity=0;

        basketData=getBasketData();
        jQuery('#myBasket').empty();
        jQuery('#myBasket').append('<div id="miniBasket" class="miniBasketButton  viewBasketDetails">Show Basket</div><div id="miniBasketDetails" style="display:none"></div>');
        jQuery.each( basketData.orderListItems, function(index ){
            jQuery('#miniBasketDetails').append('<img src="'+mediaURL+basketData.orderListItems[index].productId+'"/>quantity:'+basketData.orderListItems[index].quantity+' size:'+basketData.orderListItems[index].sizeName+' name:'+basketData.orderListItems[index].ptName)
            totalQuantity+=basketData.orderListItems[index].quantity;
        });
        //jQuery('#miniBasket').append('<div id="totalQuantity">'+totalQuantity+'</div>');
        jQuery('#miniBasketDetails').append('<button class="miniBasketButton" id="checkoutLink">Go to Checkout</button>');
        jQuery('#checkoutLink').on("click",function(){window.location="https://checkout.spreadshirt."+tld+"/?basketId="+basketData.apiBasketId+"&shopId="+shopID+"&emptyBasketUrl="+returnURL});
        jQuery('#miniBasket').on("click",function(){showMiniBasket()});
    }

    function showMiniBasket(){
        $( "#miniBasketDetails" ).toggle( )
    }

});




	