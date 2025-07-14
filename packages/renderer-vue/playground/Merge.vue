<template>
    <button class="baklava-button --block" :title="intf.name" @click="onClick">
        AddNode
    </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { NodeInterface, Node } from "@baklavajs/core";
let count = ref(1);

export default defineComponent({
    props: {
        intf: {
            type: Object as () => NodeInterface,
            required: true,
        },
        node: {
            type: Object as () => Node<any, any>,
            required: true,
        },
    },
    setup(props) {
        const onClick = () => {
            count.value ++;
            const name = "I" + count.value.toString();
            let nodeIntf = new NodeInterface(name, 0);
            props.node.addInput(name, nodeIntf)
        };

        return { onClick };
    },
});
</script>
