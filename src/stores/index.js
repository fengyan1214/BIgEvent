import persist from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'


const pinia = createPinia()
pinia.use(persist)
export default pinia

export * from '@/stores/modules/user'