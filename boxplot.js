(function() {
	class BoxPlot extends HTMLElement {
		_defaultValues = [0, 25, 50, 75, 100];
		_values = this._defaultValues;
		data = [];
		constructor() {
			super();
			console.log("abcd");
			this.recalculate();
			//TODO: understand what shadow DOMs do and how they can benefit here
		}

		conectedCallback() {
			//TODO: figure out how to update the boxplot HTML after we add values
			
		}

		get getvalues() {
			return this._values;
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
			this.data.low = Math.min.apply(Math, this._values);
			this.data.median = this.getMedian(this._values);
			this.data.high = Math.max.apply(Math, this._values);
			this.data.q1 = this.getMedian(this._values.slice(0, this._values.length / 2));
			this.data.q3 = 0;
			if(this._values.length % 2 === 0) {
				this.data.q3 = this.getMedian(this._values.slice(this._values.length / 2));
			} else {
				this.data.q3 = this.getMedian(this._values.slice(this._values.length / 2 + 1));
			}
		}

	}

	customElements.define('boxplot-practice', BoxPlot);
})();