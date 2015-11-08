<?php
$basketId=$_POST["basketId"];
$basketItemId=$_POST["basketItemId"];
$basketItemsURL = "api.spreadshirt.de/api/v1/baskets/".$basketId."/items/".$basketItemId;
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
die();




function createSprdAuthHeader($method, $url)
{
    $apiKey = "4a12747f-0963-4cc7-9bb3-1d2e0ee32eae";
    $secret = "da914243-20df-4bcd-a2ef-91c60b7e1a97";
    $time = time()*1000;
    $data = "$method $url $time";
    $sig = sha1("$data $secret");

    //return 'Authorization: SprdAuth apiKey='.$apiKey.', data='.$data.', sig='.$sig;
    return "Authorization: SprdAuth apiKey=\"".$apiKey."\", data=\"$data\", sig=\"$sig\"";
}
