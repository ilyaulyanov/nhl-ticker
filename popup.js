// Copyright (c) 2014 All rights are reserved to their respective owners

//var curDate = new Date().toISOString().slice(0,10);
var jsonfeed;
var statsfeed;
var local = formatLocalDate();
var gameId = [];
var newsfeed;
var altDate;



function pad(num) {
    norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
}

//getting local date
function formatLocalDate() {
    var local = new Date();
    var tzo = -local.getTimezoneOffset();
    var sign = tzo >= 0 ? '+' : '-';
    return local.getFullYear() 
        + '-' + pad(local.getMonth()+1)
        + '-' + pad(local.getDate());
}


//checking score
function checkScore(data,index){
if(data.games[index].hts==""){

    if(data.games[index].bsc=="progress"){
        return "<p>0 : 0</p>";
    } 
    else if(data.games[index].ats==""){
        return "Starts at";
    } else{
        return '<p>'+data.games[index].hts+' : ' + data.games[index].ats+'</p>';
    }
    
}
else return '<p>'+data.games[index].hts+' : ' + data.games[index].ats+'</p>';
}

//populating divs
function createDiv(index,id,className){
    var div = document.createElement('div');
    div.id = id+index;
    div.className = className;
    return div;
}

//creating stats divs
function slideStats(data,index){
    console.log('here');
        for(var i=0;i<data.games.length;i++){
            var elem = document.getElementById('statsblock'+i);
            console.log(elem);
            elem.classList.remove('vis');
            elem.classList.add('hid');
            }
    var stat = document.getElementById('statsblock'+index);
    stat.classList.remove('hid');
    stat.classList.add('vis');
    
}

loadScoreboard = function(data){

              $(data.games).each(function (index, entry) {



                    var gameDiv = createDiv(index,'gameblock','game');
                    gameDiv.onclick = function(){

                        slideStats(data,index,stats);
                        stats.innerHTML = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>';
                    };
                    
                    //creating Home Team div
                    var homeTeam = createDiv(index,'hometeam','hteam team');
                    gameDiv.appendChild(homeTeam);
                     
                    //loading team image
                    var homeTeamImg = document.createElement('img');
                    homeTeamImg.src = 'img/'+data.games[index].hta+'.gif';
                    homeTeam.appendChild(homeTeamImg);
                     
                    //home team description
                    var homeTeamDesc = createDiv(index,'hteamdesc','teamdesc');
                    homeTeamDesc.innerHTML = '<p>'+data.games[index].hta+'</p>';
                    homeTeam.appendChild(homeTeamDesc);
                     
                    //creating middle column
                    var middleDiv = createDiv(index,'middle','middle');
                    gameDiv.appendChild(middleDiv);

                    //creating game score div
                    var scoreDiv = createDiv(index,'score','score');
                    var score = checkScore(data,index);
                    scoreDiv.innerHTML = score;
                    middleDiv.appendChild(scoreDiv);
      
                    //creating game time/result div
                    var resultDiv = createDiv(index,'result','result');
                    resultDiv.innerHTML = "<p>"+data.games[index].bs+"</p>";

                    //adding link to the game
                    var gameLink = document.createElement("a");
                    var link = "http://www.nhl.com/gamecenter/en/icetracker?id="+data.games[index].id;
                    gameLink.setAttribute("href", link);
                    gameLink.setAttribute("target","_blank")
                    gameLink.innerHTML = "<p>Game page</p>";
                    resultDiv.appendChild(gameLink);
                    middleDiv.appendChild(resultDiv);

                    //creating Away Team div
                    var awayTeam = createDiv(index,'awayteam','ateam team');
                    gameDiv.appendChild(awayTeam);
                    
                    //loading team image
                    var awayTeamImg = document.createElement('img');
                    awayTeamImg.src = 'img/'+data.games[index].ata+'.gif';
                    awayTeam.appendChild(awayTeamImg);

                    //away team name and stats
                    var awayTeamDesc = createDiv(index, 'ateamdesc','teamdesc');
                    awayTeamDesc.innerHTML = '<p>'+data.games[index].ata+'</p>';
                    awayTeam.appendChild(awayTeamDesc);

                    //creating game div
                    var stats = createDiv(index,'statsblock','stats');
                    gameDiv.appendChild(stats);
                    document.body.appendChild(gameDiv);
                    gameId[index] = data.games[index].id;

            });

}

