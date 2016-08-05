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
    // Base URL for all calls
    var apiBaseUrl = 'http://api.themoviedb.org/3/';
    // Base URL for images
    // after the / comes the width e.g. imageBaseUrl + 'w300' + poster_path
    var imageBaseUrl = 'http://image.tmdb.org/t/p/';
    // query string including API Key

    $.getJSON(apiBaseUrl + genreList + apiKey, function(genreData){  
        genreObject = genreData;
        var dd1HTML = '';
        console.log(genreData);
        for (var i = 0; i < genreData.genres.length; i++) {
            dd1HTML += '<option value="' + genreData.genres[i].id + '">' + genreData.genres[i].name + '</option>';
        }
        $('#listGenre').html(dd1HTML);
        $('#listGenre').change(function(){
           this.value;
        });
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

    $.getJSON(apiBaseUrl + npUrl + apiKey, function(npData){
        npObject = npData;
        populateGrid(npObject);
    });

    function genreID(idArr){
        var genreHTML = '';
        for (var j = 0; j < 2; j++) {   
            for (var i = 0; i < genreObject.genres.length; i++) {
                if(idArr[j] == genreObject.genres[i].id){
                    genreHTML += '<div>' + genreObject.genres[i].name + '</div>';
                }
            }
        }
        return genreHTML;
    }

function populateGrid(data){
    var newHTML = '';
        for (var i = 0; i < data.results.length; i++) {
            newHTML += '<div class="col">';
                newHTML +=  data.results[i].title;
                var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
                newHTML += '<a href="#" class="thumbnail"><img src="' + posterUrl + '"></a>';
                var genreIdNum = data.results[i].genre_ids;
                    newHTML += genreID(genreIdNum);
            newHTML += '</div>';
        }
        $('.poster-grid').html(newHTML);
}



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

});
