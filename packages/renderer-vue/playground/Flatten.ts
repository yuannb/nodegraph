import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Flatten",
    inputs: {
        input: () => new NodeInterface("input", 0),
    },
    outputs: {
        output: () => new NodeInterface("output", 0),
    },
});
