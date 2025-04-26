<script setup>
defineProps({
    title: {
        required: true,
        type: String
    }
})
</script>

<template>
    <!-- 定义一个el-card组件，class为page-container -->
    <el-card class="page-container">
        <!-- 定义el-card组件的头部 -->
        <template #header>
            <!-- 定义头部内容 -->
            <div class="header">
                <!-- 显示标题 -->
                <span>{{ title }}</span>
                <!-- 定义额外内容 -->
                <div class="extra">
                    <!-- 使用slot插槽，name为extra -->
                    <slot name="extra"></slot>
                </div>
            </div>
        </template>
        <!-- 使用slot插槽 -->
        <slot></slot>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>