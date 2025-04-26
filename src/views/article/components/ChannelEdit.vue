<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'

const emit = defineEmits(['success'])
const dialogVisible = ref(false)

const formModel = ref({
    cate_name: '',
    cate_alias: ''
})
const rules = {
    cate_name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
        }
    ],
    cate_alias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
        }
    ]
}
const formRef = ref()
const onSubmit = async () => {
    await formRef.value.validate()
    formModel.value.id
        ? await artEditChannelService(formModel.value)
        : await artAddChannelService(formModel.value)
    // eslint-disable-next-line no-undef
    ElMessage({
        type: 'success',
        message: formModel.value.id ? '编辑成功' : '添加成功'
    })
    dialogVisible.value = false
    emit('success')//通过发送请求修改了数据的源头，需要通知父组件刷新数据
}

const open = async (row) => {
    dialogVisible.value = true
    formModel.value = { ...row }//父组件传来数据，子组件不能进行修改，而是提交请求，修改数据的源头
}
defineExpose({
    open
})
</script>

<template>
    <el-dialog v-model="dialogVisible" width="30%" :title="formModel.id ? '编辑分类' : '添加分类'">
        <div>
            <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="formModel.cate_name" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="formModel.cate_alias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template v-slot:footer>
            <div>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="onSubmit" type="primary">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>