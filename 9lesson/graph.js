async function createForceLayout() {
    const nodes = await d3.csv("nodelist.csv");
    const edges = await d3.csv("edgelist.csv");
    var roleScale = d3.scaleOrdinal()
        .domain(["contractor", "employee", "manager"])
        .range(["#75739F", "#41A368", "#FE9922"]);

    var nodeHash = nodes.reduce((hash, node) => {
        hash[node.id] = node;
        return hash;
    }, {})

    edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
    })

    var linkForce = d3.forceLink()

    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-40))
        .force("center", d3.forceCenter().x(300).y(300))
        .force("link", linkForce)
        .nodes(nodes)
        .on("tick", forceTick)

    simulation.force("link").links(edges)

    var dimension = {
        width: window.innerWidth * 0.8,
        height: window.innerWidth * 0.8,
        margin: {
            top: 50,
            right: 10,
            bottom: 10,
            left: 55
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)


    wrapper.selectAll("line.link")
        .data(edges, d => `${d.source.id}-${d.target.id}`)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("opacity", .5)
        .style("stroke-width", d => d.weight);

    function dragstarted(d) {
      d3.select(this).raise().classed("active", true);
    }

    function dragged(d) {
      d3.select(this).select("text")
        .attr("x", d.x = d3.event.x)
        .attr("y", d.y = d3.event.y);
      d3.select(this).select("rect")
        .attr("x", d.x = d3.event.x)
        .attr("y", d.y = d3.event.y);
    }
var dragHandler = d3.drag()
    .on("drag", function () {
        d3.selectAll("g.nodes")
            .attr("transform",`translate(${d3.event.x},${d3.event.y})`)
    });
    function dragended(d) {
      d3.select(this).classed("active", false);
    }

    const drag = d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)

    var nodeEnter = wrapper.selectAll("g.node")
        .data(nodes, d => d.id)
        .enter()
        .append("g")
        .attr("class", "node");
    nodeEnter.append("circle")
        .attr("r", 5)
        .style("fill", d => roleScale(d.role))
    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 15)
        .text(d => d.id)
        .call(drag);

    function forceTick() {
        d3.selectAll("line.link")
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
        d3.selectAll("g.node")
            .attr("transform", d => `translate(${d.x},${d.y})`)
    }

     d3.selectAll("input").on("change", function(d) {
      selectDataset.call(this, d);
    });

    function changeText(d, text) {
        d3.selectAll("g.node")
            .style("fill", d => roleScale(d.role))
    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 15)
        .text(d => d.id)
      let value = this.value;
      change(datasetTotal, value, text);
    }


    update(g.links, g.nodes);

    svg.selectAll('circle').on('dblclick', function () {
        var pivot_id = ($(this).siblings('title').text())
        console.log('pivoting on', pivot_id)
        pivot_search(pivot_id)
    });

    function update(links, nodes) {
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end', 'url(#arrowhead)')


        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {
                    return 'edgepath' + i
                }
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {
                    return 'edgelabel' + i
                },
                'font-size': 10,
                'fill': '#aaa'
            });

        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
            );

        node.append("circle")
            .attr("r", 5)
            .attr("fill", function (d) {
                return color(d.group);
            })


        node.append("title")
            .text(function (d) {
                return d.id;
            });

        node.append("text")
            .attr("dy", -3)
            .text(function (d) {
                return d.label;
            });


        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

    }

    var svg = d3.selectAll("node");
    svg.append("use")
        .attr("href", "#pointer")
        .attr("x", 50)
        .attr("y", 50)
        .attr("stroke-width", "1px");


}

createForceLayout()
