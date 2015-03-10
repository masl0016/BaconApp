document.addEventListener("DOMContentReady", init);
function init() {

    //not sure if i have too many DOMContent elements in this project

    document.addEventListener("deviceready", startApp);
}

    ///////////////////////////////////////////////////

    //tab stuff

    function startApp() {
        //now we can start to do the cool PhoneGap stuff.
        console.log("ack");
        FastClick.attach(document.body);
    }

    // JavaScript Document
    var pages = [], links = [];
    var numLinks = 0;
    var numPages = 0;
    var pageTime = 800;//same as CSS transition

    //create the pageShow type event.
    var pageshow = document.createEvent("CustomEvent");
    pageshow.initEvent("pageShow", false, true);

    document.addEventListener("DOMContentLoaded", function () {
        //device ready listener
        pages = document.querySelectorAll('[data-role="page"]');
        numPages = pages.length;
        links = document.querySelectorAll('[data-role="pagelink"]');
        numLinks = links.length;
        for (var i = 0; i < numLinks; i++) {
            links[i].addEventListener("click", handleNav, false);
        }
        //add the listener for pageshow to each page
        for (var p = 0; p < numPages; p++) {
            pages[p].addEventListener("pageShow", handlePageShow, false);
        }
        loadPage(null);
    });

    function handleNav(ev) {
        ev.preventDefault();
        var href = ev.target.href;
        if (href !== null && href !== 'undefined') {
            var parts = href.split("#");
            loadPage(parts[1]);
            //got some help with this bit since it kept causing errors
        }
        return false;
    }

    function handlePageShow(ev) {
        ev.target.className = "active";
        if (ev.currentTarget.id == "other") {
            var options = new ContactFindOptions();
            options.filter = "";
            //could search for a specific name
            options.multiple = true;
            //returns multiple results
            var fields = ["displayName", "name"];
            navigator.contacts.find(fields, onSuccess, onError, options);
        };
    }

    function loadPage(url) {
        if (url == null) {
            //home page first call
            pages[0].className = 'active';
            history.replaceState(null, null, "#home");
        } else {
            for (var i = 0; i < numPages; i++) {
                pages[i].className = "hidden";
                //get rid of all the hidden classes
                //but make them display block to enable anim.
                if (pages[i].id == url) {
                    pages[i].className = "show";
                    //add active to the proper page
                    history.pushState(null, null, "#" + url);
                    setTimeout(addDispatch, 50, i);
                }
            }
            //set the activetab class on the nav menu
            for (var t = 0; t < numLinks; t++) {
                links[t].className = "";
                if (links[t].href == location.href) {
                    links[t].className = "activetab";
                }
            }
        }
    }

    function addDispatch(num) {
        pages[num].dispatchEvent(pageshow);
        //num is the value i from the setTimeout call
        //using the value here is creating a closure
    }

    //anything above this i didn't mess with too much

    /////////////////

    //Geolocation

    document.addEventListener("DOMContentLoaded", function () {

        if (navigator.geolocation) {

            var params = { enableHighAccuracy: true, timeout: 3600, maximumAge: 60000 };

            navigator.geolocation.getCurrentPosition(reportPosition, gpsError, params);
        }

        else {
            alert("Sorry, but your browser does not support location based awesomeness.")
        }
    });


    function reportPosition(position) {
        var output = document.querySelector("#output");
        output.innerHTML += "Latitude: " + position.coords.latitude + "&deg;<br/>"
        + "Longitude: " + position.coords.longitude + "&deg;<br/>"
        + "Accuracy: " + position.coords.accuracy + "m<br/>";


        var canvs = document.createElement("canvas");
        document.getElementById("output").appendChild(canvs);
        //document.body.appendChild(canvs); is what was used in geo project and had to be changed
        //otherwise the map showed on all 3 pages
        canvs.id = 'myCanvas';
        var canvas = document.querySelector('#myCanvas');
        var context = canvas.getContext('2d');
        var img = document.createElement("img");

        canvas.width = 400;
        canvas.height = 400;
        img.onload = function () {
            context.drawImage(img, 0, 0);
        };
        img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=18&size=400x400&maptype=hybrid&markers=color:red|label:A|" + position.coords.latitude + ',' + position.coords.longitude;
        //im assuming a roadmap would load faster than a hybrid map?
    }

    function gpsError(error) {
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
            //I get the timeout error a lot on my app
        };
        alert("Error: " + errors[error.code]);
    }

    //////////////////

    //Contact Thing

    //http://docs.phonegap.com/en/edge/cordova_contacts_contacts.md.html found this page helpful for explaining the contacts
    //and this http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array for how to get a random contact

    function onSuccess(contacts) {
        var d = Math.floor(Math.random() * contacts.length);
        console.log(d);
        var ContRan = document.getElementById("contactd")
        //finds output for contact

        ContRan.innerHTML = "Name: " + contacts[d].name.formatted + "<br>" + "Phone #: " + contacts[d].phoneNumbers[0].value;
        //outputs contact
    };

    function onError() {
        console.log(":(")
    };
