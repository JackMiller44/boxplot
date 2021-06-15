(function()  {
	class BoxPlot_Builder extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this.container;
			this.props = {};

			this.container = document.createElement("div");
            this._shadowRoot.appendChild(this.container);
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
							color: this.color,
							xAxes: this.xAxes,
							values: this.values,
							points: this.points
						}
					}
			}));
		}

		changeProps(props) {
			document.dispatchEvent(new CustomEvent("propertiesChanged", {
				detail: {
					properties: {
						color: props.color,
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
			return this._shadowRoot.getElementById("backgroundColor").value;
		}

        set values(value) {
			if (typeof value === "object") {
				this.props.values = value;
			}
			if (typeof value === "string" ) {
				this.props.values = JSON.parse(value);
			}
			this.constructSegmentHtml();
		}

		set points(value) {
			if (typeof value === "object") {
				this.props.points = value;
			}
			if (typeof value === "string" ) {
				this.props.points = JSON.parse(value);
			}
			this.constructNodeHTML();
        }

		set xAxes(value) {
			if (typeof value === "object") {
				this.props.xAxes = value;
			}
			if (typeof value === "string" ) {
				this.props.xAxes = JSON.parse(value);
			}
			this.construct();
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
			return this._shadowRoot.getElementById("points").value;
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
			this.constructSegmentHtml();
			this.constructNodeHTML();
		}

		constructContainer() {
			this.container?.parentNode.removeChild(this.container);
			this.container = document.createElement("div");
            this._shadowRoot.appendChild(this.container);
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

		constructNodeHTML() {
			this.props.points.forEach((item,i) => {
				const section = document.createElement("div");
				section.style.display = "flex";
				section.style.alignItems = "center"

				const inputContainer = document.createElement("div");
				inputContainer.style.display = "flex";
				inputContainer.style.flexDirection = "column";
				inputContainer.style.width = "100%";

				const el = document.createElement("input");
				el.type = "text";

				const lbl = document.createElement("label");
				lbl.innerHTML = "Reference points of " + xAxes[i];
				lbl.style.marginTop = "16px";

				const del = document.createElement("button");
				del.innerHTML = "delete";
				del.style.marginTop = "auto";
				del.style.marginLeft = "16px";
				del.addEventListener("click", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					if (i > -1) {
						newProps.points.splice(i, 1);
					}
					this.changeProps(newProps);
				});
				
				this.container.appendChild(section);
				section.appendChild(inputContainer);
				section.appendChild(del);
				inputContainer.appendChild(lbl);
				inputContainer.appendChild(el);
				el.value = points[i];
				el.addEventListener("change", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					// maybe need to parse from string to array
					newProps.points[i] = event.path[0].value;
					this.changeProps(newProps);
				});


			});

			const add = document.createElement("button");
			add.innerHTML = "add";
			add.style.display = "block";
			add.style.margin = "16px auto";
			this.container.appendChild(add);

			const hr = document.createElement("hr");
			this.container.appendChild(hr);

			// points will not be created on their own
			// add.addEventListener("click", event => {
			// 	const newProps = JSON.parse(JSON.stringify(this.props));
			// 	newProps.points.push({"label": "new segment"});
			// 	this.changeProps(newProps);
			// });
        }

		constructSegmentHtml() {
			this.props.values.forEach((item,i) => {
				const section = document.createElement("div");
				section.style.display = "flex";
				section.style.alignItems = "center"

				const inputContainer = document.createElement("div");
				inputContainer.style.display = "flex";
				inputContainer.style.flexDirection = "column";

				const el = document.createElement("input");
				el.type = "text";
				el.style.maxWidth = "80px";

				const lbl = document.createElement("label");
				lbl.innerHTML = "Values of " + xAxes[i];
				lbl.style.marginTop = "16px";

				const del = document.createElement("button");
				del.innerHTML = "delete";
				del.style.marginTop = "auto";
				del.style.marginLeft = "16px";
				del.addEventListener("click", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					if (i > -1) {
						newProps.values.splice(i, 1);
					}
					this.changeProps(newProps);
				});
				
				this.container.appendChild(section);
				section.appendChild(inputContainer);
				section.appendChild(del);
				inputContainer.appendChild(lbl);
				inputContainer.appendChild(el);
				el.value = item;
				el.addEventListener("change", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					// maybe need to parse from string to array
					newProps.values[i] = event.path[0].value;
					this.changeProps(newProps);
				});
			});

			const add = document.createElement("button");
			add.innerHTML = "add";
			add.style.display = "block";
			add.style.margin = "16px auto";
			this.container.appendChild(add);
			add.addEventListener("click", event => {
				const newProps = JSON.parse(JSON.stringify(this.props));
				if (!newProps.values) {
					newProps.values = []
				}
				const newValues = [];
				const newPoints = [];
				newProps.values.push(newValues);
				newProps.points.push(newPoints);
				this.changeProps(newProps);
			});
		}

	}

    customElements.define("boxplot-builder", BoxPlot_Builder);
})();
