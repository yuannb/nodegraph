import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Scale",
    inputs: {
        Geometry: () => new NodeInterface("Geoemtry", 0),
        factor: () => new NumberInterface("factor", 1),
        origin: () => new NodeInterface("origin", [0, 0, 0], InterfaceType.pointData),
    },
    outputs: {
        Geometry: () => new NodeInterface("Geometry", 0),
    },
});
