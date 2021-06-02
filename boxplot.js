(function() {
	class BoxPlot extends HTMLElement {
		_defaultValues = [0, 25, 50, 75, 100];
		_values = this._defaultValues;
		data = [];
		constructor() {
			super();
			this.data.x = "Data";
			this.recalculate();
			//TODO: understand what shadow DOMs do and how they can benefit here
		}

		conectedCallback() {
			
		}

		get values() {
			return this._values;
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

			const toAdd = {low: 0, q1: 0, median: 0, q3: 0, high: 0};

			toAdd.low = Math.min.apply(Math, this._values);
			toAdd.q1 = this.getMedian(this._values.slice(0, this._values.length / 2));
			toAdd.median = this.getMedian(this._values);
			toAdd.q3 = 0;
			if(this._values.length % 2 === 0) {
				toAdd.q3 = this.getMedian(this._values.slice(this._values.length / 2));
			} else {
				toAdd.q3 = this.getMedian(this._values.slice(this._values.length / 2 + 1));
			}
			toAdd.high = Math.max.apply(Math, this._values);

			this.data.pop();
			this.data.push(toAdd);
			console.log("recalculated");
		}

	}

	customElements.define('boxplot-practice', BoxPlot);
})();

const box = document.querySelector('#boxplot');

anychart.onDocumentReady(function () {
	chart = anychart.box();

	// create a box series and set the data
	series = chart.box(box.data);

	console.log(series.id());

	// set the chart title
	var title = chart.title("nice boxplot");

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