loadNews = function(newsfeed){

    $(newsfeed.news).each(function (index, entry) {
        
            var newsItem = document.createElement('li');
            newsItem.id = 'newsItem'+index;
            newsItem.className = 'newsItem';
            newsItem.innerHTML = '<span class="date">'+newsfeed.news[index].publishDate + '</span> ' + newsfeed.news[index].headline;
            newsList.appendChild(newsItem);


            //adding link to the news
            var gameLink = document.createElement("a");
            var link = newsfeed.news[index].articleURL;
            gameLink.setAttribute("href", link);
            gameLink.setAttribute("target","_blank")
            gameLink.innerHTML = "<p>Read more</p>";
            newsItem.appendChild(gameLink);
            
    });

}
function getGames(urlDate){
    $.ajax({
     
     url: 'http://live.nhle.com/GameData/GCScoreboard/'+urlDate+'.jsonp',
       // url: 'http://live.nhle.com/GameData/RegularSeasonScoreboardv3.jsonp',
        dataType: 'jsonp',
        success: function (data) {
           console.log('success');
           
        },
        error: function () {}

    });
}

    $.ajax({
     
     url: 'http://nhlwc.cdnak.neulion.com/fs1/nhl/league/news/NHL/iphone/1/news.json',
       // url: 'http://live.nhle.com/GameData/RegularSeasonScoreboardv3.jsonp',
        dataType: 'json',
        success: function (data) {
                    
           newsfeed = data;
           loadNews(newsfeed);
        },
        error: function () {}

    });





document.addEventListener('DOMContentLoaded', function () {
    $('#dp3').datepicker('hide',{
                format: 'yyyy-mm-dd'
            })
    .on('changeDate', function(ev){ 
        var altDate = new Date(ev.date).toJSON().slice(0,10);

        $('.game').remove();
        getGames(altDate);
        
        console.log(altDate);
    });;



    getGames(local);
    var tabs = document.createElement('ul');
    tabs.id = 'menu';
    document.body.appendChild(tabs);

    var tabsItem1 = document.createElement('li');
    tabsItem1.innerHTML = '<a href="#">Schedule</a>';
    tabsItem1.onclick = function(){

                        var hideGames = document.getElementsByClassName('game');
                        var hideNews = document.getElementsByClassName('news');
                        console.log(hideNews);
                        hideNews[0].classList.add('hid');
                        hideNews[0].classList.remove('vis');
                        console.log(hideGames);
                        for (var i = 0; i < hideGames.length; i++) {
                            hideGames[i].classList.add('vis');
                            hideGames[i].classList.remove('hid');
                        };
                        tabsItem1.classList.add('sel');
                        tabsItem2.classList.remove('sel');
                    };
    tabsItem1.classList.add('sel');
    tabs.appendChild(tabsItem1);

    var tabsItem2 = document.createElement('li');
    tabsItem2.innerHTML = '<a href="#">NHL News</a>';
    tabsItem2.onclick = function(){

                        var hideGames = document.getElementsByClassName('game');
                        var hideNews = document.getElementsByClassName('news');
                        hideNews[0].classList.add('vis');
                        hideNews[0].classList.remove('hid');
                        console.log(hideGames);
                        for (var i = 0; i < hideGames.length; i++) {
                            hideGames[i].classList.add('hid');
                            hideGames[i].classList.remove('vis');
                        };
                        tabsItem2.classList.add('sel');
                        tabsItem1.classList.remove('sel');

                    };
    tabs.appendChild(tabsItem2);

    var tabsItem3 = document.createElement('li');
    tabsItem3.innerHTML = '<a href="#">Show Calendar</a>';
    tabsItem3.onclick = function(){
                       $('#dp3').datepicker('show');
                        

                    };
    tabs.appendChild(tabsItem3);

    var newsDiv = document.createElement('div');
    newsDiv.id = 'newsBlock';
    newsDiv.className = 'news hid';

    var newsList = document.createElement('ul');
    newsList.id = 'newsList';

  

    newsDiv.appendChild(newsList);
    document.body.appendChild(newsDiv);



});
