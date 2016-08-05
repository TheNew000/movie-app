$(document).ready(function(){
    var apiKey = '?api_key=fec8b5ab27b292a68294261bb21b04a5';
    var npUrl = 'movie/now_playing';
    var popUrl = 'movie/popular';
    var trUrl = 'movie/top_rated';
    var upUrl = 'movie/upcoming';
    var genreList = 'genre/movie/list';
    var genreObject;
    var npObject;
    var popObject;
    var trObject;
    var upObject;
    var videoObject;
    // Base URL for all calls
    var apiBaseUrl = 'http://api.themoviedb.org/3/';
    // Base URL for images
    // after the / comes the width e.g. imageBaseUrl + 'w300' + poster_path
    var imageBaseUrl = 'http://image.tmdb.org/t/p/';
    // query string including API Key

    // Creating the necessary objects

    $.getJSON(apiBaseUrl + genreList + apiKey, function(genreData){  
        genreObject = genreData;
        var dd1HTML = '<option></option>';
        console.log(genreData);
        for (var i = 0; i < genreData.genres.length; i++) {
            dd1HTML += '<option value="' + genreData.genres[i].id + '">' + genreData.genres[i].name + '</option>';
        }
        $('#listGenre').html(dd1HTML);
        $('#listGenre').change(function(){
            createIdGrid(this.value);
        });
    });

    $.getJSON(apiBaseUrl + npUrl + apiKey, function(npData){
        npObject = npData;
        console.log(npObject);
    });

    $.getJSON(apiBaseUrl + popUrl + apiKey, function(popData){  
        popObject = popData;
    });

    $.getJSON(apiBaseUrl + trUrl + apiKey, function(trData){  
        trObject = trData;
    });

    $.getJSON(apiBaseUrl + upUrl + apiKey, function(upData){  
        upObject = upData;
    });

    $.getJSON(apiBaseUrl + upUrl + apiKey, function(upData){  
        upObject = upData;
    });

    $('#sortOptions').change(function(){
        if(this.value == 'np'){
            var data = npObject;
        }else if(this.value == 'late'){
            var data = lateObject;
        }else if(this.value == 'pop'){
            var data = popObject;
        }else if(this.value == 'tr'){
            var data = trObject;
        }else if(this.value == 'up'){
            var data = upObject;
        }
        populateGrid(data);
    });

    function genreID(idArr){
        var genreHTML = '<div></div>';
        for (var j = 0; j < 2; j++) {   
            for (var i = 0; i < genreObject.genres.length; i++) {
                if(idArr[j] == genreObject.genres[i].id){
                    genreHTML += '<div">' + genreObject.genres[i].name + '</div>';
                }
            }
        }
        return genreHTML;
    }

    function populateGrid(data){
        var newHTML = '';
        var idNum = '';
            for (var i = 0; i < data.results.length; i++) {
                for (var j = 0; j < data.results[i].genre_ids.length; j++) {
                        idNum += ' ' + data.results[i].genre_ids[j];
                    }
                newHTML += '<div class="col' + idNum + '">';
                    newHTML +=  data.results[i].title;
                    var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
                    newHTML += '<a href="#" class="thumbnail" id="' + data.results[i].id + '"><img src="' + posterUrl + '"></a>';
                    var genreIdNum = data.results[i].genre_ids;
                        newHTML += genreID(genreIdNum);
                newHTML += '</div>';
            }
            $('.poster-grid').html(newHTML);

            $('.thumbnail').click(function(event){
                event.preventDefault();
                createVideo(this.id, this.title);
            });
    }

    function createIdGrid(ID){
        $.getJSON(apiBaseUrl + 'genre/' + ID + '/movies' + apiKey, function(genreIdData){  
            console.log(genreIdData);
            populateGrid(genreIdData);
        });
    }

    function createVideo(ID, title){
        $.getJSON(apiBaseUrl + 'movie/' + ID + '/videos' + apiKey, function(videoIdData){  
             populateVideo(videoIdData.results, title);
        });
    }

    function populateVideo(videoArr, title){
        var newVidHTML = '<h1>' + title + '</h1><h3>' + videoArr[0].name + '</h3>';
        var nextVidOption = '';
        if(videoArr.length == 1 || videoArr[0]){
                newVidHTML += '<iframe width="' + videoArr[0].size + '" height="auto" src="https://www.youtube.com/embed/' + videoArr[0].key + 'frameborder="0" allowfullscreen></iframe>';
            }
        if(videoArr.length > 1){
            for (var i = 1; i < videoArr.length; i++) {
                nextVidOption += '<div id="' + videoArr[i].id + '"class="another"> Watch Another?' + (i + 1) + '</div>';
            }
        }
        $('.video').html(newVidHTML);
        $('.moreTrailer').html(nextVidOption);

        $('.another').click(function(event){
            event.preventDefault();
            nextVideo(this.id, videoArr, videoArr[0].name);
        });
    }

    function nextVideo(id, arr, name){
        var newVidHTML = '<h1>' + title + '</h1><h3>' + name + '</h3>';
        var nextVidOption = '';
        for (var i = 0; i < arr.length; i++) {
            if(id == arr[i].id){
                newVidHTML += '<iframe width="' + arr[i].size + '" height="auto" src="https://www.youtube.com/embed/' + arr[i].key + 'frameborder="0" allowfullscreen></iframe>';
            }else{
                nextVidOption += '<div id="' + arr[i].id + '"class="another"> Watch Another?' + (i + 1) + '</div>';
            }
        }
    }    
});
