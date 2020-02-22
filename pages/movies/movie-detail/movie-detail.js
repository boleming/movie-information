// pages/movies/movie-detail/movie-detail.js
import {Movie} from 'class/Movie.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mvId = options.id;
    var url = app.globalData.douban + "v2/movie/subject/" + mvId;
	var movie = new Movie(url);
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },
  viewMoviePostImg:function(event){
    var src = event.currentTarget.dataset.src;
    console.log(src)
    wx.previewImage({
      curent:src,
      urls: [src]
    })
  }
})