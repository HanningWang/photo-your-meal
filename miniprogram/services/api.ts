import { request } from '../utils/request';

export async function login(data: { platform: string; code: string }) {
  return request(`/user/login?platform=app&code=${data.code}`, 'POST');
}

export async function getUserInfo() {
  return request('/user/info', 'GET');
}

export async function updateWechatInfo(data: any) {
  return request('/user/update_wechat_info', 'POST', data);
}

export async function updateUserInfo(data: any) {
  return request('/user/update_user_info', 'POST', data);
}

export async function updatePhoneNumber(data: any) {
  return request('/user/update_phone', 'POST', data);
}

export async function getDailyEnergy() {
  return request('/user/daily_energy', 'GET');
}

export async function getFoodRecords(formattedDate: string) {
  return request(`/food/food_records?record_date=${formattedDate}`, 'GET');
}