<template>
    <div>
        <DynamicJsonNode :data="viewData" :root="true" />
    </div>

    <button @click="view">{{ modelValue }}</button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {} from '../src/nodeinterfaces/textinput/DynamicJsonNode.vue'
import { NodeInterface } from "@baklavajs/core";

let viewData = ref();
export default defineComponent({
    props: {
        modelValue: {
            type: Object as () => NodeInterface,
            required: true,
        },
    },
    setup(props, { emit }) {
        const view = () => {
            console.log("!!!!!!", props);
            viewData.value = props.modelValue.fromInterface?.value;
            console.log("22222", props.modelValue.fromInterface);
             
        };
        return { view };
    },
});
</script>