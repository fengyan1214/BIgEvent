<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessageBox } from 'element-plus'

const channelList = ref([])
const loading = ref(false)
const getChannelList = async () => {
    loading.value = true
    const res = await artGetChannelsService()
    loading.value = false
    channelList.value = res.data.data
    console.log(channelList.value)
}
getChannelList()

const dialog = ref()

const onAddChannel = () => {
    dialog.value.open()
}

const onEditChannel = (row) => {
    dialog.value.open(row)
}

const onDelChannel = async (row) => {
    ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    }).then(async () => {
        await artDelChannelService(row.id)
        // eslint-disable-next-line no-undef
        ElMessage({ type: 'success', message: '删除成功' })
        getChannelList()
    })

}

</script>
<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button @click="onAddChannel" type="primary"> 添加分类 </el-button>
        </template>

        <el-table v-loading="loading" :data="channelList" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="cate_name"></el-table-column>
            <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <channel-edit ref="dialog" @success="getChannelList"></channel-edit>
    </page-container>
</template>