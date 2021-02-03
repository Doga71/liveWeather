const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var temp = [];
var weatherDescription = [];
var iconUrl = [];

app.get("/", function(req,res){
  res.render("weather");

});
app.get("/result",function(req,res){
  res.render("result",{resTemp: temp, resIcon: iconUrl, resDescription: weatherDescription});
});

app.post("/", function(req,res){

  const city = req.body.cityName;
  const appKey = "8d2c28d4f39cd0d4015bccce9e2e3534";
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid="+ appKey +"&units="+ unit;

   https.get(url, function(response){
     console.log(response.statusCode);
     console.log(url);

     response.on("data", function(data){
       const weatherData = JSON.parse(data);
        weatherDescription = weatherData.weather[0].description;
        temp = weatherData.main.temp;
        var icon = weatherData.weather[0].icon;
        iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
       // res.write("<p>Weather Description is : "+ weatherDescription + "<p>");
       // res.write("<h2>today temperature is "+ temp + " deg Celcius</h2>");
       // res.write("<img src=" + iconUrl + ">");
       // res.send();
       res.redirect("result");
     });

   });

});

app.listen(3000, function(){
  console.log("server is running on port 3000");
});
