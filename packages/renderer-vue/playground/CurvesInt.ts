import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "CurveIntCurve",
    inputs: {
        curve1: () => new NodeInterface("curve1", 0),
        curve2: () => new NodeInterface("curve2", 0),
    },
    outputs: {
        points: () => new NodeInterface("points", 0),
    },
});
