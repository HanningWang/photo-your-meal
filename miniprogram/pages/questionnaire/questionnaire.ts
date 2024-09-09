Page({

  data: {
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    accessToken: wx.getStorageSync('openId'),
  },

  formSubmit(e:any) {
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

    wx.request({
      url: 'http://39.105.187.228/user/update_info', // The URL from the curl command
      method: 'POST', // The HTTP method
      header: {
        'accept': 'application/json', // The Accept header
        'Authorization': `Bearer ${this.data.accessToken}`, // The Authorization header
        'Content-Type': 'application/json' // The Content-Type header
      },
      data: {
        user_name: this.data.nickName,
        gender: formData.gender,
        birthday: this.getFormattedBirthday(formData.age),
        height: formData.height,
        weight: formData.age,
        target: formData.goal,
        exercise_frequency: formData.habit
      },
      success: (res) => {
        console.log('User Info Updated:', res.data);
        // Handle the response data as needed
        wx.switchTab({
          url: '/pages/home/home'
        })
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
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
