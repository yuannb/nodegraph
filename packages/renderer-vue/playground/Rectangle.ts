import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Rectangle",
    inputs: {
        origin: () => new NodeInterface("origin", [0, 0, 0], InterfaceType.pointData),
        xdir: () => new NodeInterface("xdir", [1, 0, 0], InterfaceType.pointData),
        ydir: () => new NodeInterface("ydir", [0, 1, 0], InterfaceType.pointData),
        ulength: () => new NodeInterface("ulength", 1, InterfaceType.numberData),
        vlength: () => new NodeInterface("vlength", 1, InterfaceType.numberData),
    },
    outputs: {
        curve: () => new NodeInterface("curve", 0),
    },
});
