const { Regex } = require('@companion-module/base')

module.exports = {
	async configUpdated(config) {
		//let oldConfig = this.config
		this.config = config
		this.initVariables()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updateVariableValues()
		this.initTCP()
	},
	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP',
				width: 12,
				regex: Regex.HOSTNAME,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 6,
				regex: Regex.PORT,
				default: 2000,
				tooltip: 'Default TCP:2000',
			},
			{
				type: 'number',
				id: 'src',
				label: 'Source Count',
				width: 4,
				default: 128,
				min: 1,
				max: 1024,
				range: true,
				step: 1,
			},
			{
				type: 'number',
				id: 'dst',
				label: 'Destination Count',
				width: 4,
				default: 128,
				min: 1,
				max: 1024,
				range: true,
				step: 1,
			},
			{
				type: 'checkbox',
				id: 'interrogate',
				label: 'Interrogate on connect',
				width: 4,
				default: true,
				tooltip: 'Interrogate all destinations on connect',
			},
		]
	},
}
