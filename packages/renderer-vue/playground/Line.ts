import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Line",
    inputs: {
        startPoint: () => new NodeInterface("startPoint", [0, 0, 0], InterfaceType.pointData),
        endPoint: () => new NodeInterface("endPoint", [0, 0, 0], InterfaceType.pointData),
    },
    outputs: {
        line: () => new NodeInterface("line", 0),
    },
});
