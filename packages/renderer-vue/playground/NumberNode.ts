import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface } from "../src";

export default defineNode({
    type: "NumberNode",
    inputs: {
        input: () => new NumberInterface("input", 1),
    },
    outputs: {
        output: () => new NodeInterface("output", 1),
    },
});
