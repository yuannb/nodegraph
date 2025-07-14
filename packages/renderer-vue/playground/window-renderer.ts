import { createApp, App } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
declare global {
    interface Window {
      Vue?: any;
      ElementPlus?: any;
    }
  }
// 窗口配置
interface WindowOptions {
  width?: number;
  height?: number;
  title?: string;
  features?: string;
}

// 渲染组件到新窗口
export const renderComponentToWindow = async <T extends object>(
  componentName: string,
  props: T = {} as T,
  options: WindowOptions = {}
): Promise<Window | null> => {
  // 动态导入组件
  const componentModule = await import(`../components/${componentName}.vue`);
  const Component = componentModule.default;
  console.log("11111111", Component)
  localStorage.setItem('vueComponentConfig', JSON.stringify({
    componentCode: Component.toString(), // 转换为字符串存储
    props
  }));
  // 创建窗口
  const windowFeatures = [
    `width=${options.width || 800}`,
    `height=${options.height || 600}`,
    'resizable=yes',
    'scrollbars=yes',
    options.features
  ].filter(Boolean).join(',');

  

  const childWindow = window.open(
    '/childpage.html',
    options.title || 'Vue Component',
    windowFeatures
  );

  if (!childWindow) {
    console.error('无法打开新窗口，可能被浏览器阻止');
    return null;
  }

  if (childWindow) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <div id="new-app"></div>
        <script type="module">
      const { createApp } = window.Vue;
      const Component = window.Component;
      const ElementPlus = window.ElementPlus;
      const app = createApp(Component);
      app.use(ElementPlus);
    console.log('cx.Vue2', app, Component);  
    app.mount("#new-app");
        </script>
      </body>
      </html>
    `;
    childWindow.Vue = { createApp };
    console.log('cx.Vue2', childWindow.hasOwnProperty("Vue"));
    childWindow.ElementPlus = ElementPlus;
    childWindow.Component = Component;
    childWindow.componentModule = componentModule;
    const scriptElements = tempDiv.querySelectorAll('script');
    console.log("sssss", scriptElements.length);
    
    if (scriptElements.length > 0) {
        const script = document.createElement('script');
        script.textContent = scriptElements[0].textContent;
        console.log('htmlcontent', script.textContent);
        childWindow.document.body.appendChild(script);
    }
  // 暴露 Vue 和组件到子窗口
  }
  console.log('22222222222222', childWindow);
  console.log('3333333333333', childWindow.Component);
  console.log('444444444444', childWindow.componentModule);
  console.log('555555555555', childWindow.name);

  
  return childWindow;
};