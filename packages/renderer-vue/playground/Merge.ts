import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";
import { markRaw } from "vue";
import Merge from "./Merge.vue"
class MergeInterface extends NodeInterface<any> {
    constructor(name: string, value: any) {
        super(name, value);
        this.setComponent(markRaw(Merge));
    }
}

export default defineNode({
    type: "Merge",
    inputs: {
        I1: () => new MergeInterface("I1", 0),
    },
    outputs: {
        output: () => new NodeInterface("Output", 0),
    },
});
