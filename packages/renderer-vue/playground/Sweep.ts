import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Sweep",
    inputs: {
        Rail: () => new NodeInterface("Rail", 0),
        section: () => new NodeInterface("section", 0),
    },
    outputs: {
        surf: () => new NodeInterface("surf", 0),
    },
});
