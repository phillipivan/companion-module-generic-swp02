const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades.js')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const config = require('./config.js')
const choices = require('./choices.js')
const tcp = require('./tcp.js')
const processCmd = require('./processcmd.js')
const util = require('./util.js')
const { msgDelay } = require('./consts.js')

class SW_P_02 extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...tcp, ...processCmd, ...choices, ...util })
		this.keepAliveTimer = {}
		this.cmdTimer = {}
		this.cmdQueue = []
		this.clearToTx = true
	}
	async init(config) {
		this.updateStatus('Starting')
		this.config = config
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay)
		this.initVariables()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateVariableValues()
		this.initTCP()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', `destroy. ID: ${this.id}`)
		clearTimeout(this.keepAliveTimer)
		clearTimeout(this.cmdTimer)
		this.keepAliveTimer = null
		this.cmdTimer = null
		if (this.socket) {
			this.socket.destroy()
		}
		this.updateStatus(InstanceStatus.Disconnected)
	}

	updateVariableValues() {
		let varList = []
		for (let i = 1; i <= this.config.dst; i++) {
			varList[`dst${i}`] = this.connections[i]
		}
		this.setVariableValues(varList)
	}

	initVariables() {
		this.sources = []
		this.destinations = []
		this.connections = []
		for (let i = 1; i <= this.config.src; i++) {
			this.sources.push({ id: i, label: `Source ${i}` })
		}
		for (let i = 1; i <= this.config.dst; i++) {
			this.destinations.push({ id: i, label: `Destination ${i}` })
			this.connections[i] = 'unknown'
		}
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(SW_P_02, UpgradeScripts)
