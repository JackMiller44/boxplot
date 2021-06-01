(function() {
	let template = document.createElement("template");
	template.innerHTML = `
	
	`; //Put border radius, other styling stuff here

	class BoxPlot extends HTMLElement {
		constructor() {
			super();
			
		}

		addValue(val) {
			this._values.push(val);
		}

		removeSegment(val) {
			if(this._values.indexOf(val) !== -1) {
				this._values.splice(this._values.indexOf(val), 1);
			}
		}
	}
})