import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import * as config from './config.js'
import * as choices from './choices.js'
import * as tcp from './tcp.js'
import * as processCmd from './processcmd.js'
import * as util from './util.js'
import { msgDelay } from './consts.js'

class SW_P_02 extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...tcp, ...processCmd, ...choices, ...util })
		this.keepAliveTimer = {}
		this.cmdTimer = {}
		this.timeOutTimer = {}
		this.cmdQueue = []
		this.clearToTx = true
	}
	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
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
		this.stopTimeOut()
		this.timeOutTimer = null
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

	// Track whether actions are being recorded
	handleStartStopRecordActions(isRecording) {
		this.isRecordingActions = isRecording
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
