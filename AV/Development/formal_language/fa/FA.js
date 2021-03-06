/*
	 Finite Automaton module.
	 An extension to the JFLAP library.
 */
var FiniteAutomaton = function(jsav, options) {
	Automaton.apply(this, arguments);
	this.configurations = $("<ul>"); // configurations jQuery object used to setup view at a step
	this.configViews = []; // configurations view for a step
	this.step = 0; // current step the user is at, used for changing configuration display	  
  }
  
  JSAV.ext.ds.fa = function (options) {
	var opts = $.extend(true, {visible: true, autoresize: true}, options);
	return new FiniteAutomaton(this, opts);
  };
  
  JSAV.utils.extend(FiniteAutomaton, JSAV._types.ds.Graph);
  
  FiniteAutomaton.prototype = Object.create(Automaton.prototype, {});
  var faproto = FiniteAutomaton.prototype;
/*
 NFA to DFA conversion
Note: g.transitionFunction takes a single node and returns an array of node values
Requires underscore.js
*/
var convertToDFA = function(jsav, graph, opts) {
// jsav.label("Converted:");
var g = jsav.ds.fa($.extend({layout: 'automatic'}, opts)),
		alphabet = Object.keys(graph.alphabet),
		startState = graph.initial,
		newStates = [];
// Get the first converted state
var first = lambdaClosure([startState.value()], graph).sort().join();
newStates.push(first);
var temp = newStates.slice(0);

first = g.addNode({value: first}); 
g.makeInitial(first);
g.layout();

// Repeatedly get next states and apply lambda closure
while (temp.length > 0) {
	var val = temp.pop(),
			valArr = val.split(',');
	var prev = g.getNodeWithValue(val);
	for (var i = 0; i < alphabet.length; i++) {
		var letter = alphabet[i];
		var next = [];
		for (var j = 0; j < valArr.length; j++) {
			next = _.union(next, lambdaClosure(graph.transitionFunction(graph.getNodeWithValue(valArr[j]), letter), graph));
		}
		var nodeName = next.sort().join();
		var node;

		if (nodeName) {
			if (!_.contains(newStates, nodeName)) {
				temp.push(nodeName);
				newStates.push(nodeName);
				node = g.addNode({value: nodeName});
			} else {
				node = g.getNodeWithValue(nodeName);
			}
			var edge = g.addEdge(prev, node, {weight: letter});
		}
	}
}
// add the final markers
addFinals(g, graph);
g.layout();
var nodes = g.nodes();
for (var next = nodes.next(); next; next = nodes.next()) {
	next.stateLabel(next.value());
	next.stateLabelPositionUpdate();
}
g.updateNodes();
return g;
};

// Function to add final markers to the resulting DFA
var addFinals = function(g1, g2) {
var nodes = g1.nodes();
for (var next = nodes.next(); next; next = nodes.next()) {
	var values = next.value().split(',');
	for (var i = 0; i < values.length; i++) {
		if (g2.getNodeWithValue(values[i]).hasClass('final')) {
			next.addClass('final');
			break;
		}
	}
}
};
/*
 Function to apply lambda closure.
 Takes in an array of values (state names), returns an array of values
 Only used in NFA to DFA conversion.
 There's a different lambda closure function used for nondeterministic traversal in certain tests.
*/
var lambdaClosure = function(input, graph) {
var arr = [];
for (var i = 0; i < input.length; i++) {
	arr.push(input[i]);
	var next = graph.transitionFunction(graph.getNodeWithValue(input[i]), lambda);
	arr = _.union(arr, next);
}
var temp = arr.slice(0);
while (temp.length > 0) {
	var val = temp.pop(),
			next = graph.transitionFunction(graph.getNodeWithValue(val), lambda);
	next = _.difference(next, arr);
	arr = _.union(arr, next);
	temp = _.union(temp, next);

}
return arr;
};

// helper depth-first search to find connected component
var dfs = function (visited, node, options) {
var successors = node.neighbors();
for (var next = successors.next(); next; next = successors.next()) {
	if (!_.contains(visited, next)) {
		visited.push(next);
		dfs(visited, next);
	}
}
};



// function to toggle the intitial state of a node
// appears as a button in the right click menu
var toggleInitial = function(g, node) {
$("#rmenu").hide();
node.unhighlight();
if (node.equals(g.initial)) {
	g.removeInitial(node);
}
else {
	if (g.initial) {
		alert("There can only be one intial state!");
	} else {
		g.makeInitial(node);
	}
}
};

// function to toggle the final state of a node
// appears as a button in the right click menu
var toggleFinal = function(g, node) {
if (node.hasClass("final")) {
	node.removeClass("final");
}
else {
	node.addClass("final");
}
$("#rmenu").hide();
node.unhighlight();
};

// function to change the customized label of a node
// an option in right click menu
var changeLabel = function(node) {
$("#rmenu").hide();
var nodeLabel = prompt("How do you want to label it?");
if (!nodeLabel || nodeLabel == "null") {
	nodeLabel = "";
}
node.stateLabel(nodeLabel);
node.stateLabelPositionUpdate();
node.unhighlight();
}

// function to clear the customized label
// an option in the right click menu
var clearLabel = function(node) {
$("#rmenu").hide();
node.unhighlight();
node.stateLabel("");
}

// Function to switch which empty string is being used (lambda or epsilon) if a loaded graph uses the opposite representation to what the editor is currently using.
var checkEmptyString = function(w) {
var wArray = w.split("<br>");
// It is necessary to check every transition on the edge.
for (var i = 0; i < wArray.length; i++) {
	if ((wArray[i] == lambda || wArray[i] == epsilon) && wArray[i] != emptystring) {
		emptyString();
	}
}
return wArray.join("<br>");
};

// Function to add final markers to the resulting DFA
var addFinals = function(g1, g2) {
var nodes = g1.nodes();
for (var next = nodes.next(); next; next = nodes.next()) {
	var values = next.value().split(',');
	for (var i = 0; i < values.length; i++) {
		if (g2.getNodeWithValue(values[i]).hasClass('final')) {
			next.addClass('final');
			break;
		}
	}
}
};

