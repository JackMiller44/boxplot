(function() {
	class BoxPlot extends HTMLElement {
		_defaultValues = [0, 25, 50, 75, 100, 400];
		_values = [this._defaultValues];
		_outliers = false;
		_showArms = false;
		data = [];
		points = [[120, 420]];
		constructor() {
			super();
			this.recalculate(0);
			//TODO: understand what shadow DOMs do and how they can benefit here
		}

		get values() {
			return this._values;
		}

		set outliers(newval) {
			this._oultliers = newval;
		}

		get showArms() {
			return this._showArms;
		}

		set showArms(newval) {
			this._showArms = newval;
		}

		//adds an additional boxplot on the current chart
		addPlot(arr, name) {
			const index = this._values.push(arr) - 1;
			this.data.push({x: name});
			this.recalculate(index);
		}

		//adds value to the dataset of boxplot at index index
		addValue(val, index) {
			this._values[index].push(val);
			this.recalculate(index);
		}

		//removes value from the dataset of boxplot at index index
		removeValue(val, index) {
			var dataset = this._values[index];
			if(dataset.indexOf(val) !== -1) {
				dataset.splice(dataset.indexOf(val), 1);
				this.recalculate(index);
			}
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
			var dataset = this._values[index];

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

			if(this._outliers) { //check if outliers is true
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

	}

	customElements.define('boxplot-practice', BoxPlot);
})();

const box = document.querySelector('#boxplot');

//refreshes plot to reflect most current data in the structure
function rebuildPlot() {
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
}

anychart.onDocumentReady(function () {
	chart = anychart.box();
	
	// create a box series and set the data
	rebuildPlot();
	
	// set the chart title
	chart.title("Sample Box Plot");

	// set the containder id
	chart.container("boxplot");

	// initiate drawing the chart
	chart.draw();
});

function addBox(name) {
	box.addPlot([], name);
	rebuildPlot();
}

//index corresponds to the index of the dropdown menu
function addData(index) {
	box.addValue(parseInt(document.getElementById("addData").value), index);
	rebuildPlot();
}

//index corresponds to the index of the dropdown menu
function removeData(index) {
	box.removeValue(parseInt(document.getElementById("removeData").value), index);
	rebuildPlot();
}

//index corresponds to the index of the dropdown menu
function addPoint(index) {
	if(box.points[index] == null) {
		box.points[index] = [parseInt(document.getElementById("addPoint").value)];
	} else {
		box.points[index].push(parseInt(document.getElementById("addPoint").value));
	}
	rebuildPlot();
}

function removePoint(index) {
	const toRemove = parseInt(document.getElementById("addPoint").value);
	const newPoints = box.points[index].filter(element => element != toRemove);
	box.points[index] = newPoints;
	rebuildPlot();
}

function changeOrientation() {
	chart.isVertical(!chart.isVertical());
}

function toggleOutliers() {
	box._outliers = !box._outliers;
	box.recalculate(0); //change 0 when we make dropdown menu
	rebuildPlot();
}

function toggleArms() {
	if(box.showArms) {
		series.stemStroke({color:"#4680ac", thickness:1});
		box.showArms = false;
	} else {
		series.stemStroke({thickness:0});
		box.showArms = true;
	}
}
