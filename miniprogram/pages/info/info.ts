import { getUserInfo, updateUserInfo } from "../../services/api";

Page({
  data: {
    isEditing: false,
    userInfo: {
      gender: '',
      height: 175,
      weight: 70,
      birthday: '1990-01-01',
      exercise_frequency: '偶尔',
      goal: '减重'
    },
    nickname: wx.getStorageSync('nickname'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    originalUserInfo: {} as any,
  },

  async onLoad() {
    // Load user info from storage when the page loads
    const userInfoRes = await getUserInfo();
    const storedUserInfo = userInfoRes.data;
    console.log('User info ' + JSON.stringify(storedUserInfo));
    if (storedUserInfo) {
      this.setData({
        userInfo: storedUserInfo,
        originalUserInfo: JSON.parse(JSON.stringify(storedUserInfo)) // Create a deep copy
      });
    }
  },

  handleEdit() {
    this.setData({
      isEditing: !this.data.isEditing,
      originalUserInfo: JSON.parse(JSON.stringify(this.data.userInfo)) // Store original state when editing starts
    });
  },

  handleChange(e: WechatMiniprogram.CustomEvent) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`userInfo.${field}`]: value
    });
  },

  async handleSave() {
    const { weight, height } = this.data.userInfo;
    
    if (weight < 1 || weight > 260) {
      wx.showToast({
        title: '体重应在1至260kg之间',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (height < 1 || height > 240) {
      wx.showToast({
        title: '身高应在1至240cm之间',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const hasChanges = JSON.stringify(this.data.userInfo) !== JSON.stringify(this.data.originalUserInfo);
    
    if (hasChanges) {
      try {
        await updateUserInfo(this.data.userInfo);
        this.setData({
          isEditing: false,
          originalUserInfo: JSON.parse(JSON.stringify(this.data.userInfo)),
        });
        wx.showToast({ title: '信息保存成功', icon: 'success' });
      } catch (error) {
        console.error('Failed to update user info:', error);
        wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      }
    } else {
      this.setData({
        isEditing: false,
      });
    }
  },

  handleRadioChange(e: WechatMiniprogram.RadioGroupChange) {
    this.setData({
      'userInfo.gender': e.detail.value
    });
  },

  handlePickerChange(e: WechatMiniprogram.PickerChange) {
    const { field } = e.currentTarget.dataset;
    let value: string;
    
    if (field === 'exercise_frequency') {
      const exerciseOptions = ['从不', '偶尔', '经常'];
      value = exerciseOptions[Number(e.detail.value)];
    } else if (field === 'target') {
      const targetOptions = ['减重', '维持', '增肌'];
      value = targetOptions[Number(e.detail.value)];
    } else {
      value = e.detail.value;
    }

    this.setData({
      [`userInfo.${field}`]: value
    });
  },

  handleBack() {
    wx.switchTab({
      url: '/pages/user/user'
    });
  }
});
