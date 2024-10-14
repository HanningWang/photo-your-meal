import { uploadFoodImage } from "../../services/api";

Page({
  data: {
    imageSrc: '',
    mealType: '',
    accessToken: wx.getStorageSync('openId')
  },

  chooseMedia() {
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

  formSubmit(e:any) {
    const formData = e.detail.value;
    console.log(formData)
    this.uploadFoodImage(formData);
  },

  async uploadFoodImage(formData: any) {
    const imageSrc = this.data.imageSrc;
    const mealType = formData.meal_type;
    wx.setStorageSync('mealType', formData.meal_type);
    this.setData({
      'mealType': formData.meal_type,
      'imageSrc': this.data.imageSrc,
    })
    console.log('Meal type is ' + encodeURIComponent(mealType));

    try {
      const res = await uploadFoodImage(mealType, imageSrc);
      const resData = JSON.parse(res).data;
      console.log('Upload successful:',  res);
      // Handle the response data as needed
      wx.setStorageSync('mealSummary', resData);

      this.clearLocalData();
      wx.navigateTo({
        url: '/pages/summary/summary'
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
