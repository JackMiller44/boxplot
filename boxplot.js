(function() {
	let template = document.createElement("template");
	template.innerHTML = `
	
	`; //TODO: Put border radius, other styling stuff here

	class BoxPlot extends HTMLElement {
		chart = anychart.box();
		constructor() {
			super();
			var data = [
				{x:"Data", low: this.low, q1: this.q1, median: this.median, q3: this.q3, high: this.high}
			];
			// create a box series and set the data
			series = chart.box(data);

			// set the container id
			chart.container("container");

			// initiate drawing the chart
			chart.draw();
			//TODO: understand what shadow DOMs do and how they can benefit here
		}

		onCustomWidgetAfterUpdate(oChangedProperties) {
			//TODO: figure out how to update the boxplot HTML after we add values
		}

		get values() {
			return this._values();
		}

		addValue(val) {
			this._values.push(val);
			this.recalculate();
		}

		removeSegment(val) {
			if(this._values.indexOf(val) !== -1) {
				this._values.splice(this._values.indexOf(val), 1);
				this.recalculate();
			}
		}
		
		recalculate() {
			low = Math.min(_values);
			median = getMedian(_values);
			high = Math.max(_values);
			q1 = getMedian(_values.slice(0, _values.length / 2));
			q3 = 0;
			if(_values.length % 2 === 0) {
				q3 = getMedian(_values.slice(_values.length / 2));
			} else {
				q3 = getMedian(_values.slice(_values.length / 2 + 1));
			}
			this.chart.draw();
		}

		getMedian(arr) {
			if(arr.length % 2 === 0) {
				val1 = arr[arr.length / 2];
				val2 = arr[(arr.length / 2) - 1];
				return (val1 + val2) / 2.0;
			} else {
				return arr[Math.floor(arr.length / 2)];
			}
		}
	}
})