//const { Regex } = require('@companion-module/base')
const { SOM, cmd, cmdParam } = require('./consts.js')

module.exports = function (self) {
	self.setActionDefinitions({
		connect: {
			name: 'Connect',
			description: 'Connect a crosspoint',
			options: [
				{
					type: 'dropdown',
					id: 'dst',
					label: 'Destination',
					choices: self.destinations,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer',
				},
				{
					type: 'dropdown',
					id: 'src',
					label: 'Source',
					choices: self.sources,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer',
				},
			],
			callback: async ({ options }) => {
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				let src = parseInt(await self.parseVariablesInString(options.src))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst || isNaN(src) || src < 1 || src > self.config.src) {
					self.log('warn', `an invalid varible has been passed: dst: ${dst} src: ${src}`)
					return undefined
				}
				dst = self.calcDivMod(dst - 1)
				src = self.calcDivMod(src - 1)
				self.log(
					'debug',
					`som: ${SOM} cmd: ${cmd.connect} multiplier: ${dst[0] * 16 + src[0]} dst: ${dst[1]} src: ${
						src[1]
					} checksum: ${self.calcCheckSum([cmd.connect, dst[0] * 16 + src[0], dst[1], src[1]])}`
				)
				self.addCmdtoQueue([
					SOM,
					cmd.connect,
					dst[0] * 16 + src[0],
					dst[1],
					src[1],
					self.calcCheckSum([cmd.connect, dst[0] * 16 + src[0], dst[1], src[1]]),
				])
			},
			subscribe: async ({ options }) => {
				//add cmd to interrogate destination
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst) {
					self.log('warn', `an invalid varible has been passed: ${dst}`)
					return undefined
				}
				dst = self.calcDivMod(dst - 1)
				let multiplier = dst[0] * 16
				self.log(
					'debug',
					`som: ${SOM} cmd: ${cmd.interrogate} multiplier: ${multiplier} dst: ${dst[1]} checksum: ${self.calcCheckSum([
						cmd.interrogate,
						multiplier,
						dst[1],
					])}`
				)
				self.addCmdtoQueue([
					SOM,
					cmd.interrogate,
					multiplier,
					dst[1],
					self.calcCheckSum([cmd.interrogate, multiplier, dst[1]]),
				])
			},
			learn: async (action) => {
				let dst = parseInt(await self.parseVariablesInString(action.options.dst))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst) {
					self.log('warn', `an invalid varible has been passed: ${dst}`)
					return undefined
				}
				dst = self.calcDivMod(dst - 1)
				self.log(
					'debug',
					`som: ${SOM} cmd: ${cmd.interrogate} multiplier: ${dst[0] * 16} dst: ${dst[1]} checksum: ${self.calcCheckSum([
						cmd.interrogate,
						dst[0] * 16,
						dst[1],
					])}`
				)
				self.addCmdtoQueue([
					SOM,
					cmd.interrogate,
					dst[0] * 16,
					dst[1],
					self.calcCheckSum([cmd.interrogate, dst[0] * 16, dst[1]]),
				])
				const source = self.connections[dst]
				return {
					...action.options,
					src: source,
				}
			},
		},
		interrogate: {
			name: 'Interrogate',
			description: 'Interrogate a destination',
			options: [
				{
					type: 'dropdown',
					id: 'dst',
					label: 'Destination',
					choices: self.destinations,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer',
				},
			],
			callback: async ({ options }) => {
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst) {
					self.log('warn', `an invalid varible has been passed: dst: ${dst}}`)
					return undefined
				}
				dst = self.calcDivMod(dst - 1)
				self.addCmdtoQueue([
					SOM,
					cmd.connect,
					dst[0] * 16,
					dst[1],
					self.calcCheckSum([cmd.interrogate, dst[0] * 16, dst[1]]),
				])
			},
			subscribe: async ({ options }) => {
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst) {
					self.log('warn', `an invalid varible has been passed: ${dst}`)
					return undefined
				}
				dst = self.calcDivMod(dst - 1)
				self.addCmdtoQueue([
					SOM,
					cmd.interrogate,
					dst[0] * 16,
					dst[1],
					self.calcCheckSum([cmd.interrogate, dst[0] * 16, dst[1]]),
				])
			},
		},
		connectOnGo: {
			name: 'Connect on Go',
			description: 'Prepare a crosspoint',
			options: [
				{
					type: 'dropdown',
					id: 'dst',
					label: 'Destination',
					choices: self.destinations,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer',
				},
				{
					type: 'dropdown',
					id: 'src',
					label: 'Source',
					choices: self.sources,
					default: 1,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer',
				},
			],
			callback: async ({ options }) => {
				let dst = parseInt(await self.parseVariablesInString(options.dst))
				let src = parseInt(await self.parseVariablesInString(options.src))
				if (isNaN(dst) || dst < 1 || dst > self.config.dst || isNaN(src) || src < 1 || src > self.config.src) {
					self.log('warn', `an invalid varible has been passed: dst: ${dst} src: ${src}`)
					return undefined
				}
				dst = self.calcDivMod(dst - 1)
				src = self.calcDivMod(src - 1)
				self.log(
					'debug',
					`som: ${SOM} cmd: ${cmd.connectOnGo} multiplier: ${dst[0] * 16 + src[0]} dst: ${dst[1]} src: ${
						src[1]
					} checksum: ${self.calcCheckSum([cmd.connectOnGo, dst[0] * 16 + src[0], dst[1], src[1]])}`
				)
				self.addCmdtoQueue([
					SOM,
					cmd.connectOnGo,
					dst[0] * 16 + src[0],
					dst[1],
					src[1],
					self.calcCheckSum([cmd.connectOnGo, dst[0] * 16 + src[0], dst[1], src[1]]),
				])
			},
		},
		goSetClear: {
			name: 'Go',
			description: 'Set or clear prepared crosspoints',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.go_mode,
					default: cmdParam.go.set,
				},
			],
			callback: async ({ options }) => {
				self.log(
					'debug',
					`som: ${SOM} cmd: ${cmd.go} action: ${options.mode} checksum: ${self.calcCheckSum([cmd.go, options.mode])}`
				)
				self.addCmdtoQueue([SOM, cmd.go, options.mode, self.calcCheckSum([cmd.go, options.mode])])
			},
		},
	})
}
