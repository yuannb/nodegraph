import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import ChildComponent from './ChildComponent.vue';

// 创建独立应用
const app = createApp(ChildComponent, {
  title: '独立子窗口',
  initialMessage: '这是一个独立的 Vue 组件'
});

app.use(ElementPlus);
app.mount('#app');