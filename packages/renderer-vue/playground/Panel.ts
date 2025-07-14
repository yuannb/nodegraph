import { defineNode, NodeInterface } from "@baklavajs/core";
import { setType } from "@baklavajs/interface-types";
import { TextInputInterface, TextsInputInterface, TextInterface, interfacePath } from "../src";
import { stringType } from "./interfaceTypes";
import { textInterfaceType } from "../dist";
import { markRaw } from "vue";


export default defineNode({
    type: "Panel",
    inputs: {
        text: () => 
        {
            let data = new Map<interfacePath, Array<string>>();
            data.set(new interfacePath([0, 1]), ["test"]);
            let result = new TextsInputInterface("Panel", data);
            return result.setPort(true);
        }
    },
    outputs: {
        text2: () => new TextsInputInterface("output", new Map<interfacePath, Array<string>>()).setPort(true),
    },
    calculate({ text } ) {

        return {text2: text};
    },
});
