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


$.getJSON(apiBaseUrl + npUrl + apiKey, function(npData){
    npObject = npData;
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

$(document).ready(function(){

    $.getJSON(apiBaseUrl + genreList + apiKey, function(genreData){  
        genreObject = genreData;
        var dd1HTML = '<option></option>';
        for (var i = 0; i < genreData.genres.length; i++) {
            dd1HTML += '<option value="' + genreData.genres[i].id + '">' + genreData.genres[i].name + '</option>';
        }
        $('#listGenre').html(dd1HTML);
        $('#listGenre').change(function(){
            createIdGrid(this.value);
        });
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
        var genreHTML = '';
        for (var j = 0; j < 2; j++) {   
            for (var i = 0; i < genreObject.genres.length; i++) {
                if(idArr[j] == genreObject.genres[i].id){
                    genreHTML += ('<div>' + genreObject.genres[i].name + '</div>');
                }
            }
        }
        return genreHTML;
    }

    function populateGrid(data){
        console.log(data);
        var newHTML = '';
            for (var i = 0; i < data.results.length; i++) {
                var idNum = '';
                for (var j = 0; j < data.results[i].genre_ids.length; j++) {
                        idNum += ' ' + data.results[i].genre_ids[j];
                    }
                newHTML += '<div class="col' + (idNum + '">');
                    newHTML +=  data.results[i].title;
                    var BDUrl = imageBaseUrl + 'w300' + data.results[i].backdrop_path;
                    var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
                    newHTML += '<a href="#" class="thumbnail" id="' + data.results[i].id + '" title="' + data.results[i].title + '" bd="' + BDUrl + '"><img src="' + posterUrl + '"></a>';
                    var genreIdNum = data.results[i].genre_ids;
                    newHTML += genreID(genreIdNum); 
                newHTML += '</div>';
            }

            $('.poster-grid').html(newHTML);
            $('.thumbnail').click(function(event){
                event.preventDefault();
                createVideo(this.id, this.title, this.attributes[4].value);
            });
    }

    function createIdGrid(ID){
        $.getJSON(apiBaseUrl + 'genre/' + ID + '/movies' + apiKey, function(genreIdData){  
            console.log(genreIdData);
            populateGrid(genreIdData);
        });
    }

    function createVideo(ID, title, backDrop){
        $.getJSON(apiBaseUrl + 'movie/' + ID + '/videos' + apiKey, function(videoIdData){  
             populateVideo(videoIdData.results, title, backDrop);
        });
    }

    function populateVideo(videoArr, title, backDrop){
        var newVidHTML = '';
        var vidTitleHTML = '<h1>' + title + '</h1><h3>' + videoArr[0].name + '</h3><img src="' + backDrop + '">';
        var nextVidOption = '';
        for (var i = 0; i < videoArr.length; i++) {
            if(videoArr[i] == videoArr[0]){
                newVidHTML += '<iframe width="' + videoArr[0].size + 'px" height="100%" src="https://www.youtube.com/embed/' + videoArr[0].key + 'frameborder="0" allowfullscreen></iframe>';
            }else{
                nextVidOption += '<button id="' + videoArr[i].id + '"class="another"> Watch Another? Trailer:' + (i + 1) + '</button>';  
            }
        }
        $('.video').html(newVidHTML);
        $('.vid-title').html(vidTitleHTML);
        $('.moreTrailers').html(nextVidOption);

        $('.another').click(function(event){
            event.preventDefault();
            nextVideo(this.id, videoArr, title, videoArr[0].name, backDrop);
        });
    }

    function nextVideo(id, arr, title, name, backDrop){
        var newVidHTML = '';
        var vidTitleHTML = '<h1>' + title + '</h1><h3>' + name + '</h3><img src="' + backDrop + '">';
        var nextVidOption = '';
        for (var i = 0; i < arr.length; i++) {
            if(id == arr[i].id){
                newVidHTML += '<iframe width="' + arr[i].size + '" height="auto" src="https://www.youtube.com/embed/' + arr[i].key + 'frameborder="0" allowfullscreen></iframe>';
            }else{
                nextVidOption += '<button id="' + arr[i].id + '"class="another" name="' + arr[i].name + '"> Watch Another? Trailer: ' + (i + 1) + '</button>';
            }
        }
        $('.video').html(newVidHTML);
        $('.vid-title').html(vidTitleHTML);
        $('.moreTrailers').html(nextVidOption);

        $('.another').click(function(event){
            event.preventDefault();
            nextVideo(this.id, arr, title, this.name);
        });
    }  

    $('#reset').click(function(event){
        event.preventDefault();
        console.log('here');
        $('.poster-grid').empty();
    }); 
});
