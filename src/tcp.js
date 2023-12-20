const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { msgDelay, SOM, cmd, cmdParam, keepAliveInterval } = require('./consts.js')

module.exports = {
	async addCmdtoQueue(msg) {
		if (msg !== undefined && Array.isArray(msg)) {
			await this.cmdQueue.push(msg)
			return true
		}
		this.log('warn', `Invalid command: ${msg}`)
		return false
	},

	async processCmdQueue() {
		if (this.cmdQueue.length > 0) {
			this.sendCommand(await this.cmdQueue.splice(0, 1))
		}
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay)
	},

	async sendCommand(msg) {
		msg = msg.toString().split(',')
		if (msg !== undefined && Array.isArray(msg)) {
			//this.log('debug', `message: ${msg.toString()} message length: ${msg.length}`)
			let buffer = new Uint8Array(msg.length)
			for (let i = 0; i < msg.length; i++) {
				buffer[i] = msg[i]
			}
			if (this.socket !== undefined && this.socket.isConnected) {
				this.socket.send(buffer)
				return true
			} else {
				this.log('warn', `Socket not connected, tried to send: ${cmd.toString()}`)
			}
		} else {
			this.log('warn', 'Command undefined')
		}
		return false
	},

	//queries made on initial connection.
	async queryOnConnect() {
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
				let dst = this.calcDivMod(i - 1)
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
		this.addCmdtoQueue([SOM, cmd.databaseChecksum, cmdParam.databaseChecksum.requestChecksum, this.calcCheckSum([cmd.databaseChecksum, cmdParam.databaseChecksum.requestChecksum])])
		this.keepAliveTimer = setTimeout(() => {
			this.keepAlive()
		}, keepAliveInterval)
	},

	initTCP() {
		//this.receiveBuffer = ''
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
				clearTimeout(this.keepAliveTimer)
			})
			this.socket.on('connect', () => {
				this.log('info', `Connected to ${this.config.host}:${this.config.port}`)
				this.queryOnConnect()
				this.keepAliveTimer = setTimeout(() => {
					this.keepAlive()
				}, keepAliveInterval)
			})
			this.socket.on('data', (chunk) => {
/* 				if (Buffer.compare(chunk, this.receiveBuffer) != 0) {
					this.log('debug', `data recieved: ${chunk}`)
					//this.processCmdQueue(chunk)
					this.receiveBuffer = chunk
				} */
				let i = 0,
					offset = 0
				let receiveBuffer = Buffer.from(chunk)
				this.log('debug', `chunk recieved: ${receiveBuffer}`)
				while ((i = receiveBuffer.indexOf(SOM, offset)) !== -1) {
					this.log('debug', 'found SOM')
					let nextSOM = receiveBuffer.indexOf(SOM, offset) == -1 ? receiveBuffer.length - 1 : receiveBuffer.indexOf(SOM, offset)
					let line = Buffer.alloc(nextSOM - offset)
					for (let j = 0; j < line.length; j++) {
						line[j] = receiveBuffer[j + offset]
					}
					offset = i + 1
					this.processCmd(line)
				}
				receiveBuffer = this.receiveBuffer.substr(offset)
				if (receiveBuffer[0] == SOM) {
					this.log('debug', 'found another SOM')
					this.processCmd(receiveBuffer)
					receiveBuffer = null
				}
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	},
}
