let nodeData = {};
let dfsGraph = {}
let time = 0;
let state = [{}];
let graphs = [];
let depthForestEdges = [];
let depthForests = [];


function traverse(node) {
    time += 1;
    nodeData[node].color = "grey";
    nodeData[node].reach = time;

    // Visualize when reaching
    let noParent = false;
    graph.meta.colors.node[node] = "grey";
    graphs.push(visualizeGraph(graph));
    if (nodeData[node].parent) {
        depthForestEdges.push(`${nodeData[node].parent} -- ${node}`);
    } else {
        depthForestEdges.push(`${node}`);
        console.log("NO PARENT NODE: " + node);
        noParent = true;
    }
    depthForests.push(visualizeTree(depthForestEdges));
    state.push($.extend(true, {}, nodeData));
    
    // Traverse white neighbors
    dfsGraph.nodes[node].forEach(edge => {
        if (nodeData[edge.node].color == "white") {
            // Avoiding visualization bugs
            if (noParent) {
                depthForestEdges.pop();
                noParent = false;
            }

            nodeData[edge.node].parent = node;
            traverse(edge.node);
        }
    });

    time += 1;
    nodeData[node].color = "black";
    nodeData[node].leave = time;

    // Visualize when leaving
    graph.meta.colors.node[node] = "black";
    graphs.push(visualizeGraph(graph));
    depthForests.push(visualizeTree(depthForestEdges));
    state.push($.extend(true, {}, nodeData));

}

function runRecursiveDFS(graph) {
    nodeData = {};
    dfsGraph = graph;
    state = [{}];
    graphs = [];
    depthForestEdges = [];
    depthForests = [];
    time = 0;
    graph.meta.colors.node = {};
    let nodes = Object.keys(dfsGraph.nodes).sort();
    
    nodes.forEach(node => {
        nodeData[node] = {
            color: "white",
            parent: undefined,
            reach: 0,
            leave: 0,
        };

        state[0][node] = {  
            color: "white",
            parent: undefined,
            reach: 0,
            leave: 0,
        };
    });
    
    // Visualize initialization
    graphs.push(visualizeGraph(dfsGraph));
    depthForests.push(visualizeTree(["dummy[style=invis]"]));

    nodes.forEach(node => {
        if (nodeData[node].color == "white") {
            traverse(node);
        }
    });

    let retVal = {
        graphs: graphs,
        state: state,
        depthForests: depthForests
    };

    return retVal;
}