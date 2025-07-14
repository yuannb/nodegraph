import { defineNode, InterfaceType, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "PrepFrame",
    inputs: {
        curve: () => new NodeInterface("curve", 0),
        param: () => new NodeInterface("param", 0, InterfaceType.numberData),
    },
    outputs: {
        origin: () => new NodeInterface("origin", 0),
        xdir: () => new NodeInterface("xdir", 0),
        ydir: () => new NodeInterface("ydir", 0),
    },
});
