import { getToken } from './auth';

const BASE_URL = 'http://39.105.187.228';

export async function request(url: string, method: 'GET' | 'POST', data?: any) {
  const token = getToken();
  console.log(`URL is ${BASE_URL}${url}`);
  console.log(`data is ${JSON.stringify(data)}`);
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Successfully completed request ' + url);
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  });
}

export async function mediaRequest(url: string, imageSrc: string) {
  const token = getToken();
  console.log(`URL is ${BASE_URL}${url}`);
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${BASE_URL}${url}`,
      name: 'file',
      filePath: imageSrc,
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Successfully completed request ' + url);
          resolve(res.data);
        } else {
          console.log('Unsuccessful response ' + JSON.stringify(res));
          reject(res);
        }
      },
      fail: (err) => {
        console.log(err);
        reject;
      },
    });
  });
}