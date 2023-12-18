const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { msgDelay, SOM, cmd, keepAliveInterval, keepAliveMsg } = require('./consts.js')

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
		if (msg !== undefined && Array.isArray(msg)) {
			this.log('debug', `message: ${msg.toString()}`)
			let buffer = new Uint8Array(msg.length)
			for (let i = 0; i < msg.length; i++) {
				buffer[i] = msg[i]
			}
			let cmd = Buffer.from(buffer)
			if (this.socket !== undefined && this.socket.isConnected) {
				this.socket.send(cmd)
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
		this.addCmdtoQueue(keepAliveMsg)
		this.keepAliveTimer = setTimeout(() => {
			this.keepAlive()
		}, keepAliveInterval)
	},

	initTCP() {
		this.receiveBuffer = ''
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
				let i = 0,
					line = '',
					offset = 0
				this.receiveBuffer += chunk
				this.log('debug', `chunk recieved: ${chunk}`)
				while ((i = this.receiveBuffer.indexOf(SOM, offset)) !== -1) {
					// needs work
					line = this.receiveBuffer.substr(offset, i - offset)
					offset = i + 2
					this.processCmd(line)
				}
				this.receiveBuffer = this.receiveBuffer.substr(offset)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	},
}
