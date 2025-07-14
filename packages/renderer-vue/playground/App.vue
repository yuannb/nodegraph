<template>
    <div id="app">
        <router-view></router-view>

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
// 消息类型定义


</script>

<style>
#app {
    margin: 30px 0;
    height: calc(100vh - 60px);
}
</style>
