import { InstanceStatus, TCPHelper } from '@companion-module/base'
import { msgDelay, SOM, cmd, cmdParam, keepAliveInterval, timeOutInterval } from './consts.js'

export function addCmdtoQueue(msg) {
	if (msg !== undefined && Array.isArray(msg)) {
		this.cmdQueue.push(msg)
		return true
	}
	this.log('warn', `Invalid command: ${msg}`)
	return false
}

export function processCmdQueue() {
	if (this.cmdQueue.length > 0 && !(this.waitOnAck && !this.clearToTx)) {
		this.sendCommand(this.cmdQueue.splice(0, 1))
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay)
		return true
	}
	this.cmdTimer = setTimeout(() => {
		this.processCmdQueue()
	}, msgDelay / 2)
	return false
}

export function timeOut() {
	this.clearToTx = true
}

export function startTimeOut() {
	this.clearToTx = false
	this.timeOutTimer = setTimeout(() => {
		this.timeOut()
	}, timeOutInterval)
}

export function stopTimeOut() {
	this.clearToTx = true
	clearTimeout(this.timeOutTimer)
}

export function sendCommand(msg) {
	msg = msg.toString().split(',')
	if (msg !== undefined && Array.isArray(msg)) {
		this.log('debug', `sending message: ${msg.toString()} message length: ${msg.length}`)
		let buffer = Buffer.from(msg)
		if (this.socket !== undefined && this.socket.isConnected) {
			this.startTimeOut()
			this.socket.send(buffer)
			return true
		} else {
			this.log('warn', `Socket not connected, tried to send: ${buffer}`)
		}
	} else {
		this.log('warn', `Invalid command: ${msg.toString()}`)
	}
	return false
}

//queries made on initial connection.
export function queryOnConnect() {
	//the queries probel general switcher makes upon connecting
	this.addCmdtoQueue([
		SOM,
		cmd.databaseChecksum,
		cmdParam.databaseChecksum.requestChecksum,
		this.calcCheckSum([cmd.databaseChecksum, cmdParam.databaseChecksum.requestChecksum]),
	])
	this.addCmdtoQueue([SOM, cmd.dualControllerStatusRequest, this.calcCheckSum([cmd.dualControllerStatusRequest])])
	this.addCmdtoQueue([SOM, cmd.routerConfigurationRequest, this.calcCheckSum([cmd.routerConfigurationRequest])])
	if (this.config.interrogate) {
		//interrogate all destinations
		for (let i = 1; i <= this.config.dst; i++) {
			let dst = this.calcDivMod(i)
			this.addCmdtoQueue([
				SOM,
				cmd.interrogate,
				dst[0] * 16,
				dst[1],
				this.calcCheckSum([cmd.interrogate, dst[0] * 16, dst[1]]),
			])
		}
	}
}

export function keepAlive() {
	this.addCmdtoQueue([
		SOM,
		cmd.databaseChecksum,
		cmdParam.databaseChecksum.requestChecksum,
		this.calcCheckSum([cmd.databaseChecksum, cmdParam.databaseChecksum.requestChecksum]),
	])
	this.keepAliveTimer = setTimeout(() => {
		this.keepAlive()
	}, keepAliveInterval)
}

export function initTCP() {
	let receiveBuffer = Buffer.from('')
	if (this.socket !== undefined) {
		this.socket.destroy()
		delete this.socket
	}
	if (this.config.host) {
		this.log('debug', 'Creating New Socket')

		this.updateStatus(InstanceStatus.Connecting, `Connecting to Router: ${this.config.host}:${this.config.port}`)
		this.socket = new TCPHelper(this.config.host, this.config.port)

		this.socket.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})
		this.socket.on('error', (err) => {
			this.log('error', `Network error: ${err.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.stopTimeOut()
			clearTimeout(this.keepAliveTimer)
		})
		this.socket.on('connect', () => {
			this.log('info', `Connected to ${this.config.host}:${this.config.port}`)
			this.updateStatus(InstanceStatus.Ok, `Connected to ${this.config.host}`)
			receiveBuffer = Buffer.from('')
			this.stopTimeOut()
			this.queryOnConnect()
			this.keepAliveTimer = setTimeout(() => {
				this.keepAlive()
			}, keepAliveInterval)
		})
		this.socket.on('data', (chunk) => {
			this.stopTimeOut()
			//this.log('debug', `chunk recieved: ${chunk}`)
			receiveBuffer = Buffer.from(chunk)
			let i = 0,
				offset = 0
			while ((i = receiveBuffer.indexOf(SOM, offset)) !== -1) {
				let nextSOM =
					receiveBuffer.indexOf(SOM, offset + 1) == -1
						? receiveBuffer.length - 1
						: receiveBuffer.indexOf(SOM, offset + 1)
				let line = Buffer.alloc(nextSOM - offset + 1)
				for (let j = 0; j < line.length; j++) {
					line[j] = receiveBuffer[j + offset]
				}
				offset = i + 1
				this.processCmd(line)
			}
			//receiveBuffer = Buffer.from('')
			//receiveBuffer = receiveBuffer.subarray(offset)
		})
	} else {
		this.updateStatus(InstanceStatus.BadConfig)
	}
}
