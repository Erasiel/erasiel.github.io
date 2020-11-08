function runBFS(graph, startNode) {
    let state = [{}];
    let graphs = [];
    let breadthTrees = [];
    let breadthTreeEdges = [];
    let nodeData = {};
    let nodesQueue = [];
    let queues = [];

    graph.meta.colors.node = {};

    Object.keys(graph.nodes).forEach(node => {
        nodeData[node] = {
            distance: Infinity,
            parent: undefined,
            color: "white"
        };
        
        state[0][node] = {
            distance: Infinity,
            parent: undefined,
            color: "white"
        };
    });

    nodeData[startNode] = {
        distance: 0,
        parent: undefined,
        color: "gray"
    }
    state[0][startNode] = {
        distance: 0,
        parent: undefined,
        color: "gray"
    }

    graph.meta.colors.node[startNode] = "gray";
    graphs.push(visualizeGraph(graph))
    
    breadthTreeEdges.push(startNode);
    breadthTrees.push(visualizeTree(breadthTreeEdges));
    breadthTreeEdges.shift();

    let stateIndex = 0;

    nodesQueue.push(startNode);

    while (nodesQueue.length > 0) {
        let nextNode = nodesQueue[0];
        nodeData[nextNode].color = "black";
        graph.meta.colors.node[nextNode] = "black";

        state.push($.extend(true, {}, state[stateIndex]));
        queues.push($.extend(true, {}, nodesQueue));
        stateIndex++;

        graph.nodes[nextNode].forEach(edge => {
            if (nodeData[edge.node].color == "white") {
                nodesQueue.push(edge.node);

                nodeData[edge.node].color = "gray"
                nodeData[edge.node].distance = nodeData[nextNode].distance + 1;
                nodeData[edge.node].parent = nextNode;

                state[stateIndex][edge.node].color = "gray"
                state[stateIndex][edge.node].distance = nodeData[nextNode].distance + 1;
                state[stateIndex][edge.node].parent = nextNode;

                graph.meta.colors.node[edge.node] = "gray";
                breadthTreeEdges.push(`${nextNode} -- ${edge.node}`);
            }
        });

        graphs.push(visualizeGraph(graph));

        // If startNode isn't connected to anything
        if (breadthTreeEdges.length == 0) {
            breadthTreeEdges.push(startNode)
        }
        breadthTrees.push(visualizeTree(breadthTreeEdges));
        
        nodesQueue.shift();
    }

    let retVal = {
        graphs: graphs,
        breadthTrees: breadthTrees,
        state: state,
        queues: queues
    };

    return retVal;
}