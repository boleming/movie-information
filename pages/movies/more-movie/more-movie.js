// pages/movies/more-movie/more-movie.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl:"",
    totalCount:0,
    isEmpty:true
  },
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "即将上映":
        dataUrl = app.globalData.douban + "v2/movie/in_theaters";
        break;
      case "正在热映":
        dataUrl = app.globalData.douban + "v2/movie/coming_soon";
        break;
      case "Top250":
        dataUrl = app.globalData.douban + "v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.getMvData);
  },
  onReachBottom:function(event){
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.getMvData);
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh:function(event){
    var refUrl = `${this.data.requestUrl}?start=0&count=20`;
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refUrl, this.getMvData);
    wx.showNavigationBarLoading()
  },
  noMovieTap:function(event){
    var mvId = event.currentTarget.dataset.mvid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + mvId
    })
  },
  getMvData: function(mvData) {
    var movies = [];
    for (var idx in mvData.subjects) {
      var subject = mvData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title,
        stars: util.convertToStarsArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {}
    //如果不是首次加载则合并新旧数据 
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.totalCount += 20
    console.log(this.data.movies)
  },
  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
});