const { cmdParam } = require('./consts.js')

module.exports = {
	go_mode: [
		{ id: cmdParam.go.set, label: 'Set' },
		{ id: cmdParam.go.clear, label: 'Clear' },
	],
}
