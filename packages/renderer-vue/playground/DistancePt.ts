import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "DistancePt",
    inputs: {
        pt1: () => new NodeInterface("pt1", [0, 0, 0], InterfaceType.pointData),
        pt2: () => new NodeInterface("pt2", [0, 0, 0], InterfaceType.pointData),
    },
    outputs: {
        dist: () => new NodeInterface("dist", 0),
    },
});
