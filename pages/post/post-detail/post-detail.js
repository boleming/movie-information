var postsData = require('../../data/post-data.js');
var app = getApp();
Page({
  data: {
    isPlayingMusic:false
  },
  onLoad: function(options) {
    var postId = options.id;
    this.data.postId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    })
    // this.data.postData=postData;
    // this.setData({
    //   postList: postsData.postList
    // })

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    if (app.globalData.g_isPlayingMusic && app.g_MusicPostId == this.data.postData.postId){
      this.setData({
        isPlayingMusic:true
      });
    }
    this.setAudioMonitor()
  },
  setAudioMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic=true;
      app.g_MusicPostId = that.data.postData.postId;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic=false;
      app.g_MusicPostId = null;
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic=false;
      app.g_MusicPostId = null;
    })
  },
  onColletionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: this.data.collected ? "收藏成功" : "取消成功",
      duration: 1000
    })
  },
  onShareTap: function(event) {
    var that = this;
    var shareImg = false;
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "确定是否" + itemList[res.tapIndex] + "？",
          success(res) {
            if (res.confirm) {
              shareImg = true;
            } else if (res.cancel) {
              shareImg = false;
            }
            that.setData({
              shareImg: shareImg
            })
          }
        })
      }
    })
  },
  onMusicTap:function(event){
    var that=this;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){
      wx.pauseBackgroundAudio();
      that.setData({
        isPlayingMusic:false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.musicUrl,
        title: this.data.postData.music.title,
        coverImgUrl: this.data.postData.music.imageUrl
      });
      that.setData({
        isPlayingMusic:true
      });
      console.log(this.data)
      console.log(postsData)
    }
  }
})