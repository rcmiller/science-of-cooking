var graphSteak=function(sampledata,flame,timestep,meatType,maxTemps){
var graph=(function(){
var setup=function(div,data,flame,timestep,meatType,maxTemps)	
	{
	
	
var dy=.1;	
var n = boundaries[meatType].length*2+1, // number of layers

    m = data.length; // number of samples per layer

	var getState=function(temp)
	{

		for(var i=0;i<boundaries[meatType].length;i++)
		{
			if(temp>=boundaries[meatType][i])return i;
		}
		return 6;

	};
		var dat=[]
		for(var i =0;i<data.length;i++)
		{
			var moves = [];
			for (var x = 0; x < n; x++) moves.push(0);
			var state=getState(data[i][0]);
			var offset=0;
		
			for(var j=0;j<data[0].length;j++)
			{	
			
				var nextState=getState(data[i][j]);
				
				if(state==nextState){moves[Math.abs(offset-nextState)]+=1}
				else{

					if(Math.abs(offset-state)>Math.abs(offset-nextState)){offset=boundaries[meatType].length*2;}

					moves[Math.abs(offset-nextState)]+=1;
				
					state=nextState;
					}
	
			}
		
			dat.push(moves);
		}
		maxTemps=maxTemps.splice(0,maxTemps.length-1);
			
		
    stack = d3.layout.stack(),
    layers = stack(d3.range(n).map(function(d,i) { return bumpLayer(i,dat); })),
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

var margin = {top: 50, right: 10, bottom: 100, left: 50},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeRoundBands([0, width], .08);
		
var xscaled = d3.scale.linear()
    .domain([0,m/timestep])
    .range([width/15, width*15/16]);	
		
var y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([height, 0]);
var yscaled = d3.scale.linear()
    .domain([0, yStackMax*dy])
    .range([height,0]);	



var xAxis = d3.svg.axis()
    .scale(xscaled)
    .tickSize(0)
    .tickPadding(30)
    .orient("bottom");
		
var yAxis = d3.svg.axis()
    .scale(yscaled)
    .tickSize(0)
    .tickPadding(6)
    .orient("left");
var make_y_axis=function() {        
    return d3.svg.axis()
        .scale(yscaled)
        .orient("left")
        
}		
var svg = d3.select("body").append("svg")
	.attr("class","mysteak")
	.attr("id", "mysteak")
   // .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var legend = svg.selectAll('g')

        .data(tempScale[meatType])

        .enter()
      .append('g')
        .attr('class', 'Biglegend')
		.style('fill', "black");


    legend.append('rect')
        .attr('x', width)
        .attr('y', function(d, i){ return i *  15;})
        .attr('width', 8)
        .attr('height', 8)

        .style('fill', function(d) { return color[meatType](d['position'])

        });

    legend.append('text')
        .attr('x', width+10)
        .attr('y', function(d, i){ return (i *  15+8);})
        .text(function(d){ return d['info']; });	

var ttip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);	
		
var layer = svg.selectAll(".layer")
    .data(layers)
  .enter().append("g")
    .attr("class", "layer")

    .style("fill", function(d, i) { return color[meatType](i); });

	

var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0)
	.on("mouseover", function() {
		var rects = d3.select(this);
		var loc=null;
		for(var i=n-1;i>=0;i--)
		{
			if(color[meatType](i)==rects.style("fill")){loc=i;}	
		}

		var leg=d3.selectAll('.Biglegend')[0][boundaries[meatType].length-loc];
		
		$(leg).css("fill","red");
		for(var i=0;i<7;i++)
		{
		var text=d3.selectAll('.Biglegend text')[0][boundaries[meatType].length-i];
		var line=parseInt((event.pageX-parseFloat($("body").css('margin-left'))-margin.left)/(x.rangeBand()+1)-4.0);	
		var info=tempScale[meatType][boundaries[meatType].length-i]['info'];
		$(text).text( info +" " +(100*(dat[line][i]+dat[line][12-i])/m).toFixed(0)+ "%" );

		}
	})
.on("mousemove",function(){


	var Offset = document.getElementById("graphSteak").offsetTop;
	var pos=parseInt(data[0].length-(event.pageY-Offset-margin.top-200)/(height/yStackMax));
var line=parseInt((event.pageX-parseFloat($("body").css('margin-left'))-margin.left)/(x.rangeBand()+1)-4.0);

	$("line").remove();
	var myLine = d3.selectAll(".mysteak").append("svg:line")
    .attr("x1", margin.left)
    .attr("y1", event.pageY-Offset-200)
    .attr("x2", width*31/30)
    .attr("y2", event.pageY-Offset-200)
    .style("stroke", "grey");
	//console.log(d3.event.pageX-parseFloat($("body").css('margin-left')));
	var ttip=d3.select('.tooltip');
	   ttip.html(data[line][pos].toFixed(2)+ "\xB0C")  
	  // ttip.html(pos.toFixed(2)+ "\xB0C") 
	//ttip.html("please work")
	   			.style("opacity", 1)
                .style("left", (d3.event.pageX-parseFloat($("body").css('margin-left'))+5) + "px")     
                .style("top", (d3.event.pageY+5) + "px");   
})
			
        

.on("mouseout", function() {
		var rects = d3.select(this);
		var loc=null;
		for(var i=n-1;i>=0;i--)
		{

			if(color[meatType](i)==rects.style("fill")){loc=i;}	
		}
		var leg=d3.selectAll('.Biglegend')[0][boundaries[meatType].length-loc];

		$(leg).css("fill","black");
			

        
	});	
var imgstop = svg.selectAll("image").data(flame);
            imgstop.enter()
            .append("svg:image")
			.attr("xlink:href", function(d){return d[1]==0? "flamedown.png":"flame.png"})
			.attr("width", Math.min(x.rangeBand(),30))
            .attr("height", Math.min(x.rangeBand(),30))
			.attr("x", function(d){return (d[0]+3.75)*(x.rangeBand()+1)})
            .attr("y", function(d){return -Math.min(x.rangeBand(),30)+(height+Math.min(x.rangeBand(),30))*d[1]})
		
var linktext = svg.selectAll("g.linklabelholder").data(flame);
    linktext.enter().append("g").attr("class", "linklabelholder")
     .append("text")
     .attr("class", "linklabel")
     .attr("dx", function(d){return (d[0]+3.75)*(x.rangeBand()+1)})
     .attr("dy", function(d){return -Math.min(x.rangeBand(),30)/1.2+(height+2*Math.min(x.rangeBand(),30))*d[1]})
     .attr("text-anchor", "right")
		.style("font-size", "8px")
     .text(function(d,i) {
		 
		 if(i==0){return  d[2].toFixed(0)}
		if(i==1&&flame[i][0]==flame[i-1][0]){return  d[2].toFixed(0)}
		if(i==1){return '';}
		if(flame[i][0]==flame[i-1][0]&&flame[i-2][2]!=flame[i][2]){return  d[2].toFixed(0)}				  
		else return "";});

		
rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
		

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);	
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", height+60)
    .text("Time (seconds)");
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -height/3)
    .attr("y",-30)
 	.attr("transform", "rotate(-90)")
    .text(meatType+" Thickness (cm)");
		
svg.append("text")
    .attr("class", "y label1")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Side 1");
svg.append("text")
    .attr("class", "y label2")
    .attr("text-anchor", "end")
    .attr("y", 13)
    .attr("x",-height+margin.bottom/3)
    .attr("transform", "rotate(-90)")
    .text("Side 2");	
		
		
/*
 svg.append("g")         
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
			
        )	
	*/	
var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}


function bumpLayer(layer,data) {


  var a = [], i;
  for (i = 0; i < m; ++i) {
	  
	  a[i] = 1 * data[i][layer];
	
  }
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}
	
	}
	    return {setup: setup};
	}
	());

	$(document).ready(function(){
    $('.graph').each(function(){
        graph.setup($(this),sampledata,flame,timestep,meatType,maxTemps);});
});
}
