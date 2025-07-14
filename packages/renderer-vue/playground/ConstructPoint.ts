import { defineNode } from "@baklavajs/core";
import { setType } from "@baklavajs/interface-types";
import { TextInputInterface, TextsInputInterface, TextInterface, interfacePath, NumberInterface } from "../src";
import { stringType } from "./interfaceTypes";

export default defineNode({
    type: "ConstructPoint",
    inputs: {
        x: () => new NumberInterface("x", 0),
        y: () => new NumberInterface("y", 0),
        z: () => new NumberInterface("z", 0),
    },
    outputs: {
        point: () => new TextInterface("output", "").setPort(true),
    },
});
