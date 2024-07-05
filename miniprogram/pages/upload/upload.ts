Page({
  data: {
    imageSrc: ''
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

        this.uploadFoodImage();
      },
      fail: (err) => {
        console.error('Failed to choose media:', err);
      }
    });
  },

  uploadFoodImage() {
    const app = getApp();
    const imageSrc = this.data.imageSrc

    wx.uploadFile({
      url: 'http://39.105.187.228/food/upload_food_image/?meal_type=%E5%8D%88%E9%A5%AD', // The URL from the curl command
      filePath: imageSrc, // Path of the file to be uploaded
      name: 'file', // Name of the form data field
      header: {
        'accept': 'application/json',
        'Authorization': app.globalData.auth,
        'Content-Type': 'multipart/form-data'
      },
      success: (res) => {
        console.log('Upload successful:', res.data);
        // Handle the response data as needed
        console.log(res.data);
      },
      fail: (err) => {
        console.error('Upload failed:', err);
      }
    });
  }
});
