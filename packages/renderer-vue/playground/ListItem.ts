import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";
import { markRaw } from "vue";
import Merge from "./ListItem.vue"
class ListItemInterface extends NodeInterface<any> {
    constructor(name: string, value: any) {
        super(name, value);
        this.setComponent(markRaw(Merge));
    }
}

export default defineNode({
    type: "ListItem",
    inputs: {
        input: () => new NodeInterface("input", 0),
        index: () => new NodeInterface("index", 0, InterfaceType.numberData),
        wrap: () => new NodeInterface("wrap", 0),
    },
    outputs: {
        I: () => new ListItemInterface("I", 0),
    },
});
