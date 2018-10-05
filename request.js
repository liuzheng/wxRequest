let WxCookie = require('./cookie.js');
let admin = '管理员';

function wxRequest(url, config, resolve, reject) {
  let {
    data = {},
      contentType = 'application/json;charset=UTF-8',
      method = 'GET',
      ...other
  } = { ...config
  }
  let header = {
    'content-type': contentType,
    'Cookie': WxCookie.get_cookies(), // 全局变量中获取 cookies
  }
  if (config.method === 'POST' || config.method === 'DELETE') {
    header['X-CSRFToken'] = WxCookie.get_cookie('csrftoken')
  }
  wx.request({
    url: url,
    data: { ...data
    },
    method: method,
    header: header,
    success: (res => {
      if (res.statusCode === 200) {
        //200: 服务端业务处理正常结束
        if (res.data.code === 0) {
          resolve(res)
          return
        } else {
          wx.showModal({
            title: '失败',
            content: res.data.errMsg,
            showCancel: false
          })
          if (reject)
            reject(res)
          return
        }
      } else {
        //其它错误，提示用户错误信息
        if (this._errorHandler != null) {
          //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
          this._errorHandler(res)
        }
        let content = '未知错误，请联系' + admin;
        if (res.data.errMsg) {
          content = res.data.errMsg
        }
        switch (res.data.errMsg) {
          case "request:fail ":
            content = '后台服务器错误，请联系' + admin
        }
        wx.showModal({
          title: '失败',
          content: content,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/index/index"
              })
            }
          }
        })
      }
    }),
    fail: function(error) {
      wx.showModal({
        title: '失败',
        content: '未知错误，请联系' + admin,
        showCancel: false
      })
    }
  })
}

// 获取插件信息
function getPluginInfo() {
  return {
    name: 'wxRequest',
    version: '1.0.0',
    date: '2018-04-14'
  }
}

function setAdmin(value) {
  admin = value;
}

module.exports = {
  wxRequest: wxRequest,
  getPluginInfo: getPluginInfo,
  setAdmin: setAdmin,
}