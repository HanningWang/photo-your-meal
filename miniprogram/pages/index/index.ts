// index.ts

import { endpoint } from "../../constants/global"

// 获取应用实例
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: true,
    hasUserStats: true,
    hasUserPhoneNumber: true,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    accessToken: '',
  },

  onLoad() {
    this.getUserOpenId();
  },

    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      console.log('Loading...')
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },

    getUserOpenId() {
      wx.login({
        success: (res) => {
          console.log(res.code);
          const queryParam = `platform=app&code=${res.code}`
          if (res.code) {
            // Send res.code to your backend to get openId
            wx.request({
              url: `${endpoint}/user/login?${queryParam}`,
              method: 'POST',
              header: {
                'accept': 'application/json', // The Accept header
              },
              success: (response) => {
                console.log(response.data);
                const accessToken =  response.data.data.access_token;
                wx.setStorageSync('openId', accessToken);
                if (response.data.code === 100) {
                  this.setData({
                    hasUserPhoneNumber: false,
                  });
                } else {
                  this.setData({
                    hasUserPhoneNumber: true,
                  });
                }

                this.getUserInfo(accessToken);
              },
              fail: (err) => {
                console.error('Failed to get openId:', err);
              }
            });
          } else {
            console.error('Login failed:', res.errMsg);
          }
        }
      })
    },

    getUserInfo(accessToken: string) {
      wx.request({
        url: `${endpoint}/user/info`,
        method: 'GET', // The HTTP method
        header: {
          'accept': 'application/json', // The Accept header
          'Authorization': `Bearer ${accessToken}`// The Authorization header
        },
        success: (res) => {
          const resData = res.data.data;
          console.log('user info: ' + resData);
          this.setData({
            hasUserInfo: resData.user_nickname !== null || resData.wechat_avatar_url !== null
          });
          this.setData({
            hasUserStats: resData.height !== null
          });
          // If no user profile, request user profile
          if (resData.user_nickname === null && resData.wechat_avatar_url === null) {
            wx.navigateTo({
              url: '/pages/questionnaire/questionnaire'
            });
          } else {
            wx.setStorageSync('userBasicInfo', res.data.data);
            wx.switchTab({
              url: '/pages/home/home'
            })
          }
        }
      });
    },

    getUserPhoneNumber(e: any) {
      console.log(e);
      if (e.detail.errMsg === "getPhoneNumber:fail no permission") {
        wx.showModal({
          title: '没有权限',
          content: '您需要提供权限获取手机号码',
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            if (res.confirm) {
              console.log('User agreed to try again');
              // Optionally, prompt user to retry
            } else if (res.cancel) {
              console.log('User declined to provide phone number');
            }
          }
        });
      }
    }
})
