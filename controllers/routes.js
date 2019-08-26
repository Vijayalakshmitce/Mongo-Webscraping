var mongoose = require("mongoose");
var db = require("../models");
var axios = require("axios");

var cheerio = require("cheerio");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/homeWork"
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {





    app.get("/scrape", function (req, res) {

        axios.get("https://www.huffpost.com").then(function (response) {

            var $ = cheerio.load(response.data);
            var hasErrors = false;
            var errors = [];

            $(".card--twilight").each(function (i, element) {

                var result = {}
                result.title = $(this).find(".card__headline__text").text();
                result.link = $(this).find("a").attr("href");
                result.image = $(this).find("img").attr("src");
                db.Article.create(result).then(function (dbArticle1) {
                    console.log(dbArticle1)
                }).catch(function (error) {
                    hasErrors = true;
                    errors.push(error);
                });
            });

            if (hasErrors) {
                res.json(errors)
            } else {
                res.render("scrape");
            }
            //article each end closur here

        });
        //axios end clsoure here
    });
    //app get end clsoure here


    app.get("/", function (req, res) {

        db.Article.find({}).then(function (dbArticle) {
            res.render("index", {
                Article: dbArticle
            })
        }).catch(function (error) {
            res.json(error);
        });
        //db end closure here

    });
    //get end clsoure

    app.get("/article/:id", function (req, res) {

        db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("note").then(function (dataArticle) {

                res.json(dataArticle)


            })
        //db note create end clsoure here
    });
    //article end clsoure here

    app.post("/postNote/:id", function (req, res) {

        db.Note.create(req.body).then(function (dbNote) {

            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    note: dbNote._id
                }
            }, {
                new: true
            });

        }).then(function (dbArticle) {
            res.json({
                "success": true
            })
        }).catch(function (error) {
            res.json(error);
        });
        //db note end closure  here

    });
    //post  end closure

    
app.get("/deleteNote/:id",function(req,res){
db.Note.findByIdAndRemove({
    _id: req.params.id
},function(err,removed){
    if(err){
        console.log(err)
    }
    else{
        //res.send(removed);
        ////
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                note: removed._id
            }
        }, {
            new: true
        }).then(function(removedArtNote){

        }).then(function(){
            res.send(removed)
        }).catch(function(err){
            console.log(err)
        });
    }
    //else end closure here
});
    //db end closure here
});
//app delete note end closure

app.get("/deleteAll/:id",function(req,res){
db.Note.findByIdAndRemove({
    _id: req.params.id
}).then(function(removedAllNote){
    res.send(removedAllNote)
}).catch(function(err){
    console.log(err);
});
//db end closure here
});
//get delete all end closure here



app.get("/savedArticle", function (req, res) {

    db.Article.find({
        userSaved : true
    }).then(function (dbArticle) {
        res.render("saved", {
            Article: dbArticle
        })
    }).catch(function (error) {
        res.json(error);
    });
    //db end closure here

});
//get end clsoure

app.get("/articleSaved/:id",function(req,res){

db.Article.findByIdAndUpdate({
    _id: req.params.id
},{
    userSaved: true
},{
    new: true
}).then(function(updatedArticle){
    res.send(updatedArticle);
}).catch(function(err){
    console.log(err)
});


});
//app get end closure here

}
//module end clsoure here