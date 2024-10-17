import { updateUserInfo } from "../../services/api";

Page({
  data: {
    nickname: wx.getStorageSync('nickname'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    exerciseHabit: '',
    currentDate: '',
    birthday: '',
    gender: '',
    goal: '',
  },

  onLoad() {
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.setData({ currentDate });
  },

  async formSubmit(e: any) {
    const formData = e.detail.value;
    console.log('Form data:', formData);

    if (!formData.gender || !formData.birthday || !formData.height || !formData.weight || !formData.goal || !formData.habit) {
      wx.showToast({
        title: '请填写所有问题',
        icon: 'none'
      });
      return;
    }

    if(formData.height < 1 || formData.height > 240) {
      wx.showToast({
        title: '身高应在1至240cm之间',
        icon: 'none'
      });
      return;
    }

    if(formData.weight < 1 || formData.weight > 260) {
      wx.showToast({
        title: '体重应在1至260kg之间',
        icon: 'none'
      });
      return;
    }

    try {
      await updateUserInfo({
        user_name: this.data.nickname,
        gender: formData.gender,
        birthday: formData.birthday,
        height: formData.height,
        weight: formData.weight,
        target: formData.goal,
        exercise_frequency: formData.habit
      });

      wx.switchTab({
        url: '/pages/home/home'
      });
    } catch (error) {
      console.error('Update user info error:', error);
      wx.showToast({ title: '更新用户信息失败', icon: 'none' });
    }
  },

  onBirthdayChange(e: any) {
    this.setData({
      birthday: e.detail.value
    });
  },
});
