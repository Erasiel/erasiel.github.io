/**
 * Global storage for graph algorithm interchangeability
 * Be aware that for the easiest access to variables that
 * are accessible from multiple js files the localStorage
 * construction is used, which stores every variable as
 * !!! STRINGS !!!
 * 
 * I nearly pulled my hair out over this fyi
 */


localStorage.storedGraph;
localStorage.storedGraphImg;
localStorage.storedInnerImg;
localStorage.hasStoredGraph;
localStorage.loadRequested;

function storeGraph(graph, img) {
    localStorage.storedGraph = JSON.stringify(graph);
    localStorage.storedGraphImg = img;
    localStorage.storedInnerImg = "undefined";
    localStorage.hasStoredGraph = "true";
}

function storeInner(innerImg) {
    localStorage.storedInnerImg = innerImg;
}

function requestLoad() {
    localStorage.loadRequested = "true";
}

function isLoadRequested() {
    return localStorage.loadRequested == "true";
}

function isStoredGraphBFSCompatible() {
    return localStorage.hasStoredGraph == "true";
}

function isStoredGraphDFSCompatible() {
    return localStorage.hasStoredGraph == "true";
}

function isStoredGraphDijkstraCompatible() {
    return localStorage.hasStoredGraph == "true";
}

function isStoredGraphPrimCompatible() {
    if (localStorage.hasStoredGraph == "true") {
        if (localStorage.storedGraph == "undefined") return false;
        let graph = JSON.parse(localStorage.storedGraph);
        return graph.meta.connected;
    } else {
        return false;
    }
}

function isStoredGraphKruskalCompatible() {
    if (localStorage.hasStoredGraph == "true") {
        if (localStorage.storedGraph == "undefined") return false;
        let graph = JSON.parse(localStorage.storedGraph);
        return graph.meta.connected;
    } else {
        return false;
    }
}

function getStoredGraph() {
    let retVal = {
        graph: JSON.parse(localStorage.storedGraph),
        img: localStorage.storedGraphImg
    }
    localStorage.loadRequested = "false";
    return retVal;
}

function getStoredGraphInnerImg() {
    return localStorage.storedGraphInnerImg;
}
