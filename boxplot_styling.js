(function() {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Custom Widget Text</legend>
				<table>
					<tr>
						<td>Box Plot Color:</td>
						<td><input id="boxColor" type="color"></td>
					</tr>
				</table>
			</fieldset>
		</form>
	`;

	class BoxPlot_Styling extends HTMLElement {
		  constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							boxColor: this.boxColor
						}
					}
			}));
		}

		set boxColor(color) {
			this._shadowRoot.getElementById("boxColor").value = color;
		}

		get boxColor() {
			return this._shadowRoot.getElementById("boxColor").value;
		}
	}

customElements.define("boxplot-styling", BoxPlot_Styling);
})();
