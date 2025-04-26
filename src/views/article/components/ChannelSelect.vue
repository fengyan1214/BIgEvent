<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
defineProps({
    modelValue: {
        type: [Number, String]
    }
})
//下拉框的选项通过发送请求获得，而下拉框的选中的值需要传递给父组件，因此父组件使用v-model传递变量，再通过emit将值传递回去
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
    const res = await artGetChannelsService()
    channelList.value = res.data.data
}
getChannelList()
</script>

<template>
    <!-- 这里el-select需要一个变量绑定选择框的值，使用的是v-model，但是变量来自父组件不能直接修改，因此需要将v-model拆解 -->
    <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
        <el-option v-for="item in channelList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
    </el-select>
</template>