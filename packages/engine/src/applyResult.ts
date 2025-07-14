import { AbstractNode, Editor, CalculationResult } from "@baklavajs/core";

/**
 * Apply the calculation result values to the output interfaces in the graph
 * @param result Calculation result
 * @param editor Editor instance
 */
export function applyResult(result: CalculationResult, editor: Editor): void {
    const nodeMap: Map<string, AbstractNode> = new Map();
    editor.graphs.forEach((g) => {
        g.nodes.forEach((n) => nodeMap.set(n.id, n));
    });
    console.log('result: ', result)
    result.forEach((intfValues, nodeId) => {
        const node = nodeMap.get(nodeId);
        console.log("node: ", node);
        if (!node) {
            return;
        }

        console.log("intfValues: ", intfValues);
        intfValues.forEach((value, intfKey) => {
            console.log("intfKey: ", intfKey);
            console.log("node.outputs: ", node.outputs.value);
            const intf = node.getOutInterface(intfKey);
            console.log("intf: ", intf);
            if (!intf) {
                return;
            }

            console.log("value: ", value);
            intf.analytic_value = value;
        });
    });
}
