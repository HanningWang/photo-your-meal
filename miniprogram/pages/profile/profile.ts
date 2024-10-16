import { updateWechatInfo } from '../../services/api';

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: ''
  },

  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    console.log(avatarUrl);
    this.setData({
      avatarUrl: avatarUrl,
    })
  },

  onInputNickname(e: any) {
    const { value } = e.detail;
    console.log(value);
    this.setData({
      nickname: value
    })
  },

  async handleSubmit() {
    console.log(this.data.avatarUrl);
    console.log(this.data.nickname)
    if (!this.data.avatarUrl || this.data.avatarUrl === defaultAvatarUrl) {
      wx.showToast({ title: '请上传头像', icon: 'none' });
      return;
    }

    if (!this.data.nickname) {
      wx.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }

    try {
      await updateWechatInfo({
        wechat_avatar_url: this.data.avatarUrl,
        wechat_nickname: this.data.nickname,
      });

      // Save user info to storage
      wx.setStorageSync('avatarUrl', this.data.avatarUrl);
      wx.setStorageSync('nickname', this.data.nickname);

      wx.navigateTo({ url: '/pages/questionnaire/questionnaire' });
    } catch (error) {
      console.error('Update user wechat info error:', error);
      wx.showToast({ title: '更新用户信息失败', icon: 'none' });
    }
  }
})