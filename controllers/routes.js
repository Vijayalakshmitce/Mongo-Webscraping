
var mongoose = require("mongoose");
var db = require ("../models");
var axios = require ("axios");
var cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/homeWork", { useNewUrlParser: true });

module.exports = function(app){

    app.get("/scrape",function(req,res){

axios.get("https://www.huffpost.com").then(function(response){

var $ = cheerio.load(response.data);

$(".card--twilight").each(function(i,element){

    var result= {}
    result.title = $(this).find(".card__headline__text").text();
    result.link = $(this).find("a").attr("href");
    result.image = $(this).find("img").attr("src");
    db.Article.create(result).then(function(dbArticle){
        console.log(dbArticle);
    }).catch(function(error){
        console.log(error);
    });
    //db end closure here
});
//article each end closur here

res.send("scraped the cnn site");
});
//axios end clsoure here
    });
    //app get end clsoure here


app.get("/",function(req,res){

db.Article.find({}).then(function(dbArticle){

res.render("index",{Article: dbArticle})

}).catch(function(error){
    res.json(err);
});
//db end closure here

});
//get end clsoure


app.get("/article/:id",function(req,res){

    db.Note.create(req.body).then(function(dataNote){

    return db.Article.findOneAndUpdate({_id:req.params.id},{note: dataNote._id},{new: true});

    }).then(function(dataArticle){
        
        
            res.json(dataArticle);
      }).catch(function(error){
          res.json(error);
      });
  ;
    //db note create end clsoure here


});
//article end clsoure here

}
//module end clsoure here