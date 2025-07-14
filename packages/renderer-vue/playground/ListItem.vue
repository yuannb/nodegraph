<template>
    <button class="baklava-button --block" :title="intf.name" @click="onClick">
        AddNode
    </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { NodeInterface, Node } from "@baklavajs/core";
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

            const name = "I+" + Object.keys(props.node.outputs).length.toString();
            let nodeIntf = new NodeInterface(name, 0);
            props.node.addOutput(name, nodeIntf)
        };

        return { onClick };
    },
});
</script>
