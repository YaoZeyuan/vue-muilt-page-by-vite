import axios from 'axios'

const http = axios.create()

// http response 拦截器，统一拦截错误
http.interceptors.response.use(
    response => {
        // 需要主动规定错误状态码
        if (response.data.code === 10000) {
            //alert(41);
            //authStore.commit('clearAuthToken')
            //router.push({path:'/login'})
            // localStorage.removeItem('token')
            // 跳转到登录页
            // router.push({ path: '/' })
        }
        return response;
    },
)

export default http