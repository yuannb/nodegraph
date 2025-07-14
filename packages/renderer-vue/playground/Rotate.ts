import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Rotate",
    inputs: {
        Geometry: () => new NodeInterface("Geoemtry", 0),
        Angle: () => new NumberInterface("Angle", 0),
        origin: () => new NodeInterface("origin", [0, 0, 0], InterfaceType.pointData),
        normal: () => new NodeInterface("normal", [0, 0, 1], InterfaceType.pointData),
    },
    outputs: {
        Geometry: () => new NodeInterface("Geometry", 0),
    },
});
