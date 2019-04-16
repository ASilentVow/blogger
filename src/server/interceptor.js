import axios from 'axios'
import iview from 'iview'

// 超时时间
axios.defaults.timeout = 5000
// http请求拦截器
axios.interceptors.request.use(config => {
    iview.Spin.show({
        render: (h) => {
            return h('div', [
                h('Icon', {
                    'class': 'demo-spin-icon-load',
                    props: {
                        type: 'ios-loading',
                        size: 18
                    }
                }),
                h('div', 'Loading')
            ])
        }
    });
  return config
}, error => {
  iview.Spin.hide()
  iview.Message.error('加载超时')
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
  iview.Spin.hide()
  return data
}, error => {
  iview.Spin.hide()
  iview.Message.error('加载失败')
  return Promise.reject(error)
})

export default axios
