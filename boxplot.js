(function() {
	class BoxPlot extends HTMLElement {
		values = [[0, 25, 50, 75, 100, 400]];
		outliers = false;
		showArms = false;
		data = [];
		points = [[120, 420]];
		chart = null;

		constructor() {
			super();

			this.series; //variable for boxplots
			this.series2; //variable for reference points on boxplots
			// const chart = anychart.box();
			this.recalculate(0);

			anychart.onDocumentReady(function () {
				var chart = anychart.box();
				document.querySelector('#boxplot').chart = chart;
				// create a box series and set the data
				document.querySelector('#boxplot').rebuildPlot();
				
				// set the chart title
				chart.title("Sample Box Plot");
			
				// set the containder id
				chart.container("boxplot");
			
				// initiate drawing the chart
				chart.draw();
			});
			
			//TODO: understand what shadow DOMs do and how they can benefit here
		}

		get values() {
			return this.values;
		}

		set outliers(newval) {
			this._oultliers = newval;
		}

		get showArms() {
			return this.showArms;
		}

		set showArms(newval) {
			this._showArms = newval;
		}

		set chart(newchart) {
			this.chart = newchart;
		}

		//adds an additional boxplot on the current chart
		addPlot(name) {
			let exists = -1;
			this.data.forEach((nm, index) => {
					if(nm.x == name) {
						exists = index;
					}
				}
			)
			if(exists == -1) {
				const index = this.values.push([]) - 1;
				this.data.push({x: name});
				this.recalculate(index);
				this.rebuildPlot();
			}
		}

		removePlot(name) {
			let exists = -1;
			this.data.forEach((nm, index) => {
					if(nm.x == name) {
						exists = index;
					}
				}
			)
			if(exists != -1) {
				this.data.splice(exists, 1);
				this.points.splice(exists, 1);
				this.values.splice(exists, 1);
				this.rebuildPlot();
			}
		}

		//adds value to the dataset of boxplot at index index
		addValue(val, index) {
			this.values[index].push(val);
			this.recalculate(index);
			this.rebuildPlot();
		}

		//removes value from the dataset of boxplot at index index
		removeValue(val, index) {
			var dataset = this.values[index];
			if(dataset.indexOf(val) !== -1) {
				dataset.splice(dataset.indexOf(val), 1);
				this.recalculate(index);
				this.rebuildPlot();
			}
		}
		
		//adds reference value point to boxplot at index index
		addRefPoint(value, index) {
			if(this.points[index] == null) {
				this.points[index] = [value];
			} else if(this.points[index].indexOf(value) == -1) {
				//prevent duplicate reference points on same boxplot
				this.points[index].push(value);
			}
			this.rebuildPlot();
		}

		removeRefPoint(toRemove, index) {
			let newPoints = this.points[index].filter(element => element != toRemove);
			this.points[index] = newPoints;
			this.rebuildPlot();
		}

		//helper method for recalculate to get the median of array arr
		getMedian(arr) {
			if(arr.length % 2 === 0) {
				const val1 = arr[arr.length / 2];
				const val2 = arr[(arr.length / 2) - 1];
				return (val1 + val2) / 2.0;
			} else {
				return arr[Math.floor(arr.length / 2)];
			}
		}
		
		//calculates the 5 key points of the boxplot at index index, and updates the data to reflect that
		recalculate(index) {
			var dataset = this.values[index];

			dataset.sort(function(a, b) {return a-b});

			const toAdd = {low: 0, q1: 0, median: 0, q3: 0, high: 0};
			if(this.data.length == 0) {
				toAdd.x = "Sample Data";
			} else {
				toAdd.x = this.data[index].x;
			}
			toAdd.low = Math.min.apply(Math, dataset);
			toAdd.q1 = this.getMedian(dataset.slice(0, dataset.length / 2));
			toAdd.median = this.getMedian(dataset);
			toAdd.q3 = 0;
			toAdd.high = Math.max.apply(Math, dataset);
			if(dataset.length % 2 === 0) {
				toAdd.q3 = this.getMedian(dataset.slice(dataset.length / 2));
			} else {
				toAdd.q3 = this.getMedian(dataset.slice(dataset.length / 2 + 1));
			}

			if(this.outliers) { //check if outliers is true
				const iqr = (toAdd.q3 - toAdd.q1) * 1.5;
				if (toAdd.high > toAdd.q3+iqr){
					toAdd.high = toAdd.q3+iqr;
				}
				if (toAdd.low < toAdd.q1-iqr){
					toAdd.low = toAdd.q1-iqr;
				}
				const findOutliers = dataset.filter(element => ((element < toAdd.low) || (element > toAdd.high)));
				toAdd.outliers = findOutliers;
			}
			
			this.data[index] = toAdd;
		}

		rebuildPlot() {
			//first remove the boxplots and the points
			this.chart.removeAllSeries();
		
			//builds all boxplots first
			this.series = this.chart.box(this.data); //box.data is a list of dictionaries
			this.series.normal().fill("#0077ff", 0.6);
			this.series.hovered().fill("#0077ff", 0.2);
			this.series.selected().fill("#0077ff", 0.8);
			this.series.normal().stroke("##0313fc", 1, "10 5", "round");
			this.series.hovered().stroke("##0313fc", 2, "10 5", "round");
			this.series.selected().stroke("##0313fc", 4, "10 5", "round");
			this.series.whiskerWidth(5);
			this.series.whiskerStroke({color: '#4680ac', thickness: 5});
		
			this.series.xPointPosition(0.5);
		
			//adds points corresponding to boxplots
			//adds each subarray of points to arr
			let arr = [];
			for(let i = 0; i < this.points.length; i++) {
				//takes the x of the corresponding boxplot so that they line up
				arr.push({x: this.data[i].x, low:0, q1:0, median:0, q3:0, high:0, outliers: this.points[i]});
			}
			//adds arr to the chart
			this.series2 = this.chart.box(arr); //pts 1
		
			this.series2.normal().fill("#ff0000", 0.6);
			this.series2.normal().stroke({thickness:0});
			this.series2.hovered().stroke({thickness:0});
			this.series2.selected().stroke({thickness:0});
			this.series2.medianStroke({thickness:0});
			this.series2.tooltip(false);
			this.series2.xPointPosition(0.5);
		
			// buildDropdown();
		}

		flipAxes() {
			this.chart.isVertical(!this.chart.isVertical());
		}

		toggleOutliers() {
			this.outliers = !this.outliers;
			for(let i = 0; i < this.data.length; i++) {
				this.recalculate(i); // recalculate each dataset to (not) include outliers
			}
			this.rebuildPlot();
		}

		toggleArms() {
			if(this.showArms) {
				this.series.stemStroke({color:"#4680ac", thickness:1});
				this.showArms = false;
			} else {
				this.series.stemStroke({thickness:0});
				this.showArms = true;
			}
		}
	}

	customElements.define('boxplot-main', BoxPlot);
})();

//refreshes plot to reflect most current data in the structure
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
