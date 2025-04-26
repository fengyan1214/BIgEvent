<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessageBox } from 'element-plus'
const loading = ref(false)

//用于存储条件查询的参数
const params = ref({
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
})

const articleList = ref([])
const total = ref(0)

const getArticleList = async () => {
    loading.value = true
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
}
getArticleList()

const onSizeChange = (size) => {
    params.value.pagenum = 1
    params.value.pagesize = size
    getArticleList()
}
const onCurrentChange = (page) => {
    params.value.pagenum = page
    getArticleList()
}
const onSearch = () => {
    params.value.pagenum = 1
    getArticleList()
}

const onReset = () => {
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}

const articleEditRef = ref()
const onAddArticle = () => {
    articleEditRef.value.open({})
}
const onEditArticle = (row) => {
    articleEditRef.value.open(row)
}
const onDeleteArticle = async (row) => {
    await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    await artDelService(row.id)
    // eslint-disable-next-line no-undef
    ElMessage.success('删除成功')
    getArticleList()
}

const onSuccess = (type) => {
    if (type === 'add') {
        params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
    }
    getArticleList()
}
</script>


<template>
    <page-container title="文章管理">
        <article-edit @success="onSuccess" ref="articleEditRef"></article-edit>
        <template #extra>
            <el-button @click="onAddArticle" type="primary">发布文章</el-button>
        </template>
        <el-form inline>
            <el-form-item label="文章分类">
                <channel-select style="width: 120px" v-model="params.cate_id"></channel-select>
            </el-form-item>
            <el-form-item label="发布状态：">
                <el-select style="width: 100px" v-model="params.state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="articleList" style="width: 100%">
            <el-table-column label="文章标题" width="400">
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="cate_name" label="分类">
            </el-table-column>
            <el-table-column prop="pub_date" label="发布时间">
                <template #default="{ row }">
                    {{ formatTime(row.pub_date) }}
                </template>
            </el-table-column>
            <el-table-column prop="state" label="状态">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button plain circle :icon="Edit" @click="onEditArticle(row)" type="primary"></el-button>
                    <el-button plain circle :icon="Delete" @click="onDeleteArticle(row)" type="danger"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
            :page-sizes="[2, 3, 4, 5, 10]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
            @size-change="onSizeChange" @current-change="onCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />
    </page-container>
</template>