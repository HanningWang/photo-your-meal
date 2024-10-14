const TOKEN_KEY = 'user_token';

export function setToken(token: string) {
  wx.setStorageSync(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return wx.getStorageSync(TOKEN_KEY);
}

export function removeToken() {
  wx.removeStorageSync(TOKEN_KEY);
}