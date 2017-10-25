$(document).ready(function(){
    var clickedValue = 0;
    
    $('#1_star').hover(function(){
        $('#1_star').attr('src', '/images/star_on.png');
        $('#2_star').attr('src', '/images/star_off.png');
        $('#3_star').attr('src', '/images/star_off.png');
        $('#4_star').attr('src', '/images/star_off.png');
        $('#5_star').attr('src', '/images/star_off.png');
        
        $('#showTitle').html('Bad');
    });
    
    $('#1_star').on('click', function(){
        clickedValue = 1;
        
        console.log(clickedValue)
    });
    
    $('#2_star').hover(function(){
        $('#1_star').attr('src', '/images/star_on.png');
        $('#2_star').attr('src', '/images/star_on.png');
        $('#3_star').attr('src', '/images/star_off.png');
        $('#4_star').attr('src', '/images/star_off.png');
        $('#5_star').attr('src', '/images/star_off.png');
        
        $('#showTitle').html('Poor');
    });
    
    $('#2_star').on('click', function(){
        clickedValue = 2;
        
        console.log(clickedValue)
    })
    
    $('#3_star').hover(function(){
        $('#1_star').attr('src', '/images/star_on.png');
        $('#2_star').attr('src', '/images/star_on.png');
        $('#3_star').attr('src', '/images/star_on.png');
        $('#4_star').attr('src', '/images/star_off.png');
        $('#5_star').attr('src', '/images/star_off.png');
        
        $('#showTitle').html('Fair');
    });
    
    $('#3_star').on('click', function(){
        clickedValue = 3;
        
        console.log(clickedValue)
    })
    
    $('#4_star').hover(function(){
        $('#1_star').attr('src', '/images/star_on.png');
        $('#2_star').attr('src', '/images/star_on.png');
        $('#3_star').attr('src', '/images/star_on.png');
        $('#4_star').attr('src', '/images/star_on.png');
        $('#5_star').attr('src', '/images/star_off.png');
        
        $('#showTitle').html('Good');
    });
    
    $('#4_star').on('click', function(){
        clickedValue = 4;
        
        console.log(clickedValue)
    })
    
    $('#5_star').hover(function(){
        $('#1_star').attr('src', '/images/star_on.png');
        $('#2_star').attr('src', '/images/star_on.png');
        $('#3_star').attr('src', '/images/star_on.png');
        $('#4_star').attr('src', '/images/star_on.png');
        $('#5_star').attr('src', '/images/star_on.png');
        
        $('#showTitle').html('Excellent');
    });
    
    $('#5_star').on('click', function(){
        clickedValue = 5;
        
        console.log(clickedValue)
    });
    
    $('#rate').on('click', function(){
        var review = $('#review').val();
        var sender = $('#sender').val();
        var id = $('#id').val();
        
        var valid = true;
        
        if(clickedValue === 0 || clickedValue > 5){
            valid = false;
            $('#error').html('<div class="alert alert-dnger">Please give a rating and review before you submit.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid === true){
            
            $.ajax({
                url: '/review/'+id,
                type: 'POST',
                data: {
                    clickedValue: clickedValue,
                    review: review,
                    sender: sender
                },
                success: function(){
                    $('#review').val('');
                    $('#sender').val('');
                    $('#id').val('');
                }
            });
            
        }else{
            return false;
        }
    })
});



















