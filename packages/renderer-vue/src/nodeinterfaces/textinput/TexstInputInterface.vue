<template>
    <div>
        <DynamicJsonNode :data= "modelValue === undefined ? 'undefined' : 
                modelValue.data === undefined ? 'undefined' : modelValue.data" :root="true" />
    </div>
</template>

<script lang="ts">
import { computed,ref, defineComponent } from "vue";
import type { interfacePath, textInterfaceType, TextsInputInterface } from "./TextInputInterface";
import DynamicJsonNode from './DynamicJsonNode.vue';
export default defineComponent({
    components:
    {
        DynamicJsonNode
    },
    props: {
        intf: {
            type: Object as () => TextsInputInterface,
            required: true,
        },
        modelValue: {
            type: Object as () => any,
            required: true,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const v = computed({
            get: () => 
            {
                console.log("@@@@@@", props.modelValue);
                return props.modelValue;
            },
            set: (v) => {
                console.log("@@@@@@", props.modelValue);
                emit("update:modelValue", v);
            },
        });

        let jsonData = ref({});
        jsonData.value = 
        {
            name: "示例对象",
            age: 42,
            isActive: true,
            nested: 
            {
              array: [1, 2, 3, { a: "a", b: "b" }],
              nullValue: null,
              undefinedValue: undefined,
              date: new Date().toISOString(),
              deep: 
              {
                nested: "值"
              }
            } 
        }
        return { v, jsonData };
    },
});
</script>
