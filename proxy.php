<?php
$basketId=$_POST["basketId"];
$tld=$_POST["platformTLD"];
$action=$_POST["action"];

if($action=="update"){
    $basketItemId=$_POST["basketItemId"];
    $quantity=$_POST["quantity"];
    $productId=$_POST["productId"];
    $sizeId=$_POST["sizeId"];
    $appearanceId=$_POST["appearanceId"];
    $basketItemsURL = "api.spreadshirt.".$tld."/api/v1/baskets/".$basketId."/items/".$basketItemId;
    $basketItem = new SimpleXmlElement('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
					<basketItem xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://api.spreadshirt.net">
					<quantity>'.$quantity.'</quantity>
					<element id="'.$productId.'" type="sprd:product" xlink:href="http://api.spreadshirt.de/api/v1/shops/1070242/products/'.$productId.'">
					<properties>
					<property key="appearance">'.$appearanceId.'</property>
					<property key="size">'.$sizeId.'</property>
					</properties>
					</element>

					</basketItem>');
    $header = array();
    $header[] = createSprdAuthHeader("PUT", $basketItemsURL);
    $header[] = "Content-Type: application/xml";
    $ch = curl_init($basketItemsURL);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $basketItem->asXML());
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    echo json_encode("done");
//    die();



}


if($action=="read"){
    $basketURL = "api.spreadshirt.".$tld."/api/v1/baskets/".$basketId;
    $header = array();
    $header[] = createSprdAuthHeader("GET", $basketURL);
    $header[] = "Content-Type: application/xml";
    $ch = curl_init($basketURL);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
<<<<<<< HEAD
    header('Content-type:application/json; charset=utf-8');
    echo json_encode(array('xml' => $result));
=======
    echo '{"xml":'.json_encode($result).'}';
>>>>>>> refs/remotes/origin/master
}


if($action=="delete"){
    $basketItemId=$_POST["basketItemId"];
    $basketItemsURL = "api.spreadshirt.".$tld."/api/v1/baskets/".$basketId."/items/".$basketItemId;
    $header = array();
    $header[] = createSprdAuthHeader("DELETE", $basketItemsURL);
    $header[] = "Content-Type: application/xml";
    $ch = curl_init($basketItemsURL);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    echo json_encode("done");
}


if($action=="applyCoupon"){
    $apiKey=$_POST["apiKey"];
    $coupon = array("code" => $_POST["couponCode"]);
    $data_string = json_encode($coupon);
    $basketCouponsURL = "api.spreadshirt.".$tld."/api/v1/baskets/".$basketId."/coupons/?token=".$apiKey;
    $header = array();
    $header[] = createSprdAuthHeader("POST", $basketCouponsURL);
    $header[] = "Content-Type: application/json";
    $ch = curl_init($basketCouponsURL);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string)
        )
    );
    $result = curl_exec($ch);
    curl_close($ch);
    var_dump($result);




}



function createSprdAuthHeader($method, $url){
    $apiKey = "";
    $secret = "";
    $time = time()*1000;
    $data = "$method $url $time";
    $sig = sha1("$data $secret");
    return "Authorization: SprdAuth apiKey=\"".$apiKey."\", data=\"$data\", sig=\"$sig\"";
}

return;
