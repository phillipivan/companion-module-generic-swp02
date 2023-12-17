const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		checkCrosspoint: {
			name: 'Crosspoint',
			type: 'boolean',
			label: 'Crosspoint',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'dst',
					type: 'dropdown',
					label: 'Destination',
					default: 1,
					choices: self.destinations,
				},
				{
					id: 'src',
					type: 'dropdown',
					label: 'Source',
					default: 1,
					choices: self.sources,
				},
			],
			callback: ({ options }) => {
				return self.connections[options.dst] == options.src
			},
			subscribe: async () => {
				//add cmd to interrogate destination
				//self.addCmdtoQueue(cmd)
			},
			learn: async (feedback) => {
				const source = self.connections[feedback.options.dst]
				return {
					...feedback.options,
					src: source,
				}
			},
		},
	})
}
