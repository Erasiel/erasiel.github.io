let graph;
let img;
let index = -1;
let runningGraphs;
let runningStates;

function load() {
    if (isLoadRequested() || isStoredGraphKruskalCompatible()) {
        graph = getStoredGraph().graph;
        img = getStoredGraph().img;

        drawFirstGraph();
    } else {
        refresh();
    }
}

function refresh() {
    graph = generateWeightedUndirectedConnectedGraph();
    img = visualizeGraph(graph);

    storeGraph(graph, img);

    drawFirstGraph();
}

function drawFirstGraph() {
    $("#grapharea").html(img);
    $("#body").empty();
    $("#statearea").toggleClass("hidden", true);
}

function run() {
    $("#grapharea").empty();

    // Run the algorithm and save results
    let runningResults = runKruskal(graph);
    runningGraphs = runningResults.graphs;
    runningStates = runningResults.state;
    index = -1;

    // Show the initialization step
    $("#statearea").toggleClass("hidden", false);
    next();
}

function next() {
    if (index + 1 < runningGraphs.length) {
        index++;
        setupState(runningStates[index]);
        $("#grapharea").html(runningGraphs[index]);
    }
}

function prev() {
    if (index -1 >= 0) {
        index--;
        setupState(runningStates[index]);
        $("#grapharea").html(runningGraphs[index]);
    }
}

function setupState(edges) {
    let table = $("#body");
    table.empty();
    let htmlStr = "";

    if (index == 0) {
        $("#iteration-number").text(`Az élek súly szerint rendezve: `);
    } else {
        $("#iteration-number").text(`Az algoritmus ${index}. beválasztott éle utáni állapot: `);
    }

    // ok so this is weird af cuz its indexed with numbers but its an object and not an array... wtf
    Object.keys(edges).forEach(num => {
        htmlStr += "<tr>";
        htmlStr += `<td>${parseInt(num) + 1}</td>`;
        htmlStr += `<td>${edges[num].n1} -- ${edges[num].n2}</td>`;
        htmlStr += `<td>${edges[num].weight}</td>`;

        if (edges[num].chosen) {
            htmlStr += "<td>&#x2714;</td>";
        } else {
            if (edges[num].chosen == undefined) { // pls dont judge
                htmlStr += "<td></td>";
            } else {
                htmlStr += "<td>&#x2716;</td>";
            }
        }
        htmlStr += "</tr>";
    });

    table.append($(htmlStr));
}

function loadPrim() {
    // Setup new link
    let newLink = window.location.href.split("/");
    newLink.pop();
    newLink.push("prim.html");
    newLink = newLink.join("/");

    // Request load to storage
    requestLoad();

    window.location.href = newLink;
}
