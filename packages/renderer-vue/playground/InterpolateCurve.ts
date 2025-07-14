import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "InterpolateCurve",
    inputs: {
        Points: () => new NodeInterface("Points", 0),
    },
    outputs: {
        Curve: () => new NodeInterface("Curve", 0),
    },
});
