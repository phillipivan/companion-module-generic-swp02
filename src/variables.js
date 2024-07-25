export default async function (self) {
	let varList = []
	for (let i = 1; i <= self.config.dst; i++) {
		varList.push({ variableId: `dst${i}`, name: `Destination ${i}` })
	}
	await self.setVariableDefinitions(varList)
}
