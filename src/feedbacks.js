import { combineRgb } from '@companion-module/base'
import { SOM, cmd } from './consts.js'

export default async function (self) {
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
					allowCustom: true,
				},
				{
					id: 'src',
					type: 'dropdown',
					label: 'Source',
					default: 1,
					choices: self.sources,
					allowCustom: true,
				},
			],
			callback: async (feedback, context) => {
				const src = parseInt(await context.parseVariablesInString(feedback.options.src))
				const dst = parseInt(await context.parseVariablesInString(feedback.options.dst))
				if (isNaN(dst) || dst < 1 || dst > 1024) {
					self.log('warn', `invalid dest provided ${dst} from ${feedback.options.dst}`)
					return undefined
				}
				return self.connections[dst] === src
			},
			subscribe: async (feedback, context) => {
				const dest = parseInt(await context.parseVariablesInString(feedback.options.dst))
				if (isNaN(dest) || dest < 1 || dest > 1024) {
					self.log('warn', `invalid dest provided ${dest} from ${feedback.options.dst}`)
					return undefined
				}
				const dst = self.calcDivMod(dest)
				const multiplier = dst[0] * 16
				self.addCmdtoQueue([
					SOM,
					cmd.interrogate,
					multiplier,
					dst[1],
					self.calcCheckSum([cmd.interrogate, multiplier, dst[1]]),
				])
			},
			learn: async (feedback, context) => {
				const dst = parseInt(await context.parseVariablesInString(feedback.options.dst))
				if (isNaN(dst) || dst < 1 || dst > 1024) {
					self.log('warn', `invalid dest provided ${dst} from ${feedback.options.dst}`)
					return undefined
				}
				const source = self.connections[dst]
				return {
					...feedback.options,
					src: source,
				}
			},
		},
	})
}
