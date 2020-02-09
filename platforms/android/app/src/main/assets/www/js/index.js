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

  var app= {
     querySelect: {
            appWrap :document.getElementById('app-wrap'),
            butPlay :document.getElementById('button_on_off'),
            volDown :document.getElementById('volDown'),
            volUp :document.getElementById('volUp'),
            alertEl :document.getElementById('alert-text'),
            buttonSm :document.getElementById('button-sm'),
            displayTime :document.getElementById('display-time'),
            wrapVol: document.getElementById('wrap-vol'),
            indexLi :document.querySelectorAll('.indicator_block li'),
            errorText : document.getElementById('error_text')
    },

    track: {
        src: 'http://stream.zeno.fm/qd8hws5efseuv',
        title: 'Fight Club Rules',
        volume: 0.5,
        mediaTimer: null
    },
    media:null,
    status:{
        '0':'MEDIA NONE',
        '1':'MEDIA STARTING',
        '2':'MEDIA RUNNING',
        '3':'MEDIA PAUSED',
        '4':'MEDIA STOPPED'
    },
    err:{
        '0':'UNDEFIND ERROR',
        '1':'MEDIA ERR ABORTED',
        '2':'MEDIA ERR NETWORK',
        '3':'MEDIA ERR DECODE',
        '4':'MEDIA ERR NONE SUPPORTED'
    },

    init: function(){
        document.addEventListener('deviceready', app.ready, false);
    },
    ready: function(){
        //app.queryMap = app.querySelect;
        //var n = this.track.volume;
        //document.querySelectorAll(.indicator_block li:nth-child(n));


        app.checkConnection();
        let src = app.track.src;
        app.statusConnect = true;
        app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        app.calcVol(app.track.volume );
        app.addListeners();

    },
    checkConnection: function checkConnection() {
                         var networkState = navigator.connection.type;
                         var states = {};
                         states[Connection.UNKNOWN]  = 'Unknown connection';
                         states[Connection.ETHERNET] = 'Ethernet connection';
                         states[Connection.WIFI]     = 'WiFi connection';
                         states[Connection.CELL_2G]  = 'Cell 2G connection';
                         states[Connection.CELL_3G]  = 'Cell 3G connection';
                         states[Connection.CELL_4G]  = 'Cell 4G connection';
                         states[Connection.CELL]     = 'Cell generic connection';
                         states[Connection.NONE]     = 'No network connection';
                         document.querySelector(".network_info").innerHTML = states[networkState] + "";
                         app.connectionState = states;
                     },
    ftw: function(){
        //console.log( 'success doing something');
    }, // session completed successfully

    wtf: function(error){
        app.querySelect.errorText.innerHTML = error.code + " " +  app.err[error.code];
        console.log("ERROR " + error.code + " " +  app.err[error.code]);
        app.stop();
    },

    statusChange: function(status){
        if(status == 1){
            app.querySelect.buttonSm.classList.add("loading");
        }else{app.querySelect.buttonSm.classList.remove("loading");}
          switch (status) {
                case 0: //None Media
                    app.querySelect.alertEl.innerHTML = "None Media";
                    //console.log("None Media");
                    break;
                case 1: //Connection to server
                   app.querySelect.alertEl.innerHTML = "Connection to server ...";
                   //console.log("Connection to server ...");
                    break;
                case 2: //Radio Running
                    app.addClass();
                    app.getPosition();
                    app.querySelect.alertEl.innerHTML  = "Radio Running";
                    //console.log("Radio Running");
                    break;
                case 3: //Paused
                    app.querySelect.alertEl.innerHTML = "Paused Media";
                    break;
                case 4: //Stopped Radio
                    //console.log("Stopped Radio");
                    break;
            }
    },

     addListeners: function(){
         var connect = app.connectionState;
         document.addEventListener("offline", onOffline, false);
         document.addEventListener("online", onOnline, false);
         document.getElementById('button_on_off').addEventListener('click', app.toggle, false);
         document.querySelector(".additional_info").innerHTML = "device.cordova " + device.cordova + '<br/>' + "device.platform " + device.platform +  '<br/>';
         app.querySelect.volDown.addEventListener('click', app.volumeDown, false);
         app.querySelect.volUp.addEventListener('click', app.volumeUp, false);

         /*=======  send email =========================*/
          document.getElementById('send').addEventListener('click', sending, false);
        function sending(){
            cordova.plugins.email.open({
                to:      'honcharov.ivan1987@gmail.com',
                subject: '',
                body:    ''
            });
        };
         function onOffline(){
         app.statusConnect = false;
          app.stop();
          app.querySelect.alertEl.innerHTML = "No connect with internet";
            var networkState = navigator.connection.type;
            document.querySelector(".network_info").innerHTML = app.connectionState[networkState]  + "";
          };
         function onOnline(){
             app.statusConnect = true;
             app.querySelect.alertEl.innerHTML = "Click the button On/Off";
            var networkState = navigator.connection.type;
            document.querySelector(".network_info").innerHTML = app.connectionState[networkState] + "";
         };
     },
     toggle: function(){
        var checkBut = this.classList.contains('button_off') ?  app.play() : app.stop();
     },
     play: function(){
      if (app.media && app.statusConnect){
        app.media.play();
        }
     },
     stop: function(){
         if (app.media){
         app.media.stop();
        };
         app.media.release();
         app.removeClass();
         app.querySelect.buttonSm.classList.remove("loading");
         app.querySelect.alertEl.innerHTML = "Stopped Radio";
         app.track.mediaTimer = null;
     },
     release: function(){
         if (app.media){app.media.release();}
     },
     volumeUp: function(){
          var vol = app.track.volume;
          vol=( Math.floor((vol + 0.1) * 100) / 100 );
          if(vol > 1){
           vol = 1.0;
          };
          app.media.setVolume(vol);
          app.track.volume = vol;
          app.calcVol(vol);
     },
     volumeDown: function(){
         var vol = app.track.volume;
         vol =( Math.floor((vol-0.1) * 100) / 100 );
         if(vol < 0){
             vol = 0;
         };
         app.media.setVolume(vol);
         app.track.volume = vol;
         app.calcVol(vol);
     },
     calcVol: function(ind){
        var el = app.querySelect.wrapVol.querySelectorAll('.active'),
            indexLi = app.querySelect.indexLi;
        if(el){
            for(var i = 0; i < el.length; i++){
                el[i].classList.remove('active');
            };
        };
        indexLi[ind * 20].classList.add('active');
     },
     getPosition: function(){
      var hms = function setTimes(t) {
           var hours = Math.floor(t / 60 / 60);
           var minutes = Math.floor(t / 60) - (hours * 60);
           var seconds = t % 60;
           return [
               hours.toString().padStart(2, '0'),
               minutes.toString().padStart(2, '0'),
               seconds.toString().padStart(2, '0')
           ].join(':');
       };
        if (app.track.mediaTimer == null) {
            app.track.mediaTimer = setInterval(function() {
                 app.media.getCurrentPosition(
                    function(position) {
                        if (position > -1) {
                        app.querySelect.displayTime.innerHTML = hms(Math.round(position));
                        }
                    },
                    function(e) {
                        alert("Error getting pos=" + e);
                    }
                );
            }, 1000);
        }
     },
     addClass: function(){
         var butPlay = app.querySelect.butPlay;
         butPlay.classList.remove("button_off");
         butPlay.classList.add("on_air");
         app.querySelect.appWrap.classList.add("radio_on");
          app.querySelect.volDown.removeAttribute("disabled");
          app.querySelect.volUp.removeAttribute("disabled");
     },
     removeClass: function(){
         var stopBut = app.querySelect.butPlay;
         stopBut.classList.remove('on_air');
         stopBut.classList.add('button_off');
         app.querySelect.appWrap.classList.remove('radio_on');
         app.querySelect.buttonSm.classList.remove("loading");
         app.querySelect.volDown.setAttribute("disabled", false);
         app.querySelect.volUp.setAttribute("disabled", false);
     }
  };
  app.init();

