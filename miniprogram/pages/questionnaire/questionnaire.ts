import { updateUserInfo } from "../../services/api";

Page({

  data: {
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    accessToken: wx.getStorageSync('openId'),
  },

  async formSubmit(e:any) {
    const formData = e.detail.value;
    console.log('Form data:', formData);

    if (!formData.gender || !formData.age || !formData.height || !formData.weight || !formData.goal || !formData.habit) {
      wx.showToast({
        title: '请填写所有问题',
        icon: 'none'
      });
      return;
    }
    
    if(formData.age < 1 || formData.age > 120) {
      wx.showToast({
        title: '年龄应在1至120岁之间',
        icon: 'none'
      });
      return;
    }

    if(formData.height < 1 || formData.height > 300) {
      wx.showToast({
        title: '身高应在1至300cm之间',
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
        user_name: this.data.nickName,
        gender: formData.gender,
        birthday: this.getFormattedBirthday(formData.age),
        height: formData.height,
        weight: formData.age,
        target: formData.goal,
        exercise_frequency: formData.habit
      });

      wx.switchTab({
        url: '/pages/analysis/analysis'
      });
    } catch (error) {
      console.error('Update user info error:', error);
      wx.showToast({ title: '更新用户信息失败', icon: 'none' });
    }
  },

  getFormattedBirthday(age: number) {
    const currentDate = new Date();

    const year = String(currentDate.getFullYear() - age);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so we add 1
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Format as yyyy-mm-dd
    console.log(`Formatted birthday is ${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
  }
});
