<template>
    <div>
        <DraggableDialog
      v-model="dialogVisible"
      title="自定义可拖动对话框"
      width="600px"
      :draggable="true"
      :resizable="true"
      :maximizable="true"
    >
      <template #content>
        <p>这是一个可拖动、可缩放的对话框</p>
        <el-input v-model="inputValue" placeholder="输入内容" class="mt-4" />
      </template>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </template>
    </DraggableDialog>

    </div>
</template>
  
  <script lang="ts" setup>
import ElementPlus from 'element-plus';
import { ElButton, ElDialog } from 'element-plus';
import {ref} from 'vue'
import DraggableDialog from './DraggableDialog.vue';
const dialogVisible = ref(true);
const inputValue = ref('');
  </script>
  
  