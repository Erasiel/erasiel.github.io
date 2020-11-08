let graph;
let img;
let innerImg;
let innerShown = false;
let index = -1;
let runningGraphs;
let breadthTrees;
let runningStates;
let runningBreadthTrees;
let queues;

function load() {
    if (isLoadRequested() || isStoredGraphBFSCompatible()) {
        graph = getStoredGraph().graph;
        img = getStoredGraph().img;

        innerImg = getStoredGraphInnerImg();
        innerImg = visualizeInnerStructure(graph);

        drawFirstGraph();
    } else {
        refresh_undirected();
    }
}

function refresh_undirected() {
    graph = generateWeightedUndirectedGraph(10, 0.2);
    img = visualizeGraph(graph);
    innerImg = visualizeInnerStructure(graph);
    innerShown = false;
    index = -1;

    storeGraph(graph, img);

    drawFirstGraph();
}

function refresh_directed() {
    graph = generateWeightedDirectedGraph(10, 0.2);
    img = visualizeGraph(graph)
    innerImg = visualizeInnerStructure(graph);
    innerShown = false;
    index = -1;

    storeGraph(graph, img);

    drawFirstGraph();
}

function drawFirstGraph() {
    $("#grapharea").html(img);
    $("#body").empty();
    $("#statearea").toggleClass("hidden", true);
    $("#btreeholder").toggleClass("hidden", true);
    $("#switch-view").text("Mutasd a gráf belső szerkezetét!");
}

function switchView() {
    if (innerShown) {
        if (index != -1) {
            $("#grapharea").html(runningGraphs[index]);
        } else {
            $("#grapharea").html(img);
        }
        $("#switch-view").text("Mutasd a gráf belső szerkezetét!");
    } else {
        $("#grapharea").html(innerImg);
        $("#switch-view").text("Mutasd a gráfot!");
    }
    innerShown = !innerShown;
}

function run() {
    let startnodeInput = $("#startnode-input");
    let startNode = startnodeInput.val().toUpperCase();

    if (!Object.keys(graph.nodes).includes(startNode)) {
        startnodeInput.toggleClass("error-input", true);
    } else {
        startnodeInput.toggleClass("error-input", false);
        
        $("#grapharea").empty();
        $("#btreearea").empty();

        // Run the algorithm and save results
        let runningResults = runBFS(graph, startNode);
        runningGraphs = runningResults.graphs;
        runningStates = runningResults.state;
        runningBreadthTrees = runningResults.breadthTrees;
        queues = runningResults.queues;
        innerShown = false;

        // Show the initialization step
        $("#statearea").toggleClass("hidden", false);
        $("#btreeholder").toggleClass("hidden", false);
        $("#switch-view").text("Mutasd a gráf belső szerkezetét!");
        next();
    }
}
function next() {
    if (innerShown) return;
    if (index + 1 < runningGraphs.length) {
        index++;
        setupState(runningStates[index]);
        setupQueue(queues[index]);
        $("#grapharea").html(runningGraphs[index]);
        $("#btreearea").html(runningBreadthTrees[index]);
    }
}

function prev() {
    if (innerShown) return;
    if (index -1 >= 0) {
        index--;
        setupState(runningStates[index]);
        setupQueue(queues[index]);
        $("#grapharea").html(runningGraphs[index]);
        $("#btreearea").html(runningBreadthTrees[index]);
    }
}

function setupState(stateObject) {
    let table = $("#body");
    table.empty();

    if (index <= 0) {
        $("#iteration-number").text(`Az algoritmus inicializálási lépése után az állapot: `);
    } else {
        $("#iteration-number").text(`Az algoritmus ${index}. iterációja után az állapot: `);
    }

    let nodes = Object.keys(stateObject).sort();

    nodes.forEach(node => {
        let htmlStr = "<tr>";
        htmlStr += `<td>${node}</td>`;
        
        if (stateObject[node].distance === Infinity) {
            htmlStr += "<td>&#8734;</td>";
        } else {
            htmlStr += `<td>${stateObject[node].distance}</td>`;
        }

        if (stateObject[node].parent) {
            htmlStr += `<td>${stateObject[node].parent}</td>`;
        } else {
            htmlStr += `<td>NULL</td>`;
        }

        htmlStr += "</tr>";
        table.append($(htmlStr));
    });
}

function setupQueue(queue) {
    let indexTable = $("#queue-indices");
    let valueTable = $("#queue-values");

    indexTable.empty();
    valueTable.empty();

    if (queue) {
        let htmlIndexStr = "<tr>";
        let htmlValueStr = "<tr>";

        Object.keys(queue).forEach(key => {
            htmlIndexStr += `<td>${parseInt(key) + 1}</td>`;
            htmlValueStr += `<td>${queue[key]}</td>`;
        });

        htmlIndexStr += "</tr>";
        htmlValueStr += "</tr>";
        
        indexTable.append($(htmlIndexStr));
        valueTable.append($(htmlValueStr));
    } else {
        let htmlIndexStr = "<tr><td>ÜRES</td></tr>";
        indexTable.append($(htmlIndexStr));
    }


}
