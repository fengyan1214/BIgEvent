<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const rules = ref({
    oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== form.value.newPassword) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ]
})
const submitForm = () => {
    userStore.changePassword(form.value).then(() => {
        // eslint-disable-next-line no-undef
        ElMessage({
            message: '密码修改成功',
            type: 'success'
        })
    })
}
</script>
<template>
    <div class="user-password">
        <!-- 基于elementplus的页面，需要输入原来的密码，新密码，确认密码，下面还有一个确认修改的按钮 -->
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>