$( document ).ready(function() {

    function append(company, imageUrl, title, content, tweet, caption, link) {      
        // set the elements
        var grid = $('#columns')[0];
        var item = document.createElement('div');
        // add the html
        var h = '<div class="thumbnail ' + company + '">';
        h += '<div class="' + company + '-icon"></div>';
        h += '<img src="' + imageUrl + '" alt="">';
        h += '<div class="caption">';
        h += '<p>' + title + '</p>';
        h += '</div>';
        h += '<div class="panel-body">';
        h += '<p class="content text-muted">' + content + '</p>';
        h += '<p class="tweet">' + tweet + '</p>';
        h += '<p class="igPost">' + caption + '</p>'
        h += '<p><a href="#" target="_blank">' + link + '</a></p>'
        h += '</div>';
        h += '</div>';
        salvattore['append_elements'](grid, [item])
        item.outerHTML = h;
    }

    //Get data and add it to the page
    $.getJSON("post.json", function (data) {
        $(data.items).each(function (i, post) {     
            var service = post.service_name;
            var img_url = post.item_data.image_url;
            var username = '';
            var text =  post.item_data.text;
            var tweet = post.item_data.tweet; 
            var caption = post.item_data.caption;
            var link_text = post.item_data.link_text;

            // //Regex
            // // var text = post.item_data.text;
            // text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:% ~\?\/.=]+/g,function(i){
            //     var url = i.link(i);
            //     return url;
            // }) 

        try { 
            username = post.item_data.user.username;  
        } catch (exception) { 
            console.warn("Parse error: User data not found inside of post's item data");
        }
            append(
                service,
                img_url, 
                username,
                text, 
                tweet,
                caption, 
                link_text 
            );

            //removes undefined from posts
            $('.thumbnail p:contains(undefined)').remove();

            $('.Twitter-icon').html('<i class="fa fa-twitter" aria-hidden="true"></i>');
            $('.Instagram-icon').html('<i class="fa fa-instagram" aria-hidden="true"></i>');
            $('.Manual-icon').html('<span class="aff-text">AFF</span>');   
        });

    });

    //Filter
    $('.cat').click(function(){
        var cat = $(this).attr('id'); 
        if(cat === 'all') {
           $('.thumbnail').addClass('hidden');
           setTimeout(function() {
               $('.thumbnail').removeClass('hidden');
           }, 300)
        }else {
             $('.thumbnail').addClass('hidden');
             setTimeout(function() {
               $('.' + cat).removeClass('hidden');
           }, 300)
        }
    });

    //Loads more data
    $('#loadMore').click(function(){
        $.getJSON("post.json", function (data) {
            $(data.items).each(function (i, post) {
                append(
                    post.service_name,
                    post.item_data.image_url, 
                    post.account_data.user_name,
                    post.item_data.text, 
                    post.item_data.tweet,
                    post.item_data.caption, 
                    post.item_data.link_text 
                );

                //removes undefined from posts
                $('.thumbnail p:contains(undefined)').remove();

                $('.Twitter-icon').html('<i class="fa fa-twitter" aria-hidden="true"></i>');
                $('.Instagram-icon').html('<i class="fa fa-instagram" aria-hidden="true"></i>');
                $('.Manual-icon').html('<span class="aff-text">AFF</span>'); 
            });
        });
    }); 

    //Submit post
    $("#postForm").submit(function(e){    
        var text = $('#text').val();
        var image_url = $('#image_url').val();
        var url = $(this).attr('action');
        
        $.ajax({
            url: 'post.json',
            method: 'POST',
            error: function(jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            },
            data: {
                text: text,
                image_url: image_url
            },
            success: function (data) {
                console.log('Post is working....');
                append(
                data.items[0].item_data.image_url, 
                data.items[0].item_data.text
            );   
                    
            },
        });
    }); 

}); // Doc Ready 