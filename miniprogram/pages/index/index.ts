// index.ts

import { endpoint } from "../../constants/global"

// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    accessToken: '',
  },

    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })

      wx.setStorageSync('avatarUrl', avatarUrl);
    },
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })

      this.getUserOpenId();

      wx.setStorageSync('nickName', nickName);
      wx.navigateTo({
        url: '/pages/questionnaire/questionnaire'
      });
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

          this.getUserOpenId();

          console.log('Access token is ' + this.data.accessToken);
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
                console.log(response.data.access_token)
                if(typeof response.data === 'object' && 'access_token' in response.data) {
                  
                  console.log('Get access token ' + response.data.access_token)
                  wx.setStorageSync('openId', response.data.access_token);
                  const accessToken =  `Bearer ${response.data.access_token}`;
                  this.getUserInfo(accessToken);
                } else {
                  console.error('Failed to get openId from response: ', response.data);
                }

                console.log('open id ', wx.getStorageSync('openId'));
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
          'Authorization': accessToken // The Authorization header
        },
        success(res) {
          console.log('Get user info ' + res.statusCode);
          console.log(res.data);
          if (Object.keys(res.data).length === 0) {
            wx.navigateTo({
              url: '/pages/questionnaire/questionnaire'
            });
          } else {
            wx.setStorageSync('userBasicInfo', res.data);
            wx.switchTab({
              url: '/pages/home/home'
            })
          }
        }
      });
    }
})
