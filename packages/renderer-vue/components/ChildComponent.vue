<template>
  <div ref="containerRef" class="three-container" />
</template>

<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance } from 'vue';
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {emitter} from '../playground/event-bus'
import SceneObjectManager from './objectManager';
import { threadId } from 'worker_threads';

// 定义组件属性和状态
const containerRef = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let cube: THREE.Mesh | null = null;
let controls: OrbitControls | null = null;
let animationId: number | null = null;
let objectManager : SceneObjectManager | null = null;
// 创建自定义着色器材质
const material = new THREE.ShaderMaterial({
  uniforms: {
    uScreenSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uPointSize: { value: 0.01 } // 点大小占屏幕宽度的比例（1%）
  },
  vertexShader: `
    uniform vec2 uScreenSize;
    uniform float uPointSize;
    
    void main() {
      // 计算点在裁剪空间的位置
      vec4 clipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      
      // 将裁剪空间坐标转换为NDC空间（[-1,1]范围）
      vec3 ndcPosition = clipPosition.xyz / clipPosition.w;
      
      // 计算屏幕空间大小（基于屏幕宽度）
      float pixelSize = uScreenSize.x * uPointSize;
      
      // 将像素大小转换为裁剪空间大小
      float clipSpaceSize = pixelSize * 2.0 / uScreenSize.x;
      
      // 设置点大小（与距离无关）
      gl_PointSize = clipSpaceSize * uScreenSize.y;
      
      gl_Position = clipPosition;
    }
  `,
  fragmentShader: `
    void main() {
      // 圆形点（可选）
      if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
  transparent: true
});
// 初始化Three.js场景
const initThree = () => {
  const container = containerRef.value;
  if (!container) return;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // 将渲染器DOM添加到容器
  container.appendChild(renderer.domElement);

  // 添加控制器
  if (camera && renderer) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  }

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
  gridHelper.rotation.z = Math.PI / 2; // 绕Z轴旋转90度
  scene.add(gridHelper);
  objectManager = new SceneObjectManager(scene);

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
};

// 处理窗口大小变化
const handleResize = () => {
  const container = containerRef.value;
  if (!container || !camera || !renderer) return;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // 更新控制器
  if (controls) controls.update();
  const targetSizeRatio = 0.02; // 2%
  
  // 渲染场景
  if (scene && camera && renderer) {
    renderer.render(scene, camera);
  }
};

// 清理资源
const cleanup = () => {
  // 停止动画循环
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // 释放控制器
  if (controls) {
    controls.dispose();
    controls = null;
  }

  // 释放渲染器
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer = null;
  }

  // 移除DOM元素
  const container = containerRef.value;
  if (container && renderer) {
    const canvas = container.querySelector('canvas');
    if (canvas) container.removeChild(canvas);
  }

  // 移除事件监听器
  window.removeEventListener('resize', handleResize);

  // 清理场景
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
    scene = null;
  }

  camera = null;
  cube = null;
};

const selectSurfaceMaterial = new THREE.MeshBasicMaterial({
  color: 0xFF0000,
  side: THREE.DoubleSide // 双面渲染
});

const normalSurfaceMaterial = new THREE.MeshBasicMaterial({
  color: 0x87CEEB,
  side: THREE.DoubleSide // 双面渲染
});
function removeObject(object: THREE.Object3D) {
  // 从场景中移除对象
  scene?.remove(object);
  
  // 释放几何体资源（如果需要）
  if ((object as THREE.Mesh).geometry) {
    (object as THREE.Mesh).geometry.dispose();
  }
  
  // 释放材质资源（如果需要）
  if ((object as THREE.Mesh).material) {
    const material = (object as THREE.Mesh).material;
    if (Array.isArray(material)) {
      material.forEach(m => m.dispose());
    } else {
      material.dispose();
    }
  }
}

interface PointData
{
  points: number[];
  type: number;
  indexs?: number[];
}

interface DiscType
{
  [key : string] : PointData;
}

function hiddenGeometry(nodeList: [string])
{
    for (const str in nodeList)
    {
      let obj3d = objectManager?.getObject(nodeList[str]);
      if (obj3d != undefined)
      {
        obj3d!.visible = false;
      }
    }
    return;
}

function changeColor(nodeList: [string])
{
  console.log("nodelist: ", nodeList);
  for (const str in nodeList) {
    let obj3d = objectManager?.getObject(nodeList[str]);
    if (obj3d != undefined) {
      if (obj3d instanceof THREE.Mesh) {
        // 单一材质
        console.log("sucess");
        let mesh3d = obj3d as THREE.Mesh;
        mesh3d.material = selectSurfaceMaterial;
      }
    }
  }
    return;
}

function revertColor(nodeList: [string])
{
    for (const str in nodeList)
    {
      let obj3d = objectManager?.getObject(nodeList[str]);
      if (obj3d != undefined)
      {
        if (obj3d instanceof THREE.Mesh) {
          // 单一材质
          let mesh3d = obj3d as THREE.Mesh;
          mesh3d.material = normalSurfaceMaterial;
        }
      }
    }
    return;
}

function renderGeometry(result:any)
{
    objectManager?.removeAllObjects();
    const points: DiscType = result['points'];

    for (let value in points) {
      console.log(value);
      const p = points[value].points;
      console.log(p);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
      const pt = new THREE.Points(geometry, material);
      objectManager?.addObject(pt, value);
    }

    const curves: DiscType | null = result['curve_disc'];

    if (curves != null) {
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 });
      for (let value in curves) {
        console.log(value);
        const p = curves[value].points;
        console.log(p);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
        if (curves[value].indexs != undefined) {
          geometry.setIndex(curves[value].indexs);
        }
        const curve = new THREE.Line(geometry, lineMaterial);
        objectManager?.addObject(curve, value);
      }
    }

    const surfaces: DiscType | null = result['surf_disc'];

    if (surfaces != null) {
      const surfaceMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        side: THREE.DoubleSide // 双面渲染
      });
      for (let value in surfaces) {
        console.log(value);
        const p = surfaces[value].points;
        console.log(p);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
        if (surfaces[value].indexs != undefined) {
          const flatten = surfaces[value].indexs.flat();
          geometry.setIndex(flatten);
        }
        const mesh = new THREE.Mesh(geometry, normalSurfaceMaterial);
        objectManager?.addObject(mesh, value);
      }
    }
}
window.addEventListener('message', (results : any) => {

  const result = results.data;
  const f = 'method' in result;
  if (f == false)
  {
    console.log("f: false");
    return;
  }

  const method = result.method;
  console.log("method:", method);
  if (method == 'hidden')
  {
    hiddenGeometry(result.nodeList);
  }
  else if (method == 'changeColor')
  {
    changeColor(result.nodeList);
  }
  else if (method == 'revertColor')
  {
    revertColor(result.nodeList);
  }
  else if (method == 'renderGeometry')
  {
    renderGeometry(result.nodeList);
  }
  return;
});
// 生命周期钩子
onMounted(() => {
  initThree();
  console.log("fasdfafdasdfa");
  animate();
});

onBeforeUnmount(() => {
  cleanup();
});

// 响应式监听容器尺寸变化
watchEffect(() => {
  if (renderer && containerRef.value) {
    renderer.setSize(
      containerRef.value.clientWidth,
      containerRef.value.clientHeight
    );
  }
});
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>