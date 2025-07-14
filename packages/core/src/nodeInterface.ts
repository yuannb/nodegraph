import { v4 as uuidv4 } from "uuid";
import {
    SequentialHook,
    BaklavaEvent,
    PreventableBaklavaEvent,
    IBaklavaEventEmitter,
    IBaklavaTapable,
} from "@baklavajs/events";

export class InterfaceType {
    // 基础配置相关
    static readonly pointData: string = "pointData";
    static readonly numberData: string = "numberData";
    static readonly unkown: string = "unkown";
  
    // 私有构造函数，防止实例化（可选，根据需求）
    private constructor() {
      // 若不希望类被实例化，可添加此构造函数
    }
  }

export interface INodeInterfaceState<T> extends Record<string, any> {
    id: string;
    templateId?: string | undefined;
    value: T;
    type? : string;
}

export type NodeInterfaceMiddleware<T, A extends Array<any>> = (intf: NodeInterface<T>, ...args: A) => void;

export class NodeInterface<T = any> implements IBaklavaEventEmitter, IBaklavaTapable {
    public id = uuidv4();

    public fromInterface?: NodeInterface<any>;

    public type? : string;

    /**
     * If the interface is instantiated by a graph template, this property will be
     * set to the id of the corresponding instance in the template
     */
    public templateId?: string | undefined;

    /** Display name of the interface */
    public name: string;

    /** Will be set automatically after the node was created */
    public isInput?: boolean;

    /** Id of the node this interface is part of */
    public nodeId = "";

    /** Whether to show the port (the thing connections connect to) */
    public port = true;

    /** Whether to hide the node interface in the UI */
    public hidden = false;

    /** The component which will be displayed when the interface is not connected or port === false */
    public component?: any;

    public events = {
        setConnectionCount: new BaklavaEvent<number, NodeInterface<T>>(this),
        beforeSetValue: new PreventableBaklavaEvent<T, NodeInterface<T>>(this),
        setValue: new BaklavaEvent<T, NodeInterface<T>>(this),
        updated: new BaklavaEvent<void, NodeInterface<T>>(this),
    } as const;

    public hooks = {
        load: new SequentialHook<INodeInterfaceState<T>, NodeInterface<T>>(this),
        save: new SequentialHook<INodeInterfaceState<T>, NodeInterface<T>>(this),
    } as const;

    private _connectionCount = 0;
    public set connectionCount(v: number) {
        this._connectionCount = v;
        this.events.setConnectionCount.emit(v);
    }
    public get connectionCount(): number {
        return this._connectionCount;
    }

    private _value: T;

    private _analytic_value: any;

    public set value(v: T) {
        if (this.events.beforeSetValue.emit(v).prevented) {
            return;
        }
        this._value = v;
        this.events.setValue.emit(v);
    }
    
    public set analytic_value(v: T) {
        // if (this.events.beforeSetValue.emit(v).prevented) {
        //     return;
        // }
        this._analytic_value = v;
        // this.events.setValue.emit(v);
    }

    public get analytic_value(): any {
        return this._analytic_value;
    }
    
    public get value(): T {
        return this._value;
    }

    public constructor(name: string, value: T, dataType: string = InterfaceType.unkown) {
        this.name = name;
        this._value = value;
        this.type = dataType;
    }

    public load(state: INodeInterfaceState<T>): void {
        this.id = state.id;
        this.templateId = state.templateId;
        this.value = state.value;
        this.hooks.load.execute(state);
    }

    public save(): INodeInterfaceState<T> {
        const state: INodeInterfaceState<T> = {
            id: this.id,
            templateId: this.templateId,
            value: this.value,
            type : this.type
        };
        return this.hooks.save.execute(state);
    }

    public setComponent(value: any): this {
        this.component = value;
        return this;
    }

    public setPort(value: boolean): this {
        this.port = value;
        return this;
    }

    public setHidden(value: boolean): this {
        this.hidden = value;
        return this;
    }

    public use<A extends Array<any>>(middleware: NodeInterfaceMiddleware<T, A>, ...args: A): this {
        middleware(this, ...args);
        return this;
    }
}

export type NodeInterfaceDefinition<T> = {
    [K in keyof T]: NodeInterface<T[K]>;
};
export type NodeInterfaceDefinitionStates<T> = {
    [K in keyof T]: INodeInterfaceState<T[K]>;
};
