/*
 * @Author: shizhidi
 * @Date: 2018-02-03 12:53:42
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-08 15:39:29
 */

 /**
 * 对axios的全局配置
 */

// 引入axios
import axios from 'axios'
// 超时时间
axios.defaults.timeout = 5000
//添加请求拦截器
axios.interceptors.request.use(function(config){
  //在发送请求之前做某事
  //console.log('请求地址：'+ config.Referer);
  return config;
},function(error){
  //请求错误时做些事，日志处理等
  return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(function(response){
  //对响应数据做些事
  return response;
},function(error){
  //响应请求错误时做些事
  return Promise.reject(error);
});

export default axios
