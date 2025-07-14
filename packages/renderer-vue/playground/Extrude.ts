import { defineNode, NodeInterface, InterfaceType } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";
import { NodeInterfaceType } from "@baklavajs/interface-types";

export default defineNode({
    type: "Extrude",
    inputs: {
        curve: () => new NodeInterface("curve", 0),
        dir: () => new NodeInterface("dir", 0, InterfaceType.pointData),
        dist: () => new NodeInterface("dist", 1, InterfaceType.numberData),
    },
    outputs: {
        surf: () => new NodeInterface("surf", 0),
    },
});
