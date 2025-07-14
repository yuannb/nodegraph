import { type ComponentOptions, markRaw } from "vue";
import { NodeInterface } from "@baklavajs/core";
import TextInputInterfaceComponent from "./TextInputInterface.vue";
import TexstInputInterfaceComponent from "./TexstInputInterface.vue";

export class TextInputInterface extends NodeInterface<string> {
    component = markRaw(TextInputInterfaceComponent) as ComponentOptions;
}

class interfacePath
{
    public path?: number[];
    constructor(p: number[])
    {
        this.path = p;
    }
};
type textInterfaceType<T> = Map<interfacePath, Array<T>>;

export class TextsInputInterface extends NodeInterface<textInterfaceType<string>> {
    component = markRaw(TexstInputInterfaceComponent) as ComponentOptions;
}

export class NumberInputInterface extends NodeInterface<textInterfaceType<number>> {
    component = markRaw(TexstInputInterfaceComponent) as ComponentOptions;
}
export { TextInputInterfaceComponent, interfacePath, textInterfaceType, TexstInputInterfaceComponent };
