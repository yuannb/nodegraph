import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "CurveSplit",
    inputs: {
        curve: () => new NodeInterface("curve", 0),
        origin: () => new NodeInterface("origin", [0, 0, 0], InterfaceType.pointData),
        normal: () => new NodeInterface("normal", [0, 0, 1], InterfaceType.pointData),
        tolerance: () => new NodeInterface("tolerance", 1e-8, InterfaceType.numberData),
    },
    outputs: {
        curve: () => new NodeInterface("curve", 0),
    },
});
