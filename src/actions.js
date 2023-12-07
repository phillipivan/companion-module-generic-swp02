//const { Regex } = require('@companion-module/base')
const { SOM, cmd } = require('./consts.js')

module.exports = function (self) {
	self.setActionDefinitions({
		connect: {
			name: 'Connect',
			description: 'Connect',
			options: [
				{
					type: 'dropdown',
					id: 'dst',
					label: 'Destination',
					choices: self.destinations,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					type: 'dropdown',
					id: 'src',
					label: 'Source',
					choices: self.sources,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
			],
			callback: async ({ options }) => {
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				let src = parseInt(await self.parseVariablesInString(options.src))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst || isNaN(src) || src < 0 || src > self.config.src) {
					self.log('warn', `an invalid varible has been passed: dst: ${dst} src: ${src}`)
					return undefined
				}
				//send connect command
			},
			subscribe: async ({ options }) => {
				//add cmd to interrogate destination
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst) {
					self.log('warn', `an invalid varible has been passed: ${dst}`)
					return undefined
				}
			},
			learn: async (action) => {
				let dst = parseInt(await self.parseVariablesInString(action.options.dst))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst) {
					self.log('warn', `an invalid varible has been passed: ${dst}`)
					return undefined
				}
				const source = self.connections[dst]
				return {
					...action.options,
					src: source,
				}
			},
		},
	})
}
