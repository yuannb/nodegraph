<template>
    <div id="app">
        <BaklavaEditor :view-model="baklavaView">
            <template #node="nodeProps">
                <CommentNodeRenderer v-if="nodeProps.node.type === 'CommentNode'" v-bind="nodeProps" />
                <NodeComponent v-else v-bind="nodeProps" />
            </template>
        </BaklavaEditor>

        <button @click="calculate">Calculate</button>
        <button @click="save">Save</button>
        <button @click="load">Load</button>
        <button @click="setSelectItems">Set Select Items</button>
        <button @click="changeGridSize">Change Grid Size</button>
        <button @click="createSubgraph">Create Subgraph</button>
        <button @click="saveAndLoad">Save and Load</button>
        <button @click="changeSidebarWidth">SidebarWidth</button>
        <button @click="clearHistory">Clear History</button>
        <button @click="zoomToFitRandomNode">Zoom to Random Node</button>
        <button @click="saveJson">save to json</button>

        <el-button @click="openChildWindow">打开独立组件</el-button>
    </div>
</template>

<script setup lang="ts">
import { WindowManager } from "./window-manager";
import { Graph, NodeInstanceOf } from "@baklavajs/core";
import { BaklavaEditor, Components, SelectInterface, useBaklava, Commands } from "../src";
import { DependencyEngine, applyResult } from "@baklavajs/engine";
import { BaklavaInterfaceTypes } from "@baklavajs/interface-types";

import TestNode from "./TestNode";
import OutputNode from "./OutputNode";
import BuilderTestNode from "./BuilderTestNode";
import MathNode from "./MathNode";
import AdvancedNode from "./AdvancedNode";
import CommentNode from "./CommentNode";
import InterfaceTestNode from "./InterfaceTestNode";
import SelectTestNode from "./SelectTestNode";
import SidebarNode from "./SidebarNode";
import DynamicNode from "./DynamicNode";
import UpdateTestNode from "./UpdateTestNode";
import MultiInputNode from "./MultiInputNode";
import { DialogNode } from "./DialogNode";

import ReactiveOutputTestNode from "./ReactiveOutputTestNode";
import { stringType, numberType, booleanType } from "./interfaceTypes";

import CommentNodeRenderer from "./CommentNodeRenderer.vue";
import Panel from "./Panel";
import ConstructPoint from "./ConstructPoint";
import Merge from './Merge'

import InterpolateCurve from './InterpolateCurve'
import Extrude from './Extrude'
import { ref, onUnmounted } from 'vue';
//import router from "../router";
import router from "../router";
import {emitter} from './event-bus'
import Ellipse from "./Ellipse";
import NumberNode from "./NumberNode";
import Rotate from "./Rotate";
import Ranges from "./Range"
import Scale from "./Scale";
import { FIRST_LAST_KEYS } from "element-plus";
// 消息类型定义
import { provide } from 'vue';
import CurveSplit from "./CurveSplit";
import Loft from "./Loft";
import ListItem from "./ListItem";
import Flatten from "./Flatten";
import Line from "./Line";
import CurveIntCurve from "./CurvesInt";
import DistancePt from "./DistancePt";
import EndPoints from "./EndPoints";
import Rectangle from "./Rectangle";
import PrepFrame from "./PrepFrame";
import Sweep from "./Sweep";

const childWindow = ref<Window | null>(null);

const openChildWindow = () => {
  const route = router.resolve('/child');
  console.log(route.href);
  
  childWindow.value = window.open(route.href, '_blank', 'width=600,height=400');
  
  // 监听来自子窗口的消息
  window.addEventListener('message', handleMessage);
};

const handleMessage = (event: MessageEvent) => {
  console.log('主窗口收到消息:', event.data);
  // 可以在这里处理接收到的数据
};

// 组件卸载时移除监听器
const onUnmounted = () => {
  window.removeEventListener('message', handleMessage);
};


const NodeComponent = Components.Node;

const token = Symbol("token");
const baklavaView = useBaklava();
const editor = baklavaView.editor;

(window as any).editor = baklavaView.editor;
baklavaView.settings.enableMinimap = true;
baklavaView.settings.sidebar.resizable = false;
baklavaView.settings.displayValueOnHover = true;
baklavaView.settings.nodes.resizable = true;
baklavaView.settings.nodes.reverseY = false;
baklavaView.settings.contextMenu.additionalItems = [
    { isDivider: true },
    { label: "Copy", command: Commands.COPY_COMMAND },
    { label: "Paste", command: Commands.PASTE_COMMAND },
];

const engine = new DependencyEngine(editor);
engine.events.afterRun.subscribe(token, (r) => {
    engine.pause();
    applyResult(r, editor);
    engine.resume();
    console.log(r);
});
engine.hooks.gatherCalculationData.subscribe(token, () => "def");
// engine.start();

const nodeInterfaceTypes = new BaklavaInterfaceTypes(editor, {
    viewPlugin: baklavaView,
    engine,
});
nodeInterfaceTypes.addTypes(stringType, numberType, booleanType);

