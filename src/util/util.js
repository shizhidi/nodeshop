/*
 * @Author: shizhidi
 * @Date: 2018-02-08 21:47:49
 * @description 定义一些全局的公共常量或工具函数
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-09 14:11:26
 */

export default {
  install(Vue, options) {
    Vue.prototype.setCookie = function () {
      var Days = 30;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    Vue.prototype.getCookie = function (name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    }

    Vue.prototype.delCookie = function (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }

  }
}
