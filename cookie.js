function set_cookie_from_header(data) {
  let Cookie = {};
  let cookie = data.match(/([\w\-.]*)=([^=;]+);/g)
  for (let i = 0; i < cookie.length / 4; i++) {
    let index = i * 4
    Cookie[cookie[index].split('=')[0]] = {
      'value': cookie[index].split('=')[1],
    }
    Cookie[cookie[index].split('=')[0]][cookie[index + 1].split('=')[0]] = cookie[index + 1].split('=')[1]
    Cookie[cookie[index].split('=')[0]][cookie[index + 2].split('=')[0]] = cookie[index + 2].split('=')[1]
    Cookie[cookie[index].split('=')[0]][cookie[index + 3].split('=')[0]] = cookie[index + 3].split('=')[1]
  }
  wx.setStorageSync("Cookies", Cookie)
}

function get_cookies() {
  let Cookies = wx.getStorageSync('Cookies');
  let cookie = ''
  if (Cookies) {
    for (let i in Cookies) {
      if (!check_expire(Cookies[i]['expires'])) {
        delete Cookies[i]
        continue
      }
      cookie += i + '=' + Cookies[i]['value'] + ' '
    }
  }
  return cookie
}

function get_cookie(name) {
  let Cookies = wx.getStorageSync('Cookies');
  let cookie = Cookies[name]

  if (Cookies && cookie && check_expire(cookie['expires'])) {
    return cookie['value'].replace(';', '')
  }
  return ''
}


function check_expire(expire) {
  if (Date.parse(expire) < Date.now()) {
    return false
  } else {
    return true
  }
}

module.exports = {
  set_cookie_from_header: set_cookie_from_header,
  get_cookies: get_cookies,
  get_cookie: get_cookie,
}