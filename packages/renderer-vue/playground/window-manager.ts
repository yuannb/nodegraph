import { renderComponentToWindow } from './window-renderer';

export class WindowManager {
  private windows: Map<string, Window> = new Map();

  // 打开组件窗口
  async openComponent<T extends object>(
    name: string,
    componentName: string,
    props: T = {} as T,
    options = {}
  ): Promise<Window | null> {
    const window = await renderComponentToWindow(componentName, props, options);
  console.log('Vue', window.Vue);
    if (window) {
      this.windows.set(name, window);
      console.log("windeo", window);
      
      
      // 监听窗口关闭
      const checkClosed = () => {
        if (window.closed) {
          this.windows.delete(name);
        } else {
          requestAnimationFrame(checkClosed);
        }
      };
      
      requestAnimationFrame(checkClosed);
    }
    return window;
  }

  // 获取窗口
  getWindow(name: string): Window | undefined {
    return this.windows.get(name);
  }

  // 关闭窗口
  closeWindow(name: string): boolean {
    const window = this.windows.get(name);
    if (window && !window.closed) {
      window.close();
      this.windows.delete(name);
      return true;
    }
    return false;
  }

  // 关闭所有窗口
  closeAll(): void {
    this.windows.forEach((window) => {
      if (!window.closed) window.close();
    });
    this.windows.clear();
  }
}