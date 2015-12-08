function drawGraph(connections) {
    var nodes = [];
    var edges = [];
    var network = null;

    var nodes = [],
        nodesHash = {};

    function addNode(nodeObject) {
        nodesHash[nodeObject.id] = {
            id: nodeObject.id,
            shape: 'circularImage',
            image: nodeObject.avatar,
            label: nodeObject.name
        };
    }

    function getNodeIndex(id) {
        var node = nodesHash[id];
        var index = nodes.indexOf(node);
        return index;
    }

    Object.keys(connections).forEach(function (connectionId) {
        var connection = connections[connectionId];
        addNode(connection.a);
        addNode(connection.b);
    });

    nodes = Object.keys(nodesHash).map(function (nodeId) {
        return nodesHash[nodeId];
    });

    edges = Object.keys(connections).map(function (connectionId) {
        var connection = connections[connectionId];

        return {
            from: connection.a.id,
            to: connection.b.id
        };
    });

    // create a network
    var container = document.body;
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            borderWidth: 4,
            size: 30,
            color: {
                border: '#222222',
                background: '#FFFFFF'
            },
            font: {color: '#000000'}
        },
        edges: {
            color: 'lightgray'
        }
    };
    network = new vis.Network(container, data, options);
}