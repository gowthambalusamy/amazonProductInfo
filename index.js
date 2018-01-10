var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();





function amazonProduct(mainurl,callback){
  
  mainurl = mainurl
  var  json={};

request(mainurl, function(error, response, html){
  
    if(!error){ 
     
      var $ = cheerio.load(html);
      var json ={};
      var productTitle = $("#productTitle").text().trim(); //product title
      var amountStrike = $(".a-text-strike").text().trim();
      var price = $("#priceblock_ourprice").text().trim(); //prodcut price
      var salePrice = null
      salePrice = $("#priceblock_saleprice").text().trim();
      
      var tmp_description = $("#productDescription").text().trim().replace(/\n/g, '');
      var description = tmp_description.replace(/\t/g, ''); //product description
      var isCODAvailable = true;
      var isFreeDeliveryAvailable = $("#price-shipping-message").text().trim() //pricinf message
      var stockAvailability = $("#availability").text().trim();
      var category = $(".zg_hrsr_ladder b").text().trim();
       var reviewCount = $("#acrCustomerReviewText").text().trim();
      var  ratings = $("#averageCustomerReviews").find('.a-icon-alt').text().trim();
      var features = [];
       var i = 0;
      $("#feature-bullets ul li").each(function(data,value){ 
        features [i]= $(this).children('span').text().trim()  // product features
        i++;
})
       var url = mainurl;
      json.url = mainurl;
      json.productTitle = productTitle;
      json.price = price;
      json.isFreeDeliveryAvailable = isFreeDeliveryAvailable;
      json.description = description;
      json.stockAvailability = stockAvailability;
      json.features = features;
      json.category = category;
      json.reviewCount = reviewCount;
      json.salePrice = salePrice;
      json.ratings = ratings;
      json.isCODAvailable = isCODAvailable;
      callback(json);
    }

  })

}

exports.handler = (event, context, callback) => {

 var url = 'https://www.amazon.in/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords='+ event.key;
var mainurl;
request(url, function(error, response, html){
if (!error && response.statusCode == 200) {
   var $ = cheerio.load(html);
   var productCheck;
   productCheck = $('#s-results-list-atf #result_0').find('h2').text().trim();
   if(productCheck == "Shop by Category")
   {
    mainurl = $('#s-results-list-atf #result_1').find('.a-row.a-spacing-none').children('a').attr('href');
    }
    else{
    mainurl = $('#s-results-list-atf #result_0').find('.a-row.a-spacing-none').children('a').attr('href');
    }
   //mainurl = $('#s-results-list-atf #result_0').find('.a-row.a-spacing-none').children('a').attr('href');
   // console.log(mainurl)
   var value = '123';
   amazonProduct(mainurl,function(data){
   console.log(data)
   callback(null,data)
   })

 }})

}


