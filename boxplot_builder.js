(function()  {

	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset id="field">
				<input id="builder_chartTitle" value="" type="text"></input>
			</fieldset>
		</form>
		`;

	class BoxPlot_Builder extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this.container;
			this.props = {};
			this.template = template.content.cloneNode(true);

			this.container = document.createElement("div");
			this._shadowRoot.appendChild(this.template);
            this._shadowRoot.appendChild(this.container);

			// this.construct();
		}

		connectedCallback() {
		}
		
		attributeChangedCallback(name, oldValue, newValue) {
			console.log(newValue);
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							chartTitle: this.chartTitle,
							color: this.color,
							isVertical: this.isVertical,
							showsOutliers: this.showsOutliers,
							showsArms: this.showsArms,
							xAxes: this.xAxes,
							values: this.values,
							points: this.points
						}
					}
			}));
		}

		changeProps(props) {
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
				detail: {
					properties: {
						chartTitle: props.chartTitle,
						color: props.color,
						isVertical: props.isVertical,
						showsOutliers: props.showsOutliers,
						showsArms: props.showsArms,
						xAxes: props.xAxes,
						values: props.values,
						points: props.points
					}
				}
			}));
			this.props = props;
			this.construct();
		}

		set color(color) {
			this.props.backgroundColor = color;
			this.construct();
		}

		get color() {
			return this.props.backgroundColor;
		}

		set isVertical(value) {
			if (typeof value === "boolean") {
				this.props.isVertical = value;
			}
			if (typeof value === "string" ) {
				this.props.isVertical = JSON.parse(value);
			}
		}

		set showsOutliers(value) {
			if (typeof value === "boolean") {
				this.props.showsOutliers = value;
			}
			if (typeof value === "string" ) {
				this.props.showsOutliers = JSON.parse(value);
			}
		}

		set showsArms(value) {
			if (typeof value === "boolean") {
				this.props.showsArms = value;
			}
			if (typeof value === "string" ) {
				this.props.showsArms = JSON.parse(value);
			}
		}

        set values(value) {
			if (typeof value === "object") {
				this.props.values = value;
			}
			if (typeof value === "string" ) {
				this.props.values = JSON.parse(value);
			}
			//this.constructValues();
		}

		set points(value) {
			if (typeof value === "object") {
				this.props.points = value;
			}
			if (typeof value === "string" ) {
				this.props.points = JSON.parse(value);
			}
			this.construct();
        }

		set xAxes(value) {
			if (typeof value === "object") {
				this.props.xAxes = value;
			}
			if (typeof value === "string" ) {
				this.props.xAxes = JSON.parse(value);
			}
		}

		set chartTitle(value) {
			this._shadowRoot.getElementById("builder_chartTitle").value = value;
		}

		get values() {
			// change this
			return this._shadowRoot.getElementById("values").value;
		}

		get points() {
			// change this
			return this._shadowRoot.getElementById("points").value;
		}

		get xAxes() {
			// change this
			return this.props.xAxes;
		}

		get chartTitle() {
			return this._shadowRoot.getElementById("builder_chartTitle").value;
		}

		

		colorChange(e) {
			console.log(e);
		}

		segmentListChange(e) {
			console.log(e);
		}

		construct() {
			this.constructContainer();
			this.constructStyle();
			// this.constructValues();
			// this.constructPoints();
			this.constructTitle();
			this.constructBoxPlots();
		}

		constructContainer() {
			this.container?.parentNode.removeChild(this.container);
			this.container = document.createElement("div");
            this._shadowRoot.appendChild(this.container);
			
			this._shadowRoot.removeChild(this._shadowRoot.getElementById("form"));
			this.template = template.content.cloneNode(true);
            this._shadowRoot.appendChild(this.template);
		}

		constructStyle() {
			const style = document.createElement('style');

			style.innerHTML = `
				:host {
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				html, body {
					display: block;
					position: relative;
					width: 100%;
					height: 100%;
					margin: 0;
					padding: 0;
				}
				#boxplot {
					display: block;
					position: relative;
					left: 120px;
					width:40%;
					height: 85%;
					margin:0;
					padding:0;
				}
            `;
			this.container.appendChild(style);
        }

		// constructPoints() {
		// 	this.props.points.forEach((item,i) => {
		// 		const section = document.createElement("div");
		// 		section.style.display = "flex";
		// 		section.style.alignItems = "center"

		// 		const inputContainer = document.createElement("div");
		// 		inputContainer.style.display = "flex";
		// 		inputContainer.style.flexDirection = "column";
		// 		inputContainer.style.width = "100%";

		// 		const el = document.createElement("input");
		// 		el.type = "text";

		// 		const lbl = document.createElement("label");
		// 		lbl.innerHTML = "Reference points of " + this.props.xAxes[i];
		// 		lbl.style.marginTop = "16px";

		// 		const del = document.createElement("button");
		// 		del.innerHTML = "delete";
		// 		del.style.marginTop = "auto";
		// 		del.style.marginLeft = "16px";
		// 		del.addEventListener("click", event => {
		// 			const newProps = JSON.parse(JSON.stringify(this.props));
		// 			if (i > -1) {
		// 				newProps.points.splice(i, 1);
		// 			}
		// 			this.changeProps(newProps);
		// 		});
				
		// 		this.container.appendChild(section);
		// 		section.appendChild(inputContainer);
		// 		section.appendChild(del);
		// 		inputContainer.appendChild(lbl);
		// 		inputContainer.appendChild(el);
		// 		el.value = item;
		// 		el.addEventListener("change", event => {
		// 			const newProps = JSON.parse(JSON.stringify(this.props));
		// 			// maybe need to parse from string to array
		// 			newProps.points[i] = event.path[0].value;
		// 			this.changeProps(newProps);
		// 		});


		// 	});

		// 	const add = document.createElement("button");
		// 	add.innerHTML = "add";
		// 	add.style.display = "block";
		// 	add.style.margin = "16px auto";
		// 	this.container.appendChild(add);

		// 	const hr = document.createElement("hr");
		// 	this.container.appendChild(hr);

		// 	// points will not be created on their own
		// 	// add.addEventListener("click", event => {
		// 	// 	const newProps = JSON.parse(JSON.stringify(this.props));
		// 	// 	newProps.points.push({"label": "new segment"});
		// 	// 	this.changeProps(newProps);
		// 	// });
        // }

		// constructValues() {
		// 	this.props.values.forEach((item,i) => {
		// 		const section = document.createElement("div");
		// 		section.style.display = "flex";
		// 		section.style.alignItems = "center"

		// 		const inputContainer = document.createElement("div");
		// 		inputContainer.style.display = "flex";
		// 		inputContainer.style.flexDirection = "column";

		// 		const el = document.createElement("input");
		// 		el.type = "text";
		// 		el.style.maxWidth = "80px";

		// 		const lbl = document.createElement("label");
		// 		lbl.innerHTML = "Values of " + this.props.xAxes[i];
		// 		lbl.style.marginTop = "16px";

		// 		const del = document.createElement("button");
		// 		del.innerHTML = "delete";
		// 		del.style.marginTop = "auto";
		// 		del.style.marginLeft = "16px";
		// 		del.addEventListener("click", event => {
		// 			const newProps = JSON.parse(JSON.stringify(this.props));
		// 			if (i > -1) {
		// 				newProps.values.splice(i, 1);
		// 			}
		// 			this.changeProps(newProps);
		// 		});
				
		// 		this.container.appendChild(section);
		// 		section.appendChild(inputContainer);
		// 		section.appendChild(del);
		// 		inputContainer.appendChild(lbl);
		// 		inputContainer.appendChild(el);
		// 		el.value = item;
		// 		el.addEventListener("change", event => {
		// 			const newProps = JSON.parse(JSON.stringify(this.props));
		// 			// maybe need to parse from string to array
		// 			newProps.values[i] = event.path[0].value;
		// 			this.changeProps(newProps);
		// 		});
		// 	});

		// 	const add = document.createElement("button");
		// 	add.innerHTML = "add";
		// 	add.style.display = "block";
		// 	add.style.margin = "16px auto";
		// 	this.container.appendChild(add);
		// 	add.addEventListener("click", event => {
		// 		const newProps = JSON.parse(JSON.stringify(this.props));
		// 		if (!newProps.values) {
		// 			newProps.values = []
		// 		}
		// 		const newValues = [];
		// 		const newPoints = [];
		// 		newProps.values.push(newValues);
		// 		newProps.points.push(newPoints);
		// 		this.changeProps(newProps);
		// 	});
		// }

		constructTitle() {
			const nm = this._shadowRoot.getElementById("builder_chartTitle");
			nm.value = this.chartTitle;
			nm.style.padding = "3px 0px 3px 0px";
			nm.style.margin = "5px 0px 20px 0px";
			nm.style.fontSize = "25px";
			nm.addEventListener("change", event => {
				const newProps = JSON.parse(JSON.stringify(this.props));
				newProps.chartTitle = event.path[0].value;
				this.changeProps(newProps);
			});
		}

		constructBoxPlots() {
			const fset = this._shadowRoot.getElementById("field");
			fset.style.display = "flex";
			fset.style.flexDirection = "column";
			fset.style.width = "100%";

			const flip = document.createElement("input");
			flip.type = "button";
			flip.value = "Orientation: Vertical";
			flip.style.fontSize = "19px";
			flip.style.padding = "3px 0px 3px 0px";
			flip.style.margin = "20px 0px 3px 0px";
			flip.addEventListener("click", event => {
				const newProps = JSON.parse(JSON.stringify(this.props));
				newProps.isVertical = !newProps.isVertical;
				if(newProps.isVertical) {
					flip.value = "Orientation: Vertical";
				} else {
					flip.value = "Orientation: Horizontal";
				}
				this.changeProps(newProps);
			});
			fset.appendChild(flip);

			const out = document.createElement("input");
			out.type = "button";
			out.value = "Outliers: Off";
			out.style.fontSize = "19px";
			out.style.padding = "3px 0px 3px 0px";
			out.style.margin = "20px 0px 3px 0px";
			out.addEventListener("click", event => {
				const newProps = JSON.parse(JSON.stringify(this.props));
				newProps.showsOutliers = !newProps.showsOutliers;
				if(newProps.showsOutliers) {
					out.value = "Outliers: On";
				} else {
					out.value = "Outliers: Off";
				}
				this.changeProps(newProps);
			});
			fset.appendChild(out);

			const arms = document.createElement("input");
			arms.type = "button";
			arms.value = "Arms: On";
			arms.style.fontSize = "19px";
			arms.style.padding = "3px 0px 3px 0px";
			arms.style.margin = "20px 0px 3px 0px";
			arms.addEventListener("click", event => {
				
				const newProps = JSON.parse(JSON.stringify(this.props));
				newProps.showsArms = !newProps.showsArms;
				if(newProps.showsArms) {
					arms.value = "Arms: On";
				} else {
					arms.value = "Arms: Off";
				}
				this.changeProps(newProps);
			});
			fset.appendChild(arms);

			// Reference Points
			const elr = document.createElement("input");
			elr.type = "text";
			elr.style.padding = "3px 0px 3px 3px";
			elr.style.margin = "5px 0px 15px 0px";
			elr.value = this.props.points;
			elr.addEventListener("change", event => {
				const newProps = JSON.parse(JSON.stringify(this.props));
				newProps.points = JSON.parse("[" + event.path[0].value + "]");
				this.changeProps(newProps);
			});

			const lblr = document.createElement("label");
			lblr.innerHTML = "Reference Points: ";
			lblr.style.padding = "15px 5px 2px 0px";

			fset.appendChild(lblr);
			fset.appendChild(elr);

			// this.props.xAxes.forEach((item, i) => {
			// 	// Flip Axes
			// 	const ttl = document.createElement("input");
			// 	ttl.type = "button";
			// 	ttl.value = item;
			// 	ttl.style.fontSize = "19px";
			// 	ttl.style.padding = "3px 0px 3px 0px";
			// 	ttl.style.margin = "20px 0px 3px 0px";
			// 	ttl.addEventListener("change", event => {
			// 		const newProps = JSON.parse(JSON.stringify(this.props));
			// 		newProps.xAxes[i] = event.path[0].value;
			// 		this.changeProps(newProps);
			// 	});
			// 	fset.appendChild(ttl);

			// 	// Value Set
			// 	const el = document.createElement("input");
			// 	el.type = "text";
			// 	el.style.padding = "3px 0px 3px 3px";
			// 	el.style.margin = "5px 0px 5px 0px";
			// 	el.value = this.props.values[i];
			// 	el.addEventListener("change", event => {
			// 		const newProps = JSON.parse(JSON.stringify(this.props));
			// 		newProps.values[i] = JSON.parse("[" + event.path[0].value + "]");
			// 		this.changeProps(newProps);
			// 	});

			// 	const lbl = document.createElement("label");
			// 	lbl.innerHTML = "Values of " + item;
                				
            //     lbl.style.padding = "15px 5px 2px 0px";
            //     lbl.style.fontSize = "20";

			// 	fset.appendChild(lbl);
			// 	fset.appendChild(el);
			// 	// Reference Points
			// 	const elr = document.createElement("input");
			// 	elr.type = "text";
			// 	elr.style.padding = "3px 0px 3px 3px";
			// 	elr.style.margin = "5px 0px 15px 0px";
			// 	elr.value = this.props.points[i];
			// 	elr.addEventListener("change", event => {
			// 		const newProps = JSON.parse(JSON.stringify(this.props));
			// 		newProps.points[i] = JSON.parse("[" + event.path[0].value + "]");
			// 		this.changeProps(newProps);
			// 	});

			// 	const lblr = document.createElement("label");
			// 	lblr.innerHTML = "Reference Points for " + item;
			// 	lblr.style.padding = "15px 5px 2px 0px";

			// 	fset.appendChild(lblr);
			// 	fset.appendChild(elr);
			// 	// Delete Button
			// 	const del = document.createElement("button");
			// 	del.innerHTML = "Delete";
			// 	del.style.padding = "3px 0px 3px 0px";
			// 	del.style.margin = "5px 0px 15px 0px";
			// 	del.addEventListener("click", event => {
			// 		const newProps = JSON.parse(JSON.stringify(this.props));
			// 		if (i > -1) {
			// 			newProps.xAxes.splice(i, 1);
			// 			newProps.values.splice(i, 1);
			// 			newProps.points.splice(i, 1);
			// 		}
			// 		this.changeProps(newProps);
			// 	});
				
			// 	fset.appendChild(del);
			//  });
			// Add Button
			// const add = document.createElement("button");
			// add.innerHTML = "add";
			// add.style.padding = "3px 0px 3px 0px";
			// add.style.margin = "15px 0px 5px 0px";
			// add.addEventListener("click", event => {
			// 	const newProps = JSON.parse(JSON.stringify(this.props));
			// 	newProps.xAxes.push("");
			// 	newProps.values.push([]);
			// 	newProps.points.push([]);
			// 	this.changeProps(newProps);
			// });	

			// fset.appendChild(add);	
		}
	}

    customElements.define("boxplot-builder", BoxPlot_Builder);
})();