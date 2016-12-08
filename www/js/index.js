/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    newDevice();
    oefeningenBelastbaarheid();
    devMode();
    evenwegGegevens();
    uiterlijkThema();
    resizeTiles();
    ratioExercises();
    evenwegStatus();
    oefeningenBekeken();
}

function newDevice() {
    var storage = window.localStorage;

    /// Uiterlijk
    if (!storage.getItem("uiterlijkThema")) {
        storage.setItem("uiterlijkThema", "thema1");
    }

    /// Oefeningen
    if (!storage.getItem("oefeningenBelastbaarheid")) {
        storage.setItem("oefeningenBelastbaarheid", "level3");
    }
    if (!storage.getItem("oefeningenGedaan")) {
        storage.setItem("oefeningenGedaan", "0");
    }
    
    /// Even weg
    if (!storage.getItem("evenwegStatus")) {
        storage.setItem("evenwegStatus", 0);
    }
    if (!storage.getItem("evenwegAfdeling")) {
        storage.setItem("evenwegAfdeling", "b");
    }
    if (!storage.getItem("evenwegNaam")) {
        storage.setItem("evenwegNaam", "Sangers");
    }
    if (!storage.getItem("evenwegTel")) {
        storage.setItem("evenwegTel", "0612345678");
    }
    
}

function oefeningenReset() {
    var storage = window.localStorage;
    storage.setItem("oefeningenGedaan", "0");
    alert("Alle bekeken oefeningen zijn gereset");
}

function oefeningenBekeken() {
    var storage = window.localStorage;

    var str = storage.getItem("oefeningenGedaan");
    var myarray = str.split(',');
    for(var i = 0; i < myarray.length; i++) {
        $(".exercise.item[data-exercise="+myarray[i]+"]").addClass("watched");
        $(".exercise.item[data-exercise="+myarray[i]+"]").children("div").addClass("watched");
        ratioExercises();
    }

    $(".exercise.item").click(function() {
        var exercise = $(this).data('exercise');
        if (exercise === undefined) {
            return false;
        }
        alert("Je hebt op oefening "+exercise+" geklikt. Omdat dit een prototype is wordt de video niet opgestart.");
        var pullData = storage.getItem("oefeningenGedaan");
        if (pullData.indexOf(exercise) > -1) {
            return false;
        }
        pullData += ","+exercise;
        console.log("newdata: "+pullData);
        storage.setItem("oefeningenGedaan", pullData);
        $(this).addClass("watched");
        $(this).children("div").addClass("watched");
        oefeningenBekeken();
        ratioExercises();
    })
}

function evenwegGegevens() {
    var storage = window.localStorage;
    $("select#evenAfdeling").val(storage.getItem("evenwegAfdeling"));
    $("input#evenwegAchternaam").val(storage.getItem("evenwegNaam"));
    $("input#evenwegMobiel").val(storage.getItem("evenwegTel"));

    $("button#evenwegSubmit").click(function() {
        var Afdeling = $("select#evenAfdeling").val();
        var Naam =  $("input#evenwegAchternaam").val();
        var Mobiel = $("input#evenwegMobiel").val();

        storage.setItem("evenwegAfdeling", Afdeling);
        storage.setItem("evenwegNaam", Naam);
        storage.setItem("evenwegTel", Mobiel);

        evenwegGegevens();
        alert("Gegevens zijn succesvol opgeslagen!");
    })
}

function evenwegStatus() {
    var storage = window.localStorage;

   if(storage.getItem("evenwegStatus") == 1) {
       $(".home#away .innerTile label.switch input").prop('checked', true);
   };

    /// Handmatige verandering
    $(".home#away .innerTile label.switch input").change(function () {
        if($(this).is(":checked")) {
            storage.setItem("evenwegStatus", 1);
            var Afdeling = storage.getItem("evenwegAfdeling");
            var d = new Date();
            var Datum = d.getDate()+"-"+d.getMonth();
            var Tijd = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            var Naam = storage.getItem("evenwegNaam");
            var Mobiel = storage.getItem("evenwegTel");

            alert("De volgende informatie wordt naar afdeling "+Afdeling+" gestuurd\n"+Datum+"     "+Tijd+"     "+Naam+"     "+Mobiel+"     ")
        } else {
            storage.setItem("evenwegStatus", 0);
            alert("De gegevens zijn verwijderd");
        }
    });

}

function uiterlijkThema() {
    var storage = window.localStorage;
    var currentTheme = storage.getItem("uiterlijkThema");

    var imgpath = "img/steps-"+currentTheme+"@4x.png";
    $(".home#steps .innerTile img").attr("src", imgpath);
    $("link[rel=stylesheet]").attr('href', "css/"+currentTheme+".css");
    /// CSS SHEET VERANDEREN ///
    $(".uiterlijk.thema#"+currentTheme).addClass("settingSelected");
    $(".uiterlijk.thema").on("click", function () {
        $(".uiterlijk.thema#"+currentTheme).removeClass("settingSelected");
        var newTheme = $(this).attr("id");
        storage.setItem("uiterlijkThema", newTheme);
        uiterlijkThema();
    })
}

function oefeningenBelastbaarheid() {
    var storage = window.localStorage;

    var currentBelast = storage.getItem("oefeningenBelastbaarheid");
    $(".oefeningen.level#"+currentBelast).addClass("settingSelected");
    $(".oefeningen.level").on("click", function () {
        $(".oefeningen.level#"+currentBelast).removeClass("settingSelected");
        var newBelast = $(this).attr("id");
        storage.setItem("oefeningenBelastbaarheid", newBelast);
        alert("Je hebt gekozen voor " + newBelast + ". Dit wordt wel opgeslagen, maar de uiteindelijke oefeningen zullen hetzelde zijn");
        oefeningenBelastbaarheid();
    })
}

function devMode() {
    $(".home#paths").click(function() {
        alert("Deze pagina is nog niet af, en is helaas niet te bekijken");
    });
    $(".home#questions").click(function() {
        alert("Deze pagina is nog niet af, en is helaas niet te bekijken");
    });
    $(".home#steps").click(function() {
        alert("De stappenteller is alleen grafisch uitgewerkt.");
    });
}

function resizeTiles() {
    var header = $("header").outerHeight(true);
    var physicalScreenHeight = $(window).height();
    var contentH = physicalScreenHeight - header;
    $(".content.resize").css("margin-top", header );
    $(".content.resize").css("height", contentH - header + 80);

    var content = $(".content").outerHeight(true);
    var divide = (content / 3) - 60;
    $(".tile-2x.resize, .tile-1x.resize").css("height", divide);
    var innerTileCalc = divide - ((25 / 100) * divide);
    $(".innerTile.resize").css("height", innerTileCalc);
    $(".innerTile.resize").css("width", innerTileCalc);

    $(".innerTile.resize100Alt").css("height", "80%");
    $(".innerTile.resize100Alt").css("width", "80%");
}

function ratioExercises() {
    var width = $(".content").width() - 10;
    $(".tile-1x.exercise.item").css({
        "width": width,
        "height": width*(9/16)
    });

    var heightItem = $(".tile-1x.exercise.item").height();
    var heightInfo = $(".exercise.item.info").height();
    var marginCalc = heightItem - heightInfo
    $(".exercise.item.info").css("margin-top", marginCalc);

    $(".tile-1x.exercise.item.watched").css("height", heightInfo + 10)
    $(".exercise.item.info.watched").css("margin-top", "0px");
}

