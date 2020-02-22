Page({
  data: {
    logo: "/image/logo.jpg",
    userName:"hello,明仔",
    moto: "开启小程序之旅"
  },
  onTap: function () {
    /**wx.redirectTo({
      url: '../post/post',
    })**/
   /* wx.navigateTo({
      url: '../post/post',
    }) */
    wx.switchTab({
      url: '../post/post'
    })
  }
})