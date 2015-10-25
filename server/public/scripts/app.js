var currentIndex = 0;
var peopleArray = [];
var intervalIndex = 0;
var intervalTime = 10000;

$(document).ready(function(){
    $.ajax({
        type : "GET",
        url : "/data",
        success : function(data) {
            createCarousel(data);
        }
    });

    // event listener for the previous button
    $("#container").on('click', '#prevButton', function() {
        // stop animation so clicking through fast works.  Otherwise it shows the same person a few times before continuing.
        $(".personcontainer").find(".exists").stop(true, true);

        // slide to previous and restart set interval
        slidePrevious();
        restartInterval();
    });

    // event listener for the next button
    $("#container").on('click', '#nextButton', function() {
        // stop animation so clicking through fas works.  Otherwise it shows the same person a few times before continuing.
        $(".personcontainer").find(".exists").stop(true, true);

        // slide next and restart the interval
        slideNext();
        restartInterval();
    });

    // get the interval timing started
    runInterval();
});

function runInterval() {
    // start it up
    intervalIndex = setInterval(function(){ slideNext() }, intervalTime);
}

function restartInterval() {
    // stop the current interval
    clearInterval(intervalIndex);

    // start it up again, setting global var
    intervalIndex = setInterval(function(){ slideNext() }, intervalTime);
}

function createCarousel(data){
    // loop through the json object to get the objects
    // note that this will iterate once to return the zeta object of arrays
    for(var key in data) {
        // populate the global people array
        peopleArray = data[key];
    };

    // set up main containers on the page
    initializeDisplay(peopleArray);

    // display the first person
    displayPerson();
}

// show the person
function displayPerson() {
    // clear selected class to make index box blue
    $(".indexcontainer").find(".selected").removeClass("selected");

    // add selected class to div index to make current index box red
    $(".indexcontainer").find("#index"+ currentIndex).addClass("selected");

    // check if the person div exists, if so update the text there, otherwise append.
    if ($(".personcontainer").find(".exists").hasClass("exists")) {

        $(".personcontainer").find(".exists").fadeOut("slow", "swing", function () {
            $(".personcontainer").find(".name").text(peopleArray[currentIndex].name);
            $(".personcontainer").find("a").attr("href", peopleArray[currentIndex].github);
            $(".personcontainer").find("img").attr("src", peopleArray[currentIndex].imageURL);
            $(".personcontainer").find(".shoutout").text(peopleArray[currentIndex].shoutout);
        });
        $(".personcontainer").find(".exists").fadeIn();
    } else {
        $(".personcontainer").append("<div class='exists'>" +
                "<img src='" + peopleArray[currentIndex].imageURL + "'/>" +
            "<p class='name'>" + peopleArray[currentIndex].name + "</p>" +
            "<a href='" + peopleArray[currentIndex].github + "'>Github</a>" +
            "<p class='shoutout'>" + peopleArray[currentIndex].shoutout + "</p></div>");
    }
}

// set up the structure of the page
function initializeDisplay(array) {
    // create person container
    $("#container").append("<div class='personcontainer well'></div>");

    // create container for the indexes
    $("#container").append("<div class='indexcontainer'></div>");
    var $el = $("#container").children().last();

    // add indexes
    for(var i=0; i<array.length; i++){
        $el.append("<div class='indexpoint' id='index" + i + "'></div>");
    }

    // create nav buttons container
    $("#container").append("<div class='buttoncontainer'></div>");
    var $el = $("#container").children().last();

    // add previous and next buttons
    $el.append("<div id='prevButton' class='btn'>Previous</div>");
    $el.append("<div id='nextButton' class='btn'>Next</div>");
}

function slidePrevious(){

    // decrement current index
    currentIndex--;

    // if index < 0 , set index to array length-1
    if(currentIndex<0){
        currentIndex=peopleArray.length-1;
    }

    // call display person function
    displayPerson();
}

function slideNext(){

    // increase current index
    currentIndex++;

    // if index >= length , set index to 0
    if(currentIndex >= peopleArray.length){
        currentIndex = 0;
    }

    // call display person function
    displayPerson();
}
