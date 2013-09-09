$(document).ready(function() {
    $(document).on('change','#unit', function(){
        
        var user = $(this).parent().parent().attr('id');
        var unit = $(this).val();
        $.ajax({
            url: "/app/edit",
            data: { user: user, unit: unit },
            type: "POST",
            error: function(e){
                console.log(e.statusText);
            }
        });

    });
    $(document).on('change','#job', function(){
        
        var user = $(this).parent().parent().attr('id');
        var job = $(this).val();
        $.ajax({
            url: "/app/edit",
            data: { user: user, job: job },
            type: "POST",
            error: function(e){
                console.log(e.statusText);
            }
        });

    });
});