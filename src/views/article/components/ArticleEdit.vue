<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService, artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const editorRef = ref()
const emit = defineEmits(['success'])
//用于初始化
const defaultFrom = ref({
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: ''
})
const formModel = ref({ ...defaultFrom.value })


const img = ref('')
const onUploadFile = (uploadFile) => {
    //添加图片时，不是立即上传图片至服务器而是生成一个本地路径
    img.value = URL.createObjectURL(uploadFile.raw)
    formModel.value.cover_img = uploadFile.raw
}

const visibleDrawer = ref(false)
async function imageUrlToFile(url, fileName) {
    try {
        // 第一步：使用axios获取网络图片数据
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageData = response.data;

        // 第二步：将图片数据转换为Blob对象
        const blob = new Blob([imageData], { type: response.headers['content-type'] });

        // 第三步：创建一个新的File对象
        const file = new File([blob], fileName, { type: blob.type });

        return file;
    } catch (error) {
        console.error('将图片转换为File对象时发生错误:', error);
        throw error;
    }
}
const open = async (row) => {
    visibleDrawer.value = true
    if (row.id) {
        console.log('编辑回显')
        const res = await artGetDetailService(row.id)
        formModel.value = res.data.data
        img.value = baseURL + formModel.value.cover_img
        // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
        // 网络图片转成 file 对象, 需要转换一下
        formModel.value.cover_img = await imageUrlToFile(img.value, formModel.value.cover_img)
    }
    else {
        formModel.value = { ...defaultFrom }
        img.value = ''
        editorRef.value.setHTML('')
    }
}
defineExpose({
    open
})
//两个按钮只是对应不同的状态，其它逻辑一致
const onPublish = async (state) => {
    formModel.value.state = state
    //将formModel转化成接口要求的数据类型
    const fd = new FormData()
    for (let key in formModel.value) {
        fd.append(key, formModel.value[key])
    }

    if (formModel.value.id) {
        await artEditService(fd)
        // eslint-disable-next-line no-undef
        ElMessage.success('修改成功')
        visibleDrawer.value = false
        emit('success', 'edit')
    } else {
        await artPublishService(fd)
        // eslint-disable-next-line no-undef
        ElMessage.success('添加成功')
        visibleDrawer.value = false
        emit('success', 'add')
    }
}




</script>

<template>
    <el-drawer title="我是标题" v-model="visibleDrawer" :direction="rtl" size="50%">
        <el-form :model="formModel" ref="'fromRef'" label-width="100px">
            <el-form-item label="文章标题">
                <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <channel-select v-model="formModel.cate_id" style="width: 100%;"></channel-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
                <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false"
                    :on-change="onUploadFile">
                    <img v-if="img" :src="img" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor">
                    <QuillEditor ref="editorRef" theme="snow" v-model:content="formModel.content" contentType="html">
                    </QuillEditor>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
                <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<style scoped lang="scss">
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>