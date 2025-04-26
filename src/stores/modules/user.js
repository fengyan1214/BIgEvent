import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'
// 用户模块
// 导出一个名为 useUserStore 的函数，该函数使用 defineStore 定义一个名为 'big-user' 的 store
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const setToken = (t) => (token.value = t) // 设置 token
    const removeToken = () => { token.value = {} }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() // 请求获取数据
      user.value = res.data.data
    }
    const setUser = (obj) => user.value = obj

    const userAcount = ref({})
    const setUserAcount = ({ username, password }) => {
      userAcount.value.username = username
      userAcount.value.password = password
    }
    const removeUserAcount = () => { userAcount.value = {} }

    return { token, setToken, removeToken, user, getUser, setUser, userAcount, setUserAcount, removeUserAcount }
  },
  {
    persist: true // 持久化
  }
)