import type { Editor, Graph, NodeInterface, CalculationResult } from "@baklavajs/core";
import { BaseEngine } from "./baseEngine";
import { ITopologicalSortingResult, sortTopologically } from "./topologicalSorting";
import axis from 'axios'


function downloadJsonFile(jsonString: string, filename = 'datauser.json') {
    const blob = new Blob([jsonString], { type: 'application/json' }); // 创建 Blob 对象
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); // 生成 URL
    link.download = filename; // 设置文件名
    link.style.display = 'none'; // 隐藏链接
    document.body.appendChild(link);
    link.click(); // 触发下载
    document.body.removeChild(link); // 清理链接
  }

export const allowMultipleConnections = <T extends Array<any>>(intf: NodeInterface<T>) => {
    intf.allowMultipleConnections = true;
};

export class DependencyEngine<CalculationData = any> extends BaseEngine<CalculationData, []> {
    private order: Map<string, ITopologicalSortingResult> = new Map();

    public constructor(editor: Editor) {
        super(editor);
    }

    public override start() {
        super.start();
        this.recalculateOrder = true;
        void this.calculateWithoutData();
    }

    public override async runGraph(
        graph: Graph,
        inputs: Map<string, any>,
        calculationData: CalculationData,
    ): Promise<any> {
        if (!this.order.has(graph.id)) {
            this.order.set(graph.id, sortTopologically(graph));
        }
        console.log("----------------------------------begincaculate--------------------");
        let graphJson = graph.save();
        // Object.assign(graphJson, this.order.get(graph.id));
        const { calculationOrder, connectionsFromNode } = this.order.get(graph.id)!;
        // let nodeList = this.order.get(graph.id)?.calculationOrder;
        graphJson.order = [];
        for (const node of calculationOrder) {
            graphJson.order.push(node.getId());
        }
        const depended_nodes = graph.findAllDependedNodeFromId(graph.changed_nodes);
        console.log("depended_nodes: ",depended_nodes);
        graphJson.depended_nodes = [...depended_nodes];
        // graphJson.depended_nodes = new Set<string>();
        // for (const node_id of depended_nodes) {
        //     graphJson.depended_nodes.add(node_id);
        // }
        const inst = axis.create({
            baseURL: 'http://127.0.0.1:8080/echo',
            timeout: 10000,
            headers: {'X-customer-header': 'foobar'}
        })
        let response: any;
        const result: CalculationResult = new Map();
        try {
            // downloadJsonFile(JSON.stringify(graphJson));
            response = await inst.post('', graphJson);
            graph.date = response.data.date;
            console.log("response", response);
            
        } catch (error) {
            graph.date = "";
            console.log("11111111111111", error);
        }
        graph.changed_nodes.clear();
        graph.deleted_nodes.clear();
        return response;
    }
    public async saveJson(
        graph: Graph,
    ): Promise<void> {
        if (!this.order.has(graph.id)) {
            this.order.set(graph.id, sortTopologically(graph));
        }

        let graphJson = graph.save();
        const { calculationOrder} = this.order.get(graph.id)!;
        graphJson.order = [];
        for (const node of calculationOrder) {
            graphJson.order.push(node.getId());
        }
        downloadJsonFile(JSON.stringify(graphJson));
        return;
    }
    protected override async execute(calculationData: CalculationData): Promise<CalculationResult> {
        if (this.recalculateOrder) {
            this.order.clear();
            this.recalculateOrder = false;
        }
        const inputValues = this.getInputValues(this.editor.graph);
        return await this.runGraph(this.editor.graph, inputValues, calculationData);
    }

    public getInputValues(graph: Graph): Map<string, any> {
        // Gather all values of the unconnected inputs.
        // maps NodeInterface.id -> value
        // The reason it is done here and not during calculation is
        // that this way we prevent race conditions because calculations can be async.
        // For the same reason, we need to gather all output values for nodes that do not have a calculate function.
        const inputValues = new Map<string, any>();
        for (const n of graph.nodes) {
            Object.values(n.inputs).forEach((ni) => {
                if (ni.connectionCount === 0) {
                    inputValues.set(ni.id, ni.value);
                }
            });
            if (!n.calculate) {
                Object.values(n.outputs).forEach((ni) => {
                    inputValues.set(ni.id, ni.value);
                });
            }
        }
        return inputValues;
    }

    protected onChange(recalculateOrder: boolean): void {
        // this.recalculateOrder = recalculateOrder || this.recalculateOrder;
        // void this.calculateWithoutData();
    }

    private getInterfaceValue(values: Map<string, any>, id: string): any {
        if (!values.has(id)) {
            throw new Error(
                `Could not find value for interface ${id}\n` +
                    "This is likely a Baklava internal issue. Please report it on GitHub.",
            );
        }
        return values.get(id);
    }
}
