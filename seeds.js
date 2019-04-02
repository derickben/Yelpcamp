var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "/images/lite.png",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        
    },
    {
        name: "Canyon floor",
        image: "/images/lite2.png",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Desert Mesa",
        image: "/images/light.png",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
];

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if (err) {
            console.log(err);
        } 
        console.log("Camgrounds Removed");
         //Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err) {
                    console.log(err);
                } else{
                    console.log("Added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but i wish it had Internet",
                            author: "Holmer Salah"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else{
                               // console.log(campground.comments);
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created New Comment");
                                console.log("======================");
                        };
                    });
                
                
            };
        });
        
    });
    
}); 
};

module.exports  = seedDB;

