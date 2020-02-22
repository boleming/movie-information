var postsData = require('../data/post-data.js')
Page({
  data: {
    banner: [
      "/image/banner1.jpg",
      "/image/banner2.jpg",
      "/image/banner3.jpg"
    ]
  },
  onLoad: function(options) {
    this.setData({
      postList:postsData.postList
    })
  },
  onPostTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    //console.log("onPostTap");
    wx.navigateTo({
      url: "post-detail/post-detail?id="+postId
    })
  }

})