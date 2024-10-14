import { updatePhoneNumber } from '../../services/api';

Page({
  async getPhoneNumber(e: WechatMiniprogram.CustomEvent) {
    console.log('getPhoneNumber event:', e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      try {
        console.log('Updating phone number...');
        await updatePhoneNumber(e.detail);
        console.log('Phone number updated successfully');
        wx.showToast({ title: '手机号授权成功', icon: 'success' });
        wx.navigateTo({ url: '/pages/questionnaire/questionnaire' });
      } catch (error) {
        console.error('Update phone number error:', error);
        wx.showToast({ title: '手机号更新失败，请稍后重试', icon: 'none' });
      }
    } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      console.log('User denied phone number authorization');
      wx.showToast({ title: '您已拒绝授权手机号', icon: 'none' });
    } else if (e.detail.errMsg === 'getPhoneNumber:fail no permission'){
      console.log('Phone number permission is not open');
      wx.showToast({ title: '请打开手机号权限', icon: 'none' });
    } else {
      console.error('Unexpected error during phone number authorization:', e.detail.errMsg);
      wx.showToast({ title: '手机号授权出错，请稍后重试', icon: 'none' });
    }
  },

  skipPhoneNumber() {
    console.log('User skipped phone number authorization');
    wx.showToast({ title: '已跳过手机号授权', icon: 'none' });
    wx.navigateTo({ url: '/pages/questionnaire/questionnaire' });
  },
});