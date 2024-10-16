import { uploadFoodImage } from "../../services/api";

Page({
  data: {
    imageSrc: '',
    mealType: '早餐',
    mealTypes: ['早餐', '午饭', '晚饭', '零食'],
  },

  handlePlaceholderClick() {
    this.chooseImage();
  },

  handleReplaceImage() {
    this.chooseImage();
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1, // Allow only one image to be selected
      mediaType: ['image'], // Only allow images
      sourceType: ['album', 'camera'], // Allow selection from album or camera
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          imageSrc: tempFilePath
        });
      },
      fail: (err) => {
        console.error('Failed to choose media:', err);
      }
    });
  },

  handleMealTypeChange(e: WechatMiniprogram.RadioGroupChange) {
    this.setData({
      mealType: e.detail.value
    });
  },

  async handleConfirm() {
    console.log('Meal type:', this.data.mealType);
    console.log('Image:', this.data.imageSrc);
    // Handle the confirmation logic here
    const imageSrc = this.data.imageSrc;
    const mealType = this.data.mealType;
    this.setData({
      'mealType': mealType,
      'imageSrc': imageSrc,
    });
    try {
      const res = await uploadFoodImage(mealType, imageSrc);
      const resData = JSON.parse(res).data;
      console.log('Upload successful:',  res);
      console.log(resData);
      // Handle the response data as needed
      wx.setStorageSync('mealSummary', resData);

      this.clearLocalData();
      wx.navigateTo({
        url: '/pages/meal/meal'
      });
    } catch (error) {
      wx.showToast({
        title: '上传失败，请重新上传图片',
        icon: 'none'
      });
      this.clearLocalData();
      wx.switchTab({
        url: '/pages/analysis/analysis'
      });
    }
  },

  clearLocalData() {
    this.setData({
      'mealType': '',
      'imageSrc': ''
    })
  }
});
