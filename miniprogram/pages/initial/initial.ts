import { login, getUserInfo } from '../../services/api';
import { setToken } from '../../utils/auth';

Page({
  data: {
    showPrivacyButton: true,
    logo: '../../images/user.png', // Update this with your actual logo path
  },

  onLoad() {
    // Check if the user has already given privacy authorization
    wx.getPrivacySetting({
      success: (res) => {
        if (res.needAuthorization) {
          this.setData({ showPrivacyButton: true });
        } else {
          console.log('Privacy already granted');
          this.setData({ showPrivacyButton: false });
          this.handleLogin();
        }
      },
    });
  },

  handlePrivacyAuthorize(e: WechatMiniprogram.CustomEvent) {
    if (e.detail.event === 'agree') {
      this.setData({ showPrivacyButton: false });
      this.handleLogin();
    }
  },

  async handleLogin() {
    try {
      
      const { code } = await wx.login();
      console.log('code ' + code);
      // const appId = 'wxd2ec499da131067e';
      // const secret = 'a11f72b6e773c700adf952f873320fe5';
      // const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    // wx.request({
    //   url: url,
    //   method: 'GET',
    //   success: (response) => {
    //     console.log(response.data);
    //   },
    //   fail :(err) => {
    //     console.log(err);
    //   }
    // });

      const loginResult = await login({ platform: 'wechat', code: code });
      console.log('login result ' + loginResult.data.access_token)
      setToken(loginResult.data.access_token);

      const userInfoRes = await getUserInfo();
      const userInfo = userInfoRes.data;
      console.log('User info ' + JSON.stringify(userInfo));

      if (!userInfo.wechat_nickname || !userInfo.wechat_avatar_url) {
        wx.navigateTo({ url: '/pages/profile/profile' });
      } 
      // Temporarily not verify phone number.
      // else if (loginResult.code === 100) {
      //   wx.navigateTo({ url: '/pages/phoneNumber/phoneNumber' });
      // } 
      else if (userInfo.height === null) {
        wx.navigateTo({ url: '/pages/questionnaire/questionnaire' });
      } else {
        wx.switchTab({ url: '/pages/analysis/analysis' });
      }
    } catch (error) {
      console.error('Login error:', error);
      wx.showToast({ title: 'Login failed', icon: 'none' });
    }
  },
});