editor.registerNodeType(TestNode, { category: "Tests" });
editor.registerNodeType(OutputNode, { category: "Outputs" });
editor.registerNodeType(BuilderTestNode, { category: "Tests" });
editor.registerNodeType(DialogNode);
editor.registerNodeType(MathNode);
editor.registerNodeType(AdvancedNode);
editor.registerNodeType(CommentNode, { title: "Comment" });
editor.registerNodeType(InterfaceTestNode);
editor.registerNodeType(SelectTestNode);
editor.registerNodeType(SidebarNode);
editor.registerNodeType(DynamicNode);
editor.registerNodeType(UpdateTestNode);
editor.registerNodeType(ReactiveOutputTestNode);
editor.registerNodeType(MultiInputNode);
editor.registerNodeType(Panel);
editor.registerNodeType(ConstructPoint);
editor.registerNodeType(Merge);
editor.registerNodeType(InterpolateCurve);
editor.registerNodeType(Extrude);
editor.registerNodeType(Ellipse);
editor.registerNodeType(NumberNode);
editor.registerNodeType(Rotate);
editor.registerNodeType(Ranges);
editor.registerNodeType(Scale);
editor.registerNodeType(CurveSplit);
editor.registerNodeType(Loft);
editor.registerNodeType(ListItem);
editor.registerNodeType(Flatten);
editor.registerNodeType(Line);
editor.registerNodeType(CurveIntCurve);
editor.registerNodeType(DistancePt);
editor.registerNodeType(EndPoints);
editor.registerNodeType(Rectangle);
editor.registerNodeType(PrepFrame);
editor.registerNodeType(Sweep);

interface InnerData
{
    data: any;
    type: string;
    geometry ?: number;
};

interface InterfaceData
{
    [key : string] : Map<Array<number>, Array<InnerData>>;
}

interface NodeData
{
    outputs: Array<InterfaceData>
}

interface GraphData
{
    [key : string] : NodeData | string;
    id: string;
    curve_disc : any;
    surf_disc : any;
    points : any;
    node_data: any;
}

let graphData : GraphData | null = null

const selectNode = (nodeId: string) : Array<string> =>
{
    let hiddenId : Array<string> = [] ;
    if (graphData == null)
    {
        return hiddenId;
    }
    const isExits = nodeId in graphData.node_data;
    if (isExits == false)
    {
        return hiddenId;
    }
    const nodeData = graphData.node_data[nodeId] as NodeData;
    for (let intfs of nodeData.outputs)
    {
        for (let value in intfs)
        {
            let intf = intfs[value];
            for (let node in intf)
            {
                console.log(intf);
                let innerData = intf[node];
                console.log(innerData);
                for (let key in innerData)
                {
                    let data2 = innerData[key];
                    for (let elementKey in data2)
                    {
                        let element = data2[elementKey];
                        if (element["type"] == "geometryData")
                        {
                            hiddenId.push(element["data"]);
                        }
                    }
                }
            }
        }
    }

    return hiddenId;
    console.log(hiddenId);
}

const hiddenGeometry = (nodeId : string) => 
{
    const nodeList = selectNode(nodeId);
    let result = {
        method :  "hidden",
        nodeList : nodeList
    }
    childWindow.value?.postMessage(result, window.origin);
}

const ChangeGeometryColor = (nodeId : string) => 
{
    const nodeList = selectNode(nodeId);
    let result = {
        method : 'changeColor',
        nodeList : nodeList
    }
    childWindow.value?.postMessage(result, window.origin);
}

const RevertGeometryColor = (nodeId : string) => 
{
    const nodeList = selectNode(nodeId);
    let result = {
        method : 'revertColor',
        nodeList : nodeList
    }
    childWindow.value?.postMessage(result, window.origin);
}
provide('grandparentMethods', {
  hiddenGeometry, ChangeGeometryColor, RevertGeometryColor
});
const calculate = async () => {
    const result = await engine.runOnce("def");
    graphData = result.data;
    // hidden(id);
    let message = {
        method : 'renderGeometry',
        nodeList : result.data
    }
    childWindow.value?.postMessage(message, window.origin);
    // console.log("data: ", result.data)
};

const save = () => {
    const state = JSON.stringify(editor.save());
    console.log("Saving to localstorage", state);
    window.localStorage.setItem("state", JSON.stringify(editor.save()));
};

const saveJson = () => {
    engine.saveJson(baklavaView.displayedGraph);
};
const load = () => {
    const state = window.localStorage.getItem("state");

    if (!state) {
        return;
    }

    try {
        editor.load(JSON.parse(state));
        console.log("Loaded state from localStorage");
    } catch (e) {
        console.error(e);
        return;
    }
};

load();

const saveAndLoad = () => {
    editor.load(editor.save());
};

const setSelectItems = () => {
    for (const node of editor.graph.nodes) {
        if (node.type === "SelectTestNode") {
            const n = node as unknown as NodeInstanceOf<typeof SelectTestNode>;
            const sel = n.inputs.advanced as SelectInterface<number | undefined>;
            sel.items = [
                { text: "X", value: 1 },
                { text: node.id, value: 2 },
            ];
        }
    }
};

const changeGridSize = () => {
    baklavaView.settings.background.gridSize = Math.round(Math.random() * 100) + 100;
};

const createSubgraph = () => {
    baklavaView.commandHandler.executeCommand<Commands.CreateSubgraphCommand>(Commands.CREATE_SUBGRAPH_COMMAND);
};

const changeSidebarWidth = () => {
    baklavaView.settings.sidebar.width = Math.round(Math.random() * 500) + 300;
    baklavaView.settings.sidebar.resizable = !baklavaView.settings.sidebar.resizable;
};

const clearHistory = () => {
    baklavaView.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);
};

const zoomToFitRandomNode = () => {
    if (baklavaView.displayedGraph.nodes.length === 0) {
        return;
    }

    const nodes = baklavaView.displayedGraph.nodes;
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    baklavaView.commandHandler.executeCommand<Commands.ZoomToFitNodesCommand>(Commands.ZOOM_TO_FIT_NODES_COMMAND, true, [node]);
}
</script>

<style>
#app {
    margin: 30px 0;
    height: calc(100vh - 60px);
}
</style>
