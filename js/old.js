$( document ).ready(function() {

  $("td").click(function(e) {
      $(".atd").each(function() {
          this.pause();
          this.currentTime = 0;
      });
      
      var au = document.getElementById("au" + e.target.id);
      au.play();
  });
  
  var tempo = "76";
  var beat = "01";
  
  $("#start").click(function() {
      /*$("audio").each(function() {
          this.pause();
          this.currentTime = 0;
      });*/
      
      var au = document.getElementById(tempo + "bpm_beat" + beat);
      au.loop = true;
      au.play();

      var source = "/old/beats/" + tempo + "bpm_beat" + beat + ".mp3";

      var context = new (window.AudioContext || window.webkitAudioContext)(),
      request = new XMLHttpRequest();

      request.responseType = "arraybuffer";
      request.open("GET", source, true);

      // XHR complete
      request.onload = function() {
          context.decodeAudioData(request.response,success);
      };

      request.send();

      function success(buffer) {
          
          function stop() {
  
            // Stop and clear if it's playing
            if (source) {
              source.stop();
              source = null;
            }
  
          }
  
          function play() {
  
            // Stop if it's already playing
            stop();
  
            // Create a new source (can't replay an existing source)
            source = context.createBufferSource();
            source.connect(context.destination);
  
            // Set the buffer
            source.buffer = buffer;
            source.loop = true;
  
            // Play it
            source.start(0);
  
          }
          play();
        }
  });
  
  $("#tempo").click(function() {
      if (tempo=="76") {
          tempo = "84";
          $("#tempo").text("Tempo - Medium");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      } else if (tempo=="84") {
          tempo = "92";
          $("#tempo").text("Tempo - Fast");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      } else {
          tempo = "76";
          $("#tempo").text("Tempo - Slow");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      }
  });
  
  $("#beat").click(function() {
      if (beat=="01") {
          beat = "02";
          $("#beat").text("Beat - 2");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      } else if (beat=="02") {
          beat = "03";
          $("#beat").text("Beat - 3");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      } else if (beat=="03") {
          beat = "04";
          $("#beat").text("Beat - 4");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      } else {
          beat = "01";
          $("#beat").text("Beat - 1");
          
          $("audio").each(function() {
              this.pause();
              this.currentTime = 0;
          });
      }
  });
});
