// pages/movies/movies.js
var util = require('../utils/util.js');
var app = getApp();
Page({
  data: {
    inTheaters:{},
    comingSoon:{},
    top250Url:{},
    searchResult:{},
    isShow:true
  },
  onLoad:function(options){
    var inTheatersUrl = app.globalData.douban + "v2/movie/in_theaters" + "?start=1&count=3";
    var comingSoonUrl = app.globalData.douban + "v2/movie/coming_soon" + "?start=1&count=3";
    var top250Url = app.globalData.douban + "v2/movie/top250" + "?start=10&count=3";
    this.getMovieListData(inTheatersUrl,'inTheaters','即将上映');
    this.getMovieListData(comingSoonUrl,'comingSoon','正在热映');
    this.getMovieListData(top250Url,'top250Url','Top250');
    console.log(this.data)
  },
  onBindFocus:function(event){
    this.setData({
      isShow : false
    })
  },
  onImgTap:function(event){
    this.setData({
      isShow : true,
      searchResult:{}
    })
  },
  onBindChange:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.douban + "v2/movie/search?q=" +text;
    this.getMovieListData(searchUrl,'searchResult','');
  },
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  noMovieTap:function(event){
    var mvId = event.currentTarget.dataset.mvid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + mvId
    })
  },
  getMovieListData:function(url,setKey,newTitle){
    wx.request({
      url:url,
      method: 'GET',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      success:(res)=> {
        var json = res.data
        if (typeof json != 'object') {
          if (json != null) {
            json = json.replace("\ufeff", "")
            json = JSON.parse(json)
          }
        }
        this.getMvData(json,setKey,newTitle)
      },
      fail:function(error) {
        console.log(error)
      }
    })
  },
  getMvData: function (mvData, setKey,newTitle){
    var movies = [];
    for (var idx in mvData.subjects){
      var subject = mvData.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + "...";
      } 
      var temp = {
        title,
        stars: util.convertToStarsArray(subject.rating.stars),
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
      var newData = {};
      newData[setKey] = {
        movies,
        newTitle
      };
    }
    this.setData(newData)
  }
  
})