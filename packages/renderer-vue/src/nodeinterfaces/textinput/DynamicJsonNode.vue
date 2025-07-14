<template>

  <li class="menu-item">


  <li v-if="isPrimitive" class='expanded '>
  <li v-if="isString" class="sub-menu">"{{ data }}"</li>
  <li v-else-if="isNumber || isBoolean" class="sub-menu">{{ data }}</li>
  <li v-else-if="isNull" class="sub-menu">null</li>
  <li v-else class="sub-menu">undefined</li>
  </li>

  <span v-else-if="isArray">
    <div v-for="(item, index) in data" :key="index">
      <ul>
        <DynamicJsonNode :data="item" />
      </ul>
    </div>

  </span>

  <span v-else-if="isObject" class="menu-item">

    <div v-for="(item2, index) in data" :key="index">
      <!-- <i
        class="arrow-icon"
        @click="toggle(index)"
        :class="[arrowIconClass(index), {'expanded': expandedMap.get(index)}]"
    > -->
      <details>
        <summary>
          {{index}}
        </summary>
          <p>
            <span>{{ item2[0] }}</span>
          <ul v-if="expandedMap.get(index)">
            <DynamicJsonNode :data="item2[1]" />
          </ul>
          </p>
      </details>
      <!-- </i> -->
    </div>
  </span>

  </li>

</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, PropType, reactive, onMounted } from 'vue';

  const props = defineProps( {
    data: {
      type: null as unknown as PropType<any>,
      required: true
    },
    root: {
      type: Boolean,
      default: false
    }
    });
    const isExpanded = ref(false);
    const toggleExpand = () => {
    isExpanded.value =!isExpanded.value;
    console.log("aaaaaaa", isExpanded)
    };
    let expanded = ref(false);
    
    const hitExpand = () => 
    {
        expanded.value = !expanded.value;
    }

    const expandedMap = reactive(new Map<any, boolean>());
    expandedMap.set(0, false);
    expandedMap.set(1, false);
    expandedMap.set(2, false);
    expandedMap.set(3, false);
    
    const isPrimitive = computed(() => 
      typeof props.data !== 'object' || props.data === null
    );
    
    const isString = computed(() => typeof props.data === 'string');
    const isNumber = computed(() => typeof props.data === 'number');
    const isBoolean = computed(() => typeof props.data === 'boolean');
    const isNull = computed(() => props.data === null);
    const isArray = computed(() => Array.isArray(props.data));
    const isObject = computed(() => 
      typeof props.data === 'object' && props.data !== null
    );
    
    const arrowIconClass = (index : any) => {
        return expandedMap.get(index) == true? 'fa fa-chevron-down' : 'fa fa-chevron-right';
    };
    const lastKey = computed(() => {
      if (!isObject.value) return '';
      return Object.keys(props.data).pop() || '';
    });

    const toggle = (index: any) => 
    {
        expandedMap.set(index, !expandedMap.get(index));
    };

    onMounted(() => 
    {
        if (isArray && props.data != null)
        {
            let a = props.data as Array<any>;
            let length = a.length;
            for (let index = 0; index < length; ++index)
            {
                expandedMap.set(index, false);
            }
        }
        else if (isObject && props.data != null)
        {
            let obj = props.data as Object;
            Object.entries(obj).forEach(
            ([key, value]) =>
            {
                expandedMap.set(key, false);
            });
        }
    });

</script>

<style scoped>
.menu-item {
  display: flex; /* 使用Flex布局 */
  flex-direction: column; /* 水平排列 */
  text-align: left;
}
.menu-item-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.menu-item-header:hover {
  background-color: #157c15;
}
.arrow-icon {
  background-color: #7c151c;
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.2s ease;
}
.expanded.arrow-icon {
  background-color: #380de2;
}

.sub-menu {
  padding-left: 0px;
  transition: max-height 0.3s ease;
  overflow: hidden;
  max-height: 0;
}
.menu-item:hover >.sub-menu,
.expanded >.sub-menu {
  color:#d2f00d;
  max-height: 1000px; /* 足够大的值以显示所有子项 */
}
ul {
  margin: 1px;
  padding-left: 10px;
}
li{
  list-style: none;
}
</style>
