import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Loft",
    inputs: {
        curve: () => new NodeInterface("curve", 0),
    },
    outputs: {
        surf: () => new NodeInterface("surf", 0),
    },
});
