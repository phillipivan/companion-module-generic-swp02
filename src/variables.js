module.exports = async function (self) {
	let varList = []
	for (let i = 1; i <= this.config.dst; i++) {
		varList.push({ variableId: `dst${i}`, name: `Destination ${i}` })
	}
	self.setVariableDefinitions(varList)
}
