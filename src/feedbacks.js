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
				const src = await context.parseVariablesInString(feedback.options.src)
				const dst = await context.parseVariablesInString(feedback.options.dst)
				return self.connections[dst] === src
			},
			subscribe: async (feedback, context) => {
				const dst = self.calcDivMod(await context.parseVariablesInString(feedback.options.dst))
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
				const source = self.connections[await context.parseVariablesInString(feedback.options.dst)]
				return {
					...feedback.options,
					src: source,
				}
			},
		},
	})
}
