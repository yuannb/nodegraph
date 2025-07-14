import { IConnectionState, IConnection, Graph } from "@baklavajs/core";
import { IStep } from "./step";

export default class ConnectionStep implements IStep {
    public type: "addConnection" | "removeConnection";

    private connectionId?: string;
    private connectionState?: IConnectionState;

    public constructor(type: "addConnection" | "removeConnection", data: string | IConnection) {
        this.type = type;
        if (type === "addConnection") {
            this.connectionId = data as string;
        } else {
            const d = data as IConnection;
            this.connectionState = {
                id: d.id,
                from_id: d.from.id,
                to_id: d.to.id,
            };
        }
    }

    public undo(graph: Graph) {
        if (this.type === "addConnection") {
            this.removeConnection(graph);
        } else {
            this.addConnection(graph);
        }
    }

    public redo(graph: Graph) {
        if (this.type === "addConnection" && this.connectionState) {
            this.addConnection(graph);
        } else if (this.type === "removeConnection" && this.connectionId) {
            this.removeConnection(graph);
        }
    }

    private addConnection(graph: Graph) {
        const fromIntf = graph.findNodeInterface(this.connectionState!.from);
        const toIntf = graph.findNodeInterface(this.connectionState!.to);
        if (!fromIntf || !toIntf) {
            return;
        }
        const connection = graph.addConnection(fromIntf, toIntf);
        if (connection) {
            connection.id = this.connectionState!.id;
        }
        this.connectionId = connection?.id;
    }

    private removeConnection(graph: Graph) {
        const connection = graph.connections.find((c) => c.id === this.connectionId);
        if (!connection) {
            return;
        }
        this.connectionState = {
            id: connection.id,
            from_id: connection.from.id,
            to_id: connection.to.id,
        };
        graph.removeConnection(connection);
    }
}
