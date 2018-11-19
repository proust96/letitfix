var problem_name = "";

$( document ).ready(function() {
    setTimeout(function(){
        displayFirstSteps();
    },1500);
});


/**
 * Start of the workflow
 */
function displayFirstSteps(){
    botSays("Hey, I'm your personal chatbot. What can I do for you ?", 1000, "first");
    userSays("Hi, I need some assistance.", 2500);
    botSays("Sure, let me try to help you. Can you try to locate your problem in the following diagram ?", 4000);
    setTimeout(function(){
        let mes = $("#flow").append('<div class="message bot" id="svg_map"></div>');
        mes.children().last().append('<span class="mleft"><svg width="470" height="470"></svg></span>');
        displayBigOne();
        scrollToMessage(500);
    }, 5500)
}


/**
 * Confirm node selection
 * @param {node} d 
 */
function selectCircle(d){
    problem_name = d.data.name;
    if (problem_name != "SNF"){
        let text_confirmation = "You have a problem with " + d.data.name + ". Is that right ?";
        let mes = $("#flow").append('<div class="message bot" id="m_confirm"></div>');
        mes.children().last().append('<span class="mleft">'+text_confirmation+'</span>');
        $([document.documentElement, document.body]).animate({
            scrollTop: mes.children().last().offset().top - $(".first").offset().top - 450
        }, 500, "linear").promise().then(function(){
            displayYesNoConfirm();
        });
    }else{
        botSays("I see you haven't found your issue on the map. What's your problem ?", 1000);
    }
}

//Display questions with multiple choices

function displayYesNoConfirm(){
    let text_y = "<span class='answer yes' onclick='startSteps()'>Yes, exactly.</span>";
    let text_n = "<span class='answer no' onclick='showSVGMap()'>No, let me choose another option.</span>";
    let mes = $("#flow").append('<div class="message local" id="m_yes_no"></div>');
    mes.children().last().append('<span class="mright" style="width:315px;height:90px">'+text_y+text_n+'</span>');   
    scrollToMessage(500);
}

function displayYesNoBotHelp(){
    let text_y = "<span class='answer yes' onclick='botHelp(\"Yes, it did a great job.\")'>Yes, it did a great job.</span>";
    let text_m = "<span class='answer meh' onclick='botHelp(\"It could do better.\")'>It could do better.</span>";
    let text_n = "<span class='answer no' onclick='botHelp(\"No, I'm disappointed.\")'>No, I'm disappointed.</span>";
    let mes = $("#flow").append('<div class="message local" id="m_yes_no_bot"></div>');
    mes.children().last().append('<span class="mright botReview" style="width:330px;height:133px">'+text_y+text_m+text_n+'</span>');   
    scrollToMessage(500);
}

/**
 * Thanks for the feedback
 * @param {string} t 
 */
function botHelp(t){
    $('<span class="mright">'+t+'</span>').replaceAll("#m_yes_no_bot .mright");
    botSays("Thanks for the feedback.", 500, "botReview");
}


//Generic functions to interact with messages 

function botSays(text, n, className){
    setTimeout(
        function(){
            let mes = $("#flow").append('<div class="message bot"></div>');
            mes.children().last().append('<span class="mleft '+className+'">'+text+'</span>');
            scrollToMessage(500);
        }, n);
}

function userSays(text, n){
    setTimeout(
        function(){
            let mes = $("#flow").append('<div class="message local"></div>');
            mes.children().last().append('<span class="mright">'+text+'</span>');
            scrollToMessage(500);
        }, n);
}

function scrollToMessage(n){
    $(document.getElementById('all')).animate({
        scrollTop: $("#flow").children().last().offset().top - $(".first").offset().top - 450
    }, 500, "linear");
}

function changePage(){
    $("body").css("background-image", 'url("img/pass.png")');
}

/**
 * Demo step by step workflow
 */
function startSteps(){
    if (problem_name === "Lost password"){
        $('<span class="mright">Yes, exactly.</span>').replaceAll("#m_yes_no .mright");
        botSays("I'll walk you through all the steps so you can set a new password.", 1000);
        userSays("Great, thanks!", 2500);
        botSays('First, navigate to this <span class="link_page" onclick="changePage()">page</span>.', 4000);
        botSays("Perfect. In the input field, enter a new password and once more in the verification field. Do you need inspiration, why not use : diF89&4z@", 6000);
        botSays("You are all set, your new password is now active.", 10500);
        botSays("Did you like the way the chatbot helped you solve the issue?", 14000, "botReview mt50");
        setTimeout(function(){
            displayYesNoBotHelp();
        },14500);
    }else{
        botSays("I'm sorry, we don't have a solution for this issue yet, maybe try another one.", 0);
        setTimeout(function(){
            showSVGMap();
        },2000);
    }
}


/**
 * Scrolls to the issues map, removes answers
 */
function showSVGMap(){
    $('.node--root').next().d3Click();
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#svg_map").offset().top  - $(".first").offset().top - 110
    }, 500, "linear");  
    $("#m_confirm").remove(); 
    $("#m_yes_no").remove(); 
}


/**
 * Loads the issues map
 */
function displayBigOne() {
    var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(0,0%,86%)", "hsl(0,0%,0%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);

    d3.json("flare.json", function(error, root) {
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
        .attr("id", function(d) { return d.data.name == "SNF" ? "snf" : ""; })
        .style("fill", function(d) { return color(d.depth); })
        .on("click", function(d) { if (focus !== d) if (d.parent.parent != null && d.parent.parent.parent === focus) {zoom(d.parent.parent), d3.event.stopPropagation();}else{if (d.parent.parent === focus) {zoom(d.parent), d3.event.stopPropagation();}else{zoom(d), d3.event.stopPropagation(), console.log(d.data.name);}}});

    var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("id", function(d) { return d.data.name == "SNF" ? "snf_label" : ""; })
        .style("fill-opacity", function(d) { return d.parent != null ? d.parent.parent === root ? 1 : 0 : 0; })
        .style("display", function(d) { return d.parent != null ? d.parent.parent === root ? "inline" : "none" : "none"; })
        .text(function(d) { return d.data.name == "SNF" ? "Issue not found" : d.data.name ; });

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

//the trigger click doesn't work on svg without
jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
      var evt = new MouseEvent("click");
      e.dispatchEvent(evt);
    });
};