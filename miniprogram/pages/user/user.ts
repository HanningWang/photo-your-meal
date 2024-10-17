Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    }
  },

  onLoad() {
    // Fetch user info from storage
    const avatarUrl = wx.getStorageSync('avatarUrl');
    const nickname = wx.getStorageSync('nickname');
    
    if (avatarUrl && nickname) {
      this.setData({
        userInfo: {
          avatarUrl: avatarUrl,
          nickName: nickname
        }
      });
    } else {
      // If user info is not available, you may want to redirect to login page
      // or implement a way to fetch user info here
      console.log('User info not found in storage');
    }
  },

  navigateTo(e: any) {
    const page = e.currentTarget.dataset.page;
    switch (page) {
      case 'myInfo':
        wx.navigateTo({ url: '/pages/info/info' });
        break;
      case 'myRecords':
        wx.navigateTo({ url: '/pages/records/records' });
        break;
      case 'contactUs':
        wx.navigateTo({ url: '/pages/contactUs/contactUs' });
        break;
      default:
        console.error('Unknown page:', page);
    }
  }
});
