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
			this.construct();
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

		get values() {
			return this._shadowRoot.getElementById("values").value;
		}

		get points() {
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
			const boxplot = this._shadowRoot.querySelector(".boxplot-main");
			if(boxplot.chart) {
				boxplot.rebuildPlot();
			}
			// this.constructSegmentHtml();
			// this.constructNodeHTML();
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

		constructSegmentHtml() {
			this.props.segmentList.forEach((item,i) => {
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
				lbl.innerHTML = "segment name";
				lbl.style.marginTop = "16px";

				const del = document.createElement("button");
				del.innerHTML = "delete";
				del.style.marginTop = "auto";
				del.style.marginLeft = "16px";
				del.addEventListener("click", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					if (i > -1) {
						newProps.segmentList.splice(i, 1);
					}
					this.changeProps(newProps);
				});
				
				this.container.appendChild(section);
				section.appendChild(inputContainer);
				section.appendChild(del);
				inputContainer.appendChild(lbl);
				inputContainer.appendChild(el);
				el.value = item.label;
				el.addEventListener("change", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					newProps.segmentList[i] = {"label": event.path[0].value};
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

			add.addEventListener("click", event => {
				const newProps = JSON.parse(JSON.stringify(this.props));
				newProps.segmentList.push({"label": "new segment"});
				this.changeProps(newProps);
			});
        }

		constructNodeHTML() {
			this.props.nodeList?.forEach((item,i) => {
				const section = document.createElement("div");
				section.style.display = "flex";
				section.style.alignItems = "center"

				const inputContainer = document.createElement("div");
				inputContainer.style.display = "flex";
				inputContainer.style.flexDirection = "column";

				const el = document.createElement("input");
				el.type = "text";
				el.style.maxWidth = "80px";

				const positionXContainer = document.createElement("div");
				positionXContainer.style.display = "flex";
				positionXContainer.style.flexDirection = "column";

				const positionX = document.createElement("input");
				positionX.style.maxWidth = "40px";
				positionX.type = "number";

				positionX.value = item.x;
				positionX.addEventListener("change", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					newProps.nodeList[i].x = event.path[0].value;
					this.changeProps(newProps);
				});

				const positionX_lbl = document.createElement("label");
				positionX_lbl.innerHTML = "x";
				positionX_lbl.style.marginTop = "16px";

				positionXContainer.appendChild(positionX_lbl);
				positionXContainer.appendChild(positionX);

				const positionYContainer = document.createElement("div");
				positionYContainer.style.display = "flex";
				positionYContainer.style.flexDirection = "column";

				const positionY = document.createElement("input");
				positionY.style.maxWidth = "40px";
				positionY.type = "number";

				positionY.value = item.y;
				positionY.addEventListener("change", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					newProps.nodeList[i].y = event.path[0].value;
					this.changeProps(newProps);
				});

				const positionY_lbl = document.createElement("label");
				positionY_lbl.innerHTML = "y";
				positionY_lbl.style.marginTop = "16px";

				positionYContainer.appendChild(positionY_lbl);
				positionYContainer.appendChild(positionY);

				const lbl = document.createElement("label");
				lbl.innerHTML = "node name";
				lbl.style.marginTop = "16px";

				const del = document.createElement("button");
				del.innerHTML = "delete";
				del.style.marginTop = "auto";
				del.style.marginLeft = "16px";
				del.addEventListener("click", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					if (i > -1) {
						newProps.nodeList.splice(i, 1);
					}
					this.changeProps(newProps);
				});
				
				this.container.appendChild(section);
				section.appendChild(inputContainer);
				section.appendChild(positionXContainer);
				section.appendChild(positionYContainer);
				section.appendChild(del);
				inputContainer.appendChild(lbl);
				inputContainer.appendChild(el);
				el.value = item.label;
				el.addEventListener("change", event => {
					const newProps = JSON.parse(JSON.stringify(this.props));
					newProps.nodeList[i].label = event.path[0].value;
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
				if (!newProps.nodeList) {
					newProps.nodeList = []
				}
				const newNode = {
					label: "label",
					x: 500,
					y: 500,
					id: `radar-node-${newProps.nodeList.length}`
				}
				newProps.nodeList.push(newNode);
				this.changeProps(newProps);
			});
		}

	}

    customElements.define("boxplot-builder", BoxPlot_Builder);
})();
