basketContainer="myBasket";//id of the div the minibasket should use
tld="de"; //.com,.de,.co.uk or any other supported domain
shopID="0";//your shop id
mediaURL="//image.spreadshirtmedia.net/image-server/v1/products/";
returnURL= encodeURIComponent(window.location.href);// location from where the customer enters checkout
totalQuantity=0;
updateCycle=0;

jQuery( document ).ready(function() {
    buildCustomMiniBasket();

    function getBasketData() {
        basketData = JSON.parse(localStorage.getItem("mmBasket"));
        return basketData;
    }

    function buildCustomMiniBasket(){
        basketData=getBasketData();
        jQuery('#miniBasket').remove();
        jQuery('#'+basketContainer).append('<div id="miniBasket" class="miniBasketButton  viewBasketDetails fa fa-shopping-cart"> Show Basket</div>');
        jQuery('#'+basketContainer).append('<div id="miniBasketDetails" style="display:none"></div>');
        jQuery.each( basketData.orderListItems, function(index ){
            jQuery('#miniBasketDetails').append('<div class="basketItem" id="basketItem-'+index+'"></div>');
            jQuery('#basketItem-'+index).append('<img style="width:8em" src="'+mediaURL+basketData.orderListItems[index].productId+'"/>');
            jQuery('#basketItem-'+index).append('<div class="basketItemInformation" id="basketItemInformation-'+index+'"></div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemName">'+basketData.orderListItems[index].ptName+'</div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemQuantity">Quantity:'+basketData.orderListItems[index].quantity+'</div>');
            jQuery('#basketItemInformation-'+index).append('<div class="basketItemSize">Size:'+basketData.orderListItems[index].sizeName+'</div>');
            jQuery('#basketItem-'+index).append('<div class="basketItemPrice" style="display:inline">'+basketData.orderListItems[index].price+'</div>')
            totalQuantity+=basketData.orderListItems[index].quantity;
        });
        jQuery('#miniBasketDetails').append('<div class="total" id="">Total:'+basketData.priceTotal+'</div>');
        jQuery('#miniBasket').html('<div id="totalQuantity">'+totalQuantity+'</div>');
        jQuery('#miniBasketDetails').append('<div id="miniBasketFooter"></div>');
        jQuery('#miniBasketFooter').append('<button class="miniBasketButton" id="continueShoppingLink" style="position: absolute;left:20px">Continue Shopping</button>');
        jQuery('#miniBasketFooter').append('<button class="miniBasketButton" id="checkoutLink" style="position: absolute;right:20p"x>Go to Checkout</button>');
        jQuery('#checkoutLink').on("click",function(){window.location="https://checkout.spreadshirt."+tld+"/?basketId="+basketData.apiBasketId+"&shopId="+shopID+"&emptyBasketUrl="+returnURL});
        jQuery('#miniBasket').on("click",function(){showMiniBasket()});
        jQuery('#continueShoppingLink').on("click",function(){showMiniBasket()});

    }

    function showMiniBasket(){
        $( "#miniBasketDetails" ).toggle( )
    }

    function updateMiniBasket(){
        buildCustomMiniBasket()
    }
});


//<h1 class="headline customHeader">Warenkorb</h1>
//<div class="items" id="basket-items">
//<div class="item product item-6_5_101807398">
//<div class="button favorite customButton default item"></div>
//<a class="productTypeName top customHeadline" href="http://shop.spreadshirt.de/goats/-A101807398?department=1&amp;productType=6&amp;color=F51E30&amp;appearance=5&amp;size=6">Männer T-Shirt</a>
//<img class="Image" src="//image.spreadshirtmedia.net/image-server/v1/products/128253997,width=400,height=400,appearanceId=5.png" draggable="false"> <div class="information"> <div class="items"> <a class="productTypeName customHeadline" href="http://shop.spreadshirt.de/goats/-A101807398?department=1&amp;productType=6&amp;color=F51E30&amp;appearance=5&amp;size=6">Männer T-Shirt</a> <div class="item" id="color-5">Rot</div> <div class="item" id="size-6">XXL</div> </div> <div class="quantityControl customButton item"><div class="Icon decrease inputElement button customButton default trash">d</div><div class="inputWrapper inputElement"><input type="text" class="textInput quantity customPageBackground"></div><div class="Icon increase inputElement button customButton default">+</div></div> </div> <div class="Price"> <div class="item price">16,90 €</div> </div></div></div><div class="costDetails"><div class="row"><div class="label">Zwischensumme:</div><div class="price" id="price-raw-bottom">16,90 €</div></div><div class="row hidden"><div class="label">Mengenrabatt:</div><div class="price discount" id="price-discount-bottom">-0,00 €</div></div><div class="row"><div class="label">Versandkosten:</div><div class="price" id="price-shipping-bottom">2,90 €</div></div><div class="row topLine total"><div class="label bold">Gesamt:</div><div class="price bold" id="price-total-bottom">19,80 €</div></div><div class="Price" itemscope="null" itemtype="http://schema.org/Offer" itemprop="offers"><div class="Item vat customLink">inkl. MwSt. EU</div><div class="Item shipping customLink">inkl. Versand</div><meta content="http://schema.org/InStock" itemprop="availability"></div></div><div class="label promo-message not-checked">Einlösen des Gutscheins folgt</div><div class="footer"><div class="Wrapper"><div class="buttons cta"><div class="button primary checkout customButton inline-block">Zur Kasse</div><a class="button goShopping customButton default">Weiter einkaufen</a></div><div class="label Row textRight shippingTime customLink">Lieferzeit: ca. 3-5 Werktage</div><div class="Service information topLine solid is-shop"><div class="header">Persönlicher Service: Mo-Fr 8-17 Uhr</div><div class="contact"><span class="skype_c2c_print_container notranslate">0341 59 400 5900</span><span data-ismobile="false" data-isrtl="false" data-isfreecall="false" data-numbertype="paid" data-numbertocall="+49341594005900" onclick="SkypeClick2Call.MenuInjectionHandler.makeCall(this, event)" onmouseout="SkypeClick2Call.MenuInjectionHandler.hideMenu(this, event)" onmouseover="SkypeClick2Call.MenuInjectionHandler.showMenu(this, event)" tabindex="-1" dir="ltr" class="skype_c2c_container notranslate" id="skype_c2c_container"><span skypeaction="skype_dropdown" dir="ltr" class="skype_c2c_highlighting_inactive_common"><span id="non_free_num_ui" class="skype_c2c_textarea_span"><img width="0" height="0" src="resource://skype_ff_extension-at-jetpack/skype_ff_extension/data/call_skype_logo.png" class="skype_c2c_logo_img"><span class="skype_c2c_text_span">0341 59 400 5900</span><span class="skype_c2c_free_text_span"></span></span></span></span></div></div></div></div></div>

	