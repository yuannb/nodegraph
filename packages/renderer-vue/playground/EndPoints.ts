import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "EndsPoints",
    inputs: {
        curve: () => new NodeInterface("curve", 0),
    },
    outputs: {
        startPoint: () => new NodeInterface("startPoint", 0),
        endPoint: () => new NodeInterface("endPoint", 0),
        startParam: () => new NodeInterface("startParam", 0),
        endParam: () => new NodeInterface("endParam", 0),
    },
});
