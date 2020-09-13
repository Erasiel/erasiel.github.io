const Colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'magenta'];

function runKruskal(graph) {
    let edges = [];
    let union = {};
    let graphs = [];
    let state = [];
    let nodeColors = {};
    graph.meta.colors = {};

    Object.keys(graph.nodes).forEach((node, i) => {
        union[node] = node;

        graph.nodes[node].forEach(edge => {
            let baseEdge = {
                n1: node,
                n2: edge.node,
                weight: edge.weight,
            };

            let uniqueEdge = true;
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].n2 == baseEdge.n1 && edges[i].n1 == baseEdge.n2) {
                    uniqueEdge = false;
                    break;
                }
            }

            if (uniqueEdge) {
                edges.push(baseEdge);
            }
        });
    });

    edges.sort((e1, e2) => { return e1.weight < e2.weight ? -1 : 1; });

    edges.forEach(edge => {
        if (edge.n1 > edge.n2) {
            let temp = edge.n1;
            edge.n1 = edge.n2;
            edge.n2 = temp;
        }
    });

    state.push($.extend(true, {}, edges));
    graphs.push(visualizeGraph(graph));

    let chosenEdges = 0;
    let colorIndex = 0;

    for (let i = 0; i < edges.length; i++) {
        if (union[edges[i].n1] != union[edges[i].n2]) {
            let oldParent; //= union[edges[i].n2];
            let newParent; //= union[edges[i].n1];

            edges[i].chosen = true;

            // Way too complicated
            if (nodeColors[union[edges[i].n1]]) {
                newParent = union[edges[i].n1];
                oldParent = union[edges[i].n2];
            } else if (nodeColors[union[edges[i].n2]]) {
                newParent = union[edges[i].n2];
                oldParent = union[edges[i].n1];
            } else {
                newParent = union[edges[i].n1];
                oldParent = union[edges[i].n2];
                nodeColors[newParent] = Colors[colorIndex++];
                graph.meta.colors[newParent] = nodeColors[newParent];
            }

            Object.keys(union).forEach(node => {
                if (union[node] == oldParent) {
                    union[node] = newParent;
                    graph.meta.colors[node] = nodeColors[newParent];
                }
            });

            chosenEdges++;
            graphs.push(visualizeGraph(graph));
            
            state.push($.extend(true, {}, edges));
            if (chosenEdges >= Object.keys(graph.nodes).length - 1) {
                break;
            }
        } else {
            edges[i].chosen = false;
        }

    }

    let retVal = {
        graphs: graphs,
        state: state
    };

    return retVal;
    
}
