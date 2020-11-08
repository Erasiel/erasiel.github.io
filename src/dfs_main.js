let graph;
let img;
let innerImg;
let innerShown = false;
let index = -1;
let runningGraphs;
let runningStates;
let runningDepthForests;

function load() {
    if (isLoadRequested() || isStoredGraphDFSCompatible()) {
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
    $("#grapharea").empty();
    $("#btreearea").empty();

    // Run the algorithm and save results
    let runningResults = runRecursiveDFS(graph);
    runningGraphs = runningResults.graphs;
    runningStates = runningResults.state;
    runningDepthForests = runningResults.depthForests;
    innerShown = false;

    // Show the initialization step
    $("#statearea").toggleClass("hidden", false);
    $("#btreeholder").toggleClass("hidden", false);
    $("#switch-view").text("Mutasd a gráf belső szerkezetét!");
    next();
    
}
function next() {
    if (innerShown) return;
    if (index + 1 < runningGraphs.length) {
        index++;
        setupState(runningStates[index]);
        $("#grapharea").html(runningGraphs[index]);
        $("#btreearea").html(runningDepthForests[index]);
    }
}

function prev() {
    if (innerShown) return;
    if (index -1 >= 0) {
        index--;
        setupState(runningStates[index]);
        $("#grapharea").html(runningGraphs[index]);
        $("#btreearea").html(runningDepthForests[index]);
    }
}

function setupState(stateObject) {
    let table = $("#body");
    table.empty();

    if (index <= 0) {
        $("#iteration-number").text(`Az algoritmus inicializálási lépése után az állapot: `);
    } else {
        $("#iteration-number").text(`A T = ${index} időpontban az állapot: `);
    }

    let nodes = Object.keys(stateObject).sort();

    nodes.forEach(node => {
        let htmlStr = "<tr>";
        htmlStr += `<td>${node}</td>`;
        

        if (stateObject[node].parent) {
            htmlStr += `<td>${stateObject[node].parent}</td>`;
        } else {
            htmlStr += `<td>NULL</td>`;
        }

        if (stateObject[node].reach == 0) {
            htmlStr += `<td></td>`;
        } else {
            htmlStr += `<td>${stateObject[node].reach}</td>`;
        }

        if (stateObject[node].leave == 0) {
            htmlStr += `<td></td>`;
        } else {
            htmlStr += `<td>${stateObject[node].leave}</td>`;
        }

        htmlStr += "</tr>";
        table.append($(htmlStr));
    });
}
