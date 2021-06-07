(function() {
	class BoxPlot extends HTMLElement {
		_defaultValues = [0, 25, 50, 75, 100, 200];
		_values = this._defaultValues;
		_outliers = false;
		_showArms = false;
		data = [];
		points = [69, 420];
		constructor() {
			super();
			this.recalculate();
			//TODO: understand what shadow DOMs do and how they can benefit here
		}

		conectedCallback() {
			
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

		addValue(val) {
			this._values.push(val);
			this.recalculate();
		}

		removeValue(val) {
			if(this._values.indexOf(val) !== -1) {
				this._values.splice(this._values.indexOf(val), 1);
				this.recalculate();
			}
		}
		
		addSeries() {
			this.data.push({});
		}

		addPoints(val) {
			this._points.push(val);
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
		
		recalculate() {
			this._values.sort(function(a, b) {return a-b});

			const toAdd = {x: "Sample Data", low: 0, q1: 0, median: 0, q3: 0, high: 0};

			toAdd.low = Math.min.apply(Math, this._values);
			toAdd.q1 = this.getMedian(this._values.slice(0, this._values.length / 2));
			toAdd.median = this.getMedian(this._values);
			toAdd.q3 = 0;
			toAdd.high = Math.max.apply(Math, this._values);
			if(this._values.length % 2 === 0) {
				toAdd.q3 = this.getMedian(this._values.slice(this._values.length / 2));
			} else {
				toAdd.q3 = this.getMedian(this._values.slice(this._values.length / 2 + 1));
			}

			if(this._outliers) {
				const iqr = (toAdd.q3 - toAdd.q1) * 1.5;
				const lmao = this._values.filter((element) => {element < toAdd.q1 - iqr || element > toAdd.q3 + iqr});
				toAdd.outliers = lmao;
			}
			
			this.data.pop();
			this.data.push(toAdd);
		}

	}

	customElements.define('boxplot-practice', BoxPlot);
})();

const box = document.querySelector('#boxplot');

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
	
	series2 = chart.box([{x: "Sample Data", low: 0, q1:0, median:0, q3:0, high:0, outliers: box.points}]);
	series2.normal().fill("#ff0000", 0.6);
	series2.normal().stroke({thickness:0});
	series2.hovered().stroke({thickness:0});
	series2.selected().stroke({thickness:0});
	series2.medianStroke({thickness:0});
	series2.tooltip(false);
	series2.xPointPosition(0.5);
	// set the chart title
	var title = chart.title("Sample Box Plot");

	// set the containder id
	chart.container("boxplot");

	// initiate drawing the chart
	chart.draw();
});

function addData() {
	var toAdd = document.getElementById("addPoint");
	box.addValue(parseInt(toAdd.value));
	chart.removeSeriesAt(0);
	series = chart.box(box.data);
}

function removeData() {
	box.removeValue(parseInt(document.getElementById("removePoint").value));
	chart.removeSeriesAt(0);
	series = chart.box(box.data);
}

function changeOrientation() {
	chart.isVertical(!chart.isVertical());
}

function toggleOutliers() {
	box.outliers = !box.outliers;
	box.recalculate();
	chart.removeSeriesAt(0);
	series = chart.box(box.data);
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