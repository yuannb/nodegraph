import * as THREE from 'three';

/**
 * 场景对象管理器，负责在Three.js场景中添加和删除3D对象
 */
class SceneObjectManager {
    private scene: THREE.Scene;
    private objects: Map<string, THREE.Object3D>;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.objects = new Map();
    }

    /**
     * 向场景中添加一个3D对象
     * @param object 要添加的3D对象
     * @param objectId 对象的唯一标识符
     * @param parentId 可选的父对象标识符，默认为场景根
     * @returns 添加成功返回true，失败返回false
     */
    addObject(object: THREE.Object3D, objectId: string, parentId: string = ''): boolean {
        if (this.objects.has(objectId)) {
            console.warn(`对象 ${objectId} 已存在，添加失败`);
            return false;
        }

        try {
            // 如果指定了父对象，尝试将对象添加到父对象
            if (parentId && this.objects.has(parentId)) {
                this.objects.get(parentId)?.add(object);
            } else {
                // 否则直接添加到场景根
                this.scene.add(object);
            }
            
            // 存储对象引用，以便后续管理
            this.objects.set(objectId, object);
            return true;
        } catch (error) {
            console.error(`添加对象 ${objectId} 失败:`, error);
            return false;
        }
    }

    /**
     * 从场景中删除一个3D对象
     * @param objectId 要删除的对象的唯一标识符
     * @param recursive 是否递归删除所有子对象，默认为true
     * @returns 删除成功返回true，失败返回false
     */
    removeObject(objectId: string, recursive: boolean = true): boolean {
        const object = this.objects.get(objectId);
        
        if (!object) {
            console.warn(`对象 ${objectId} 不存在，删除失败`);
            return false;
        }

        try {
            // 从父对象中移除
            const parent = object.parent;
            if (parent) {
                parent.remove(object);
            }

            // 如果是递归删除，释放所有子对象资源
            if (recursive && object.children.length > 0) {
                this.disposeObjectRecursively(object);
            }

            // 从管理映射中移除
            this.objects.delete(objectId);
            return true;
        } catch (error) {
            console.error(`删除对象 ${objectId} 失败:`, error);
            return false;
        }
    }
    /**
     * 从场景中删除所有3D对象
     * @param objectId 要删除的对象的唯一标识符
     * @param recursive 是否递归删除所有子对象，默认为true
     * @returns 删除成功返回true，失败返回false
     */
  removeAllObjects(recursive: boolean = true): boolean {
    for (const [objectId, object] of this.objects)
    {
        if (!object) {
            this.objects.delete(objectId);
            continue;
        }

        try {
            // 从父对象中移除
            const parent = object.parent;
            if (parent) {
                parent.remove(object);
            }

            // 如果是递归删除，释放所有子对象资源
            if (recursive && object.children.length > 0) {
                this.disposeObjectRecursively(object);
            }

            // 从管理映射中移除
            this.objects.delete(objectId);
        } catch (error) {
            console.error(`删除对象 ${objectId} 失败:`, error);
            return false;
        }
    }
    return true;
    
}

    /**
     * 递归释放对象及其子对象的资源
     * @param object 要释放的3D对象
     */
    private disposeObjectRecursively(object: THREE.Object3D): void {
        object.traverse((child) => {
            // 释放材质
            if ((child as THREE.Mesh).material) {
                const material = (child as THREE.Mesh).material;
                if (Array.isArray(material)) {
                    material.forEach(m => m.dispose());
                } else {
                    material.dispose();
                }
            }

            // 释放几何体
            if ((child as THREE.Mesh).geometry) {
                (child as THREE.Mesh).geometry.dispose();
            }

            // 移除子对象
            if (child.parent) {
                child.parent.remove(child);
            }
        });
    }

    /**
     * 获取场景中的对象
     * @param objectId 对象标识符
     * @returns 返回找到的对象或undefined
     */
    getObject(objectId: string): THREE.Object3D | undefined {
        return this.objects.get(objectId);
    }

    /**
     * 检查对象是否存在
     * @param objectId 对象标识符
     * @returns 存在返回true，否则返回false
     */
    hasObject(objectId: string): boolean {
        return this.objects.has(objectId);
    }

    /**
     * 获取所有管理的对象
     * @returns 对象映射
     */
    getAllObjects(): Map<string, THREE.Object3D> {
        return this.objects;
    }
}

export default SceneObjectManager; 