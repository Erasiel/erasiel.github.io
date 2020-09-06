function runDijsktra(graph, startNode, directed = true) {
    console.log(graph);
    let nodeIds = Object.keys(graph.nodes);
    let state = [];
    let openNodes = [];
    let graphs = [];
    graph.meta.colors = {};

    graph.meta.colors[startNode] = "red";

    state[0] = {};

    if (directed) {
        graphs.push(visualizeWeightedDirectedGraph(graph));
    } else {
        graphs.push(visualizeWeightedUndirectedGraph(graph));
    }

    nodeIds.forEach(node => {
        if (node === startNode) {
            state[0][node] = {
                distance: 0,
                ancestor: undefined,
                status: "visited"
            }

            openNodes.push(node);
        } else {
            state[0][node] = {
                distance: Infinity,
                ancestor: undefined,
                status: "unvisited"
            }
        }
    });

    let stateIndex = 0;
    while(openNodes.length > 0) {
        // Get min distance node
        let minIndex = 0;

        for (let i = 0; i < openNodes.length; i++) {
            if (state[stateIndex][openNodes[i]].distance < state[stateIndex][openNodes[minIndex]].distance) {
                minIndex = i;
            }
        }

        // Initialize next state
        state.push($.extend(true, {}, state[stateIndex]));
        stateIndex++;
        let minDistNode = openNodes[minIndex];
        openNodes.splice(minIndex, 1);

        // Update adjacent nodes
        graph.nodes[minDistNode].forEach(edge => {
            let foundDistance = parseInt(state[stateIndex][minDistNode].distance) + edge.weight;
            
            if (foundDistance < state[stateIndex][edge.node].distance) {
                state[stateIndex][edge.node] = {
                    distance: foundDistance,
                    ancestor: minDistNode,
                    status: "visited"
                }

                if (!(openNodes.includes(edge.node))) {
                    graph.meta.colors[edge.node] = "red";
                    openNodes.push(edge.node);
                }
            }
        });

        state[stateIndex][minDistNode].status = "closed";
        graph.meta.colors[minDistNode] = "green";

        if (directed) {
            graphs.push(visualizeWeightedDirectedGraph(graph));
        } else {
            graphs.push(visualizeWeightedUndirectedGraph(graph));
        }

    }

    let retVal = {
        graphs: graphs,
        state: state
    };

    return retVal; 
}
