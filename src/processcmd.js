const { cmd, msgLength, cmdParam } = require('./consts.js')

module.exports = {
	processCmd(chunk) {
		let reply = new Uint8Array(chunk)
		this.log('debug', `response recieved: ${reply.toString()}`)
		let reference = []
		for (let i = 0; i < reply.length - 1; i++) {
			reference[i] = reply[i]
		}
		let refCheckSum = this.calcCheckSum(reference)
		if (refCheckSum != reply[reply.length - 1]) {
			this.log('warn', `invalid checksum returned. expected: ${refCheckSum} recieved: ${reply[reply.length - 1]}`)
			return undefined
		}
		switch (reply[0]) {
			case cmd.interrogate:
				if (reply.length != msgLength.interrogate) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.interrogate} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned an interrogate')
				break
			case cmd.connect:
				if (reply.length != msgLength.connect) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.connect} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a connect')
				break
			case cmd.tally:
			case cmd.connected:
				if (reply.length != msgLength.connected) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.connected} Recieved: ${reply.length}`)
					return undefined
				}
				break
			case cmd.connectOnGo:
				if (reply.length != msgLength.connectOnGo) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.connectOnGo} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a connect on go')
				break
			case cmd.go:
				if (reply.length != msgLength.go) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.go} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a go')
				break
			case cmd.statusRequest:
				if (reply.length != msgLength.statusRequest) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.statusRequest} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a status request')
				break
			case cmd.statusResponse1:
				if (reply.length != msgLength.statusResponse1) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.statusResponse1} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('info', `Status Response 1: ${reply}`)
				break
			case cmd.statusResponse2:
				if (reply.length != msgLength.statusResponse2) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.statusResponse2} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('info', `Status Response 2: ${reply}`)
				break
			case cmd.statusResponse3:
				if (reply.length != msgLength.statusResponse3) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.statusResponse3} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('info', `Status Response 3: ${reply}`)
				break
			case cmd.connectOnGoAck:
				if (reply.length != msgLength.interrconnectOnGoAckogate) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.connectOnGoAck} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('info', `Connect On go Ack`)
				break
			case cmd.goDoneAck:
				if (reply.length != msgLength.goDoneAck) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.goDoneAck} Recieved: ${reply.length}`)
					return undefined
				}
				switch (reply[1]) {
					case cmdParam.goDoneAck.set:
						this.log('info', `Connect Done Ack: Set`)
						break
					case cmdParam.goDoneAck.clear:
						this.log('info', `Connect Done Ack: Clear`)
						break
					case cmdParam.goDoneAck.none:
						this.log('info', `Connect Done Ack: No points prepared`)
						break
					default:
						this.log('warn', `Connect Done Ack: unexpected param: ${reply[1]}`)
				}
				break
			case cmd.extendedInterrogate:
				if (reply.length != msgLength.extendedInterrogate) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.extendedInterrogate} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a extendedInterrogate')
				break
			case cmd.extendedConnect:
				if (reply.length != msgLength.extendedConnect) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.extendedConnect} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a extendedConnect')
				break
			case cmd.extendedTally:
			case cmd.extendedConnected:
				if (reply.length != msgLength.extendedConnected) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.extendedConnected} Recieved: ${reply.length}`)
					return undefined
				}
				this.log(
					'warn',
					'unit unexpectedly returned a extendedTally/extendedConnected. this module does not handle extended commands'
				)
				break
			case cmd.extendedConnectOnGo:
				if (reply.length != msgLength.extendedConnectOnGo) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.extendedConnectOnGo} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('warn', 'unit unexpectedly returned a extendedConnectOnGo')
				break
			case cmd.extendedConnectOnGoAck:
				if (reply.length != msgLength.extendedConnectOnGoAck) {
					this.log('warn', `Unexpected Length. Expected: ${msgLength.extendedConnectOnGoAck} Recieved: ${reply.length}`)
					return undefined
				}
				this.log('info', `Extended Connect on Go Ack`)
				break
			case cmd.routerConfigurationRequest:
				if (reply.length != msgLength.routerConfigurationRequest) {
					this.log(
						'warn',
						`Unexpected Length. Expected: ${msgLength.routerConfigurationRequest} Recieved: ${reply.length}`
					)
					return undefined
				}
				this.log('info', `Router Configuration Request: ${reply}`)
				break
			case cmd.routerConfigurationResponse1:
				if (reply.length != msgLength.routerConfigurationResponse1) {
					this.log(
						'warn',
						`Unexpected Length. Expected: ${msgLength.routerConfigurationResponse1} Recieved: ${reply.length}`
					)
					return undefined
				}
				this.log('info', `Router Configuration Response 1: ${reply}`)
				break
			case cmd.routerConfigurationResponse2:
				if (reply.length != msgLength.routerConfigurationResponse2) {
					this.log(
						'warn',
						`Unexpected Length. Expected: ${msgLength.routerConfigurationResponse2} Recieved: ${reply.length}`
					)
					return undefined
				}
				this.log('info', `Router Configuration Response 2: ${reply}`)
				break
			default:
				this.log('warn', `Unexpected response from unit: ${reply.toString()}`)
		}
	},
}
