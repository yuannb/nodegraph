import { defineNode, NodeInterface } from "@baklavajs/core";
import { NumberInterface, SelectInterface } from "../src";

export default defineNode({
    type: "Ranges",
    inputs: {
        low: () => new NumberInterface("low", 0),
        high: () => new NumberInterface("high", 0),
        count: () => new NumberInterface("count", 1),
    },
    outputs: {
        series: () => new NodeInterface("series", 0),
    },
});
