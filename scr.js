function rebuildPlot(chart) {
	//first remove the boxplots and the points
	chart.removeAllSeries();

	//builds all boxplots first
	series = chart.box(box.data); //box.data is a list of dictionaries
	series.normal().fill("#0077ff", 0.6);
	series.hovered().fill("#0077ff", 0.2);
	series.selected().fill("#0077ff", 0.8);
	series.normal().stroke("##0313fc", 1, "10 5", "round");
	series.hovered().stroke("##0313fc", 2, "10 5", "round");
	series.selected().stroke("##0313fc", 4, "10 5", "round");
	series.whiskerWidth(5);
	series.whiskerStroke({color: '#4680ac', thickness: 5});

	series.xPointPosition(0.5);

	//adds points corresponding to boxplots
	//adds each subarray of points to arr
	let arr = [];
	for(let i = 0; i < box.points.length; i++) {
		//takes the x of the corresponding boxplot so that they line up
		arr.push({x: box.data[i].x, low:0, q1:0, median:0, q3:0, high:0, outliers: box.points[i]});
	}
	//adds arr to the chart
	series2 = chart.box(arr); //pts 1

	series2.normal().fill("#ff0000", 0.6);
	series2.normal().stroke({thickness:0});
	series2.hovered().stroke({thickness:0});
	series2.selected().stroke({thickness:0});
	series2.medianStroke({thickness:0});
	series2.tooltip(false);
	series2.xPointPosition(0.5);

	buildDropdown();
}



function addPlot(name) {
	document.getElementById("boxplot").addPlot(name);
	buildDropdown();
}

//adds an additional boxplot on the current chart
function removePlot(name) {
	document.getElementById("boxplot").removePlot(name);
	buildDropdown();
}

//index corresponds to the index of the dropdown menu
function addData() {
	document.getElementById("boxplot").addValue(parseInt(document.getElementById("addData").value), document.getElementById('addDP').selectedIndex);
}

//index corresponds to the index of the dropdown menu
function removeData() {
	document.getElementById("boxplot").removeValue(parseInt(document.getElementById("removeData").value), document.getElementById('addDP').selectedIndex);
}

//index corresponds to the index of the dropdown menu
function addPoint() {
	let index = document.getElementById('addDP').selectedIndex
	let value = parseInt(document.getElementById("addPoint").value)
	document.getElementById("boxplot").addRefPoint(value, index)
}

function removePoint() {
	let index = document.getElementById('addDP').selectedIndex
	let toRemove = parseInt(document.getElementById("remPoint").value);
	document.getElementById("boxplot").removeRefPoint(toRemove, index)
}

function changeOrientation() {
	document.getElementById("boxplot").flipAxes()
}

function toggleOutliers() {
	document.getElementById("boxplot").toggleOutliers()
}

function toggleArms() {
	document.getElementById("boxplot").toggleArms()
}

function buildDropdown() {
	const select = document.getElementById("addDP");
	const names = document.getElementById("boxplot").data.map(elem => elem.x);
	for(var i = select.childNodes.length - 1; i >= 0; i--) {
		select.removeChild(select.childNodes[i]);
	}
	for (var i = 0; i < names.length; i++) {
		var optn = names[i];
		var el = document.createElement("option");
		el.textContent = optn;
		el.value = optn;
		select.appendChild(el);
	}
}
