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

    wx.setStorageSync('mealType', formData.meal_type);
    wx.setStorageSync('imgSrc', this.data.imageSrc);
    this.setData({
      'mealType': formData.meal_type,
      'imageSrc': this.data.imageSrc,
    })

    wx.navigateTo({
      url: '/pages/summary/summary'
    });
  },

  uploadFoodImage(formData: any) {
    const imageSrc = this.data.imageSrc;
    const mealType = formData.meal_type;
    console.log('Meal type is ' + mealType)
    console.log('Encoded meal type is ' + encodeURIComponent(mealType))

    wx.uploadFile({
      url: `http://39.105.187.228/food/upload_food_image/?meal_type=${encodeURIComponent(mealType)}`, // The URL from the curl command
      filePath: imageSrc, // Path of the file to be uploaded
      name: 'file', // Name of the form data field
      header: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.data.accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
      success: (res) => {
        console.log('Upload successful:', res.statusCode, res.data);
        // Handle the response data as needed
        wx.setStorageSync('mealSummary', res.data);

        this.clearLocalData();
      },
      fail: (err) => {
        console.error('Upload failed:', err);
        wx.showToast({
          title: '上传失败，请重新上传图片',
          icon: 'none'
        })
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    });
  },


  clearLocalData() {
    this.setData({
      'mealType': '',
      'imageSrc': ''
    })
  }
});
