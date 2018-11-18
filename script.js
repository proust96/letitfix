$( document ).ready(function() {
    displayBigOne() ;
});


function selectCircle(d){
    $text_confirmation = "You have a problem with " + d.data.name + ". Is that right ?";
    $mes = $("#flow").append('<div class="message bot"></div>');
    $mes.children().last().append('<span class="mleft">'+$text_confirmation+'</span>');
    $([document.documentElement, document.body]).animate({
        scrollTop: $mes.children().last().offset().top
    }, 2000, "linear").promise().then(function(){
        displayYesNo();
    });
}

function displayYesNo(){
    $text_oui = "<span class='answer yes'>Yes, exactly.</span>";
    $text_non = "<span class='answer no'>No, let me choose another option.</span>";
    $mes = $("#flow").append('<div class="message local"></div>');
    $mes.children().last().append('<span class="mright" style="width:315px;height:85px">'+$text_oui+$text_non+'</span>');
    $([document.documentElement, document.body]).animate({
        scrollTop: $mes.children().last().offset().top
    }, 2000, "linear");    
}

function displayBigOne() {
    var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(0,0%,86%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);

    d3.json("https://api.myjson.com/bins/zsjua", function(error, root) {
    if (error) throw error;

    root = d3.hierarchy(root)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    var focus = root.children[0],
        nodes = pack(root).descendants(),
        view;

    var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--final" : "node node--root"; })
        .style("fill", function(d) { return color(d.depth); })
        .on("click", function(d) { if (focus !== d) if (d.parent.parent === focus) {zoom(d.parent), d3.event.stopPropagation();}else{zoom(d), d3.event.stopPropagation(), console.log(d.data.name);} });

    var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent != null ? d.parent.parent === root ? 1 : 0 : 0; })
        .style("display", function(d) { return d.parent != null ? d.parent.parent === root ? "inline" : "none" : "none"; })
        .text(function(d) { return d.data.name; });

    var node = g.selectAll("circle,text");

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
        if (d.height == 0){
            setTimeout(
                function(){
                    selectCircle(d);
                }, 1000);
        }

        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
            });

        if (d.height != 0){
        transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }
    }

    function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
    }
    });
}