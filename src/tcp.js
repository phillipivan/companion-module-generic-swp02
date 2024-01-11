const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { msgDelay, SOM, cmd, cmdParam, keepAliveInterval, timeOutInterval } = require('./consts.js')

module.exports = {
	addCmdtoQueue(msg) {
		if (msg !== undefined && Array.isArray(msg)) {
			this.cmdQueue.push(msg)
			return true
		}
		this.log('warn', `Invalid command: ${msg}`)
		return false
	},

	processCmdQueue() {
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
	},

	timeOut() {
		this.clearToTx = true
	},

	startTimeOut() {
		this.clearToTx = false
		this.timeOutTimer = setTimeout(() => {
			this.timeOut()
		}, timeOutInterval)
	},

	stopTimeOut() {
		this.clearToTx = true
		clearTimeout(this.timeOutTimer)
	},

	sendCommand(msg) {
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
	},

	//queries made on initial connection.
	queryOnConnect() {
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
	},

	keepAlive() {
		this.addCmdtoQueue([
			SOM,
			cmd.databaseChecksum,
			cmdParam.databaseChecksum.requestChecksum,
			this.calcCheckSum([cmd.databaseChecksum, cmdParam.databaseChecksum.requestChecksum]),
		])
		this.keepAliveTimer = setTimeout(() => {
			this.keepAlive()
		}, keepAliveInterval)
	},

	initTCP() {
		let receiveBuffer = Buffer.from('')
		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}
		if (this.config.host) {
			this.log('debug', 'Creating New Socket')

			this.updateStatus(`Connecting to Router: ${this.config.host}:${this.config.port}`)
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
			this.socket.on('error', (err) => {
				this.log('error', `Network error: ${err.message}`)
				this.stopTimeOut()
				clearTimeout(this.keepAliveTimer)
			})
			this.socket.on('connect', () => {
				this.log('info', `Connected to ${this.config.host}:${this.config.port}`)
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
	},
}
