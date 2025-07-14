import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";
import { NodeInterfaceType } from "@baklavajs/interface-types";

export default defineNode({
    type: "Ellipse",
    inputs: {
        origin: () => new NodeInterface("origin", [0, 0, 0], InterfaceType.pointData),
        xdir: () => new NodeInterface("xdir", [1, 0, 0], InterfaceType.pointData),
        ydir: () => new NodeInterface("ydir", [0, 1, 0], InterfaceType.pointData),
        major: () => new NodeInterface("major", 1, InterfaceType.numberData),
        minor: () => new NodeInterface("minor", 0.5, InterfaceType.numberData),
    },
    outputs: {
        curve: () => new NodeInterface("curve", 0),
    },
});
