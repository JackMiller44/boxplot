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

		addPlot(arr, name) {
			const index = this._values.push(arr) - 1;
			this.data.push({x: name});
			this.recalculate(index);
		}

		addValue(val, index) {
			this._values[index].push(val);
			this.recalculate(index);
		}

		removeValue(val, index) {
			var dataset = this._values[index];
			if(dataset.indexOf(val) !== -1) {
				dataset.splice(dataset.indexOf(val), 1);
				this.recalculate(index);
			}
		}

		getMedian(arr) {
			if(arr.length % 2 === 0) {
				const val1 = arr[arr.length / 2];
				const val2 = arr[(arr.length / 2) - 1];
				return (val1 + val2) / 2.0;
			} else {
				return arr[Math.floor(arr.length / 2)];
			}
		}
		
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

			if(this._outliers) {
				const iqr = (toAdd.q3 - toAdd.q1) * 1.5;
				if (!(toAdd.high <= toAdd.q3+iqr)){
					toAdd.high = toAdd.q3+iqr;
				}
				if (!(toAdd.low >= toAdd.q1-iqr)){
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

function rebuildPlot() {
	chart.removeSeriesAt(0);
	chart.removeSeriesAt(0);

	series = chart.box(box.data); //box 1
	series.normal().fill("#0077ff", 0.6);
	series.hovered().fill("#0077ff", 0.2);
	series.selected().fill("#0077ff", 0.8);
	series.normal().stroke("##0313fc", 1, "10 5", "round");
	series.hovered().stroke("##0313fc", 2, "10 5", "round");
	series.selected().stroke("##0313fc", 4, "10 5", "round");
	series.whiskerWidth(5);
	series.whiskerStroke({color: '#4680ac', thickness: 5});

	series.xPointPosition(0.5);

	series2 = chart.box([
		{x: "Sample Data", low: 0, q1:0, median:0, q3:0, high:0, outliers: box.points[0]}
	]); //pts 1

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
	series = chart.box(box.data);

	series.normal().fill("#0077ff", 0.6);
	series.hovered().fill("#0077ff", 0.2);
	series.selected().fill("#0077ff", 0.8);
	series.normal().stroke("##0313fc", 1, "10 5", "round");
	series.hovered().stroke("##0313fc", 2, "10 5", "round");
	series.selected().stroke("##0313fc", 4, "10 5", "round");
	series.whiskerWidth(5);
	series.whiskerStroke({color: '#4680ac', thickness: 5});

	series.xPointPosition(0.5);

	series2 = chart.box([
		{x: "Sample Data", low: 0, q1:0, median:0, q3:0, high:0, outliers: box.points[0]}
	]);

	series2.normal().fill("#ff0000", 0.6);
	series2.normal().stroke({thickness:0});
	series2.hovered().stroke({thickness:0});
	series2.selected().stroke({thickness:0});
	series2.medianStroke({thickness:0});
	series2.tooltip(false);

	series2.xPointPosition(0.5);
	
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
	box.points.push(parseInt(document.getElementById("addPoint").value), index);
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
