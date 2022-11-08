async function build() {
    const nodes = await d3.csv("nodelist.csv");
    const projects = await d3.csv("projects.csv");
    const edges = await d3.csv("edgelist.csv");

    function adjacencyMatrix(nodes,projects, edges) {
        var matrix = [];
        var edgeHash = {};
        edges.forEach(edge => {
            var id = edge.company+"-"+edge.project;
            edgeHash[id] = edge;
        })

        console.log(nodes[1].id)

        for(let i=0; i<nodes.length; i++) {
            for(let j=0; j<projects.length; j++) {
                var uel = nodes[i];
                var bel = projects[j];
                var grid = {
                    id: uel.company+"-"+bel.project,
                    x:j,
                    y:i,
                    project: bel.group,
                    weight:0
                }
                if(edgeHash[grid.id]) {
                    grid.weight = parseInt(edgeHash[grid.id].number);
                }
                matrix.push(grid);

            }
        }
        return matrix;
    }

    var dimension = {
        width: window.innerWidth*0.9,
        height: window.innerWidth*0.9,
        margin: {
            top: 400,
            right: 10,
            bottom: 10,
            left: 350
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

    const bounds = wrapper.append("g")
        .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
    var data = adjacencyMatrix(nodes,projects, edges);
    console.table(data);
    const pole = bounds
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","grid")
        .attr("width",25)
        .attr("height",25)
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .style("fill", d=>d.project === "satellite" ? "green" : d.project === "spaceplane" ? "red" :
            d.project === "joint venture" ? "yellow" : d.project === "plane" ? "purple" :
                d.project === "telescope" ? "firebrick" : d.project === "ISS" ? "tomato" : d.project === "missile" ? "black" : "black")
        .style("fill-opacity", d=>d.weight*0.3)

    const namesX = wrapper
        .append("g")
        .attr("transform","translate(350,260)")
        .selectAll("text")
        .data(projects)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projects=>projects.project)
        .style("text-anchor","middle")
        .attr("transform", "rotate(270)");

    const namesX1 = wrapper
        .append("g")
        .attr("transform","translate(350,60)")
        .selectAll("text")
        .data(projects)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projects=>projects.group)
        .style("text-anchor","middle")
        .attr("transform", "rotate(270)");

    const namesY = wrapper
        .append("g")
        .attr("transform","translate(340,400)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.company)
        .style("text-anchor","end");

    const namesY1 = wrapper
        .append("g")
        .attr("transform","translate(75,400)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.country)
        .style("text-anchor","end");

}

build();