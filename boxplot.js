(function() {

	function loadMyScript() {
		var my_src = document.createElement('script');
		my_src.src='https://cdn.anychart.com/releases/8.10.0/js/anychart-core.min.js';
		document.body.appendChild(my_src);
		var my_src2 = document.createElement('script');
		my_src2.src='https://cdn.anychart.com/releases/8.10.0/js/anychart-cartesian.min.js';
		document.body.appendChild(my_src2);
	  }

	  loadMyScript();
	
	let template = document.createElement("template");
	template.innerHTML = `
					<style>
						:host {
							display: block;
						} 
					</style> 
					<boxplot-main id="boxplot"></boxplot-main>
				`;

	class BoxPlot extends HTMLElement {
		values = [[0, 25, 50, 75, 100, 400]];
		outliers = false;
		showArms = false;
		data = [];
		points = [[120, 420]];
		chart = null;

		constructor() {
			super();

			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true)); 
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};

			var chart = anychart.box();

			// create a box series and set the data
			

			// set the chart title
			chart.title("Sample Box Plot");

			// set the containder id
			var domElement = shadowRoot.getElementById('boxplot');

			chart.container(domElement);

			// initiate drawing the chart
			chart.draw();
			this.recalculate(0);
			// this.rebuildPlot();
			// this.chart = chart;
			this.series; //variable for boxplots
			this.series2; //variable for reference points on boxplots
			// const chart = anychart.box();
			//TODO: understand what shadow DOMs do and how they can benefit here
		}
		
		connectedCallback(){
			
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			console.log("onCustomWidgetAfterUpdate")
			console.log("this._props prop = ", this._props);
			this._props = { ...this._props, ...changedProperties };

			var ctx = this.shadowRoot.getElementById('boxplot');

			var myProps = this._props
			
			myRebuildPlot(ctx);


			function myRebuildPlot(ctx) {
				ctx.chart.removeAllSeries();
		
				//builds all boxplots first
				ctx.series = ctx.chart.box(ctx.data); //box.data is a list of dictionaries
				ctx.series.normal().fill("#0077ff", 0.6);
				ctx.series.hovered().fill("#0077ff", 0.2);
				ctx.series.selected().fill("#0077ff", 0.8);
				ctx.series.normal().stroke("##0313fc", 1, "10 5", "round");
				ctx.series.hovered().stroke("##0313fc", 2, "10 5", "round");
				ctx.series.selected().stroke("##0313fc", 4, "10 5", "round");
				ctx.series.whiskerWidth(5);
				ctx.series.whiskerStroke({color: '#4680ac', thickness: 5});
			
				ctx.series.xPointPosition(0.5);
			
				//adds points corresponding to boxplots
				//adds each subarray of points to arr
				let arr = [];
				for(let i = 0; i < ctx.points.length; i++) {
					//takes the x of the corresponding boxplot so that they line up
					arr.push({x: ctx.data[i].x, low:0, q1:0, median:0, q3:0, high:0, outliers: ctx.points[i]});
				}
				//adds arr to the chart
				ctx.series2 = ctx.chart.box(arr); //pts 1
			
				ctx.series2.normal().fill("#ff0000", 0.6);
				ctx.series2.normal().stroke({thickness:0});
				ctx.series2.hovered().stroke({thickness:0});
				ctx.series2.selected().stroke({thickness:0});
				ctx.series2.medianStroke({thickness:0});
				ctx.series2.tooltip(false);
				ctx.series2.xPointPosition(0.5);
			}
			console.log("changedProperties = ", changedProperties);
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
				this.rebuildPlot(this.chart);
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
				this.rebuildPlot(chart);
			}
		}

		//adds value to the dataset of boxplot at index index
		addValue(val, index) {
			this.values[index].push(val);
			this.recalculate(index);
			this.rebuildPlot(chart);
		}

		//removes value from the dataset of boxplot at index index
		removeValue(val, index) {
			var dataset = this.values[index];
			if(dataset.indexOf(val) !== -1) {
				dataset.splice(dataset.indexOf(val), 1);
				this.recalculate(index);
				this.rebuildPlot(chart);
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
			this.rebuildPlot(chart);
		}

		removeRefPoint(toRemove, index) {
			let newPoints = this.points[index].filter(element => element != toRemove);
			this.points[index] = newPoints;
			this.rebuildPlot(chart);
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
			chart.removeAllSeries();
		
			//builds all boxplots first
			this.series = chart.box(this.data); //box.data is a list of dictionaries
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
			this.series2 = chart.box(arr); //pts 1
		
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