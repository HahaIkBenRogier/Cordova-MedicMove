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

function showModel() {
    alert(device.model);
    var physicalScreenWidth = window.screen.width * window.devicePixelRatio;
    var physicalScreenHeight = window.screen.height * window.devicePixelRatio;
    alert("W = " + physicalScreenWidth + " H = " + physicalScreenHeight);
}



document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    Stappenteller();
    Away();
    resizeTiles();
    clickExercises();
    ratioExercises();
}

function resizeTiles() {
    var header = $("header").outerHeight(true);
    var physicalScreenHeight = window.screen.height * window.devicePixelRatio;
    if (device.model === "Chrome") {
        physicalScreenHeight = $(window).height();
    }
    var contentH = physicalScreenHeight - header;
    $(".content.resize").css("margin-top", header );
    $(".content.resize").css("height", contentH - header);

    var content = $(".content").outerHeight(true);
    var divide = (content / 3) -10;
    $(".tile-2x.resize, .tile-1x.resize").css("height", divide);
}

function clickExercises() {
    $(".tile-1x.exercise.level").click(function() {
        var lvl = $(this).attr('rel');
        $(".exercise.labels").hide();
        $(".exercise.list-"+lvl).show();
    })
}

function ratioExercises() {
    var width = $(".exercise.labels").width() - 10;
    $(".tile-1x.exercise.item").css({
        "width": width,
        "height": width*(9/16)
    })
}

function Stappenteller() {
    if (device.platform === "Android" || device.platform === "iOS") {
        function healthCheck() {
            navigator.health.isAvailable(successCallback, errorCallback)
        }
        
        function successCallback(available) {
            alert("Feessie!!");
            alert(available);
        }
        function errorCallback(err) {
            alert("Neen");
            alert(err);
        }
    } else {
        jQuery(".tile-1x#steps").text(device.platform + " ondersteunt onze stappenteller niet..");
    }
}

function Away() {
    var storage = window.localStorage;
    if (!storage.getItem("away")) {
        storage.setItem("away", 0)
        jQuery(".tile-2x#away").addClass("away-off");
    } if (storage.getItem("away")) {
       if (storage.getItem("away") === "0") {
           jQuery(".tile-2x#away").addClass("away-off");
       } if (storage.getItem("away") === "1") {
           jQuery(".tile-2x#away").addClass("away-on");
       }
    }

    jQuery(".tile-2x#away").click(function (){
        $(this).toggleClass("away-off away-on");
        if ($(this).hasClass("away-off")) {
            storage.setItem("away", 0)
        } if ($(this).hasClass("away-on")) {
            storage.setItem("away", 1)
        } 
    })
}