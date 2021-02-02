$( document ).ready(function() {

    $(".grid > div").click(function(e) {
        $(".atd").each(function() {
            this.pause();
            this.currentTime = 0;
        });
        
        var au = document.getElementById("au" + e.target.id);
        au.play();
    });
    
});
