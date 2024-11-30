import { cmd, msgLength, cmdParam, extendedCommandSet, SOM } from './consts.js'

export function processCmd(chunk) {
	const msg = new Uint8Array(chunk)
	const reply = msg[0] == SOM ? msg.subarray(1) : msg
	//this.log('debug', `response recieved: ${reply} reply length: ${reply.length}`)
	let reference = []
	for (let i = 0; i < reply.length - 1; i++) {
		reference[i] = reply[i]
	}
	const refCheckSum = this.calcCheckSum(reference)
	if (refCheckSum != reply[reply.length - 1]) {
		this.log('warn', `invalid checksum returned. expected: ${refCheckSum} recieved: ${reply[reply.length - 1]}`)
		return undefined
	}
	let dstSrc = []
	let varList = []
	switch (reply[0]) {
		case cmd.databaseChecksum:
			this.log('info', `db checksum recieved ${reply}`)
			break
		case cmd.interrogate:
			if (reply.length != msgLength.interrogate) {
				this.log(
					'warn',
					` Interrogate. Unexpected Length. Expected: ${msgLength.interrogate} Recieved: ${reply.length}`,
				)
				return undefined
			}
			this.log('warn', 'unit unexpectedly returned an interrogate')
			break
		case cmd.connect:
			if (reply.length != msgLength.connect) {
				this.log('warn', ` Connect. Unexpected Length. Expected: ${msgLength.connect} Recieved: ${reply.length}`)
				return undefined
			}
			this.log('warn', 'unit unexpectedly returned a connect')
			break
		case cmd.tally:
		case cmd.connected:
			if (reply.length != msgLength.connected) {
				this.log('warn', `Tally. Unexpected Length. Expected: ${msgLength.connected} Recieved: ${reply.length}`)
				return undefined
			}
			dstSrc = this.returnDstSrc(reply[1], reply[2], reply[3])
			if (dstSrc === undefined) {
				this.log('warn', 'returnDstSrc returned undefined, cannot process tally/connected response')
				return undefined
			}
			this.connections[dstSrc[0]] = dstSrc[1]
			this.log('info', `tally/connected msg recieved. Destination: ${dstSrc[0]} Source: ${dstSrc[1]}`)
			varList[`dst${dstSrc[0]}`] = this.connections[dstSrc[0]]
			this.checkFeedbacks('checkCrosspoint')
			this.setVariableValues(varList)
			if (this.isRecordingActions) {
				this.recordAction(
					{
						actionId: 'connect',
						options: { dst: dstSrc[0], src: dstSrc[1] },
					},
					`connect ${dstSrc[0]}`,
				)
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
		case cmd.enableCrosspointUpdate:
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
		case cmd.sourceLockStatusRequest:
			break
		case cmd.sourceLockStatusResponse:
			break
		case cmd.statusResponse4:
			break
		case cmd.statusResponse5:
			break
		case cmd.statusRequest2:
			break
		case cmd.statusResponse6:
			break
		case cmd.mixerInterrogate:
			break
		case cmd.mixerConnect:
			break
		case cmd.mixerTallyDump:
			break
		case cmd.mixerConnected:
			break
		case cmd.assignSlot:
			break
		case cmd.readSlotAssignment:
			break
		case cmd.setOutputGain:
			break
		case cmd.readOutputGain:
			break
		case cmd.readTwinkler:
			break
		case cmd.twinklerStatus:
			break
		case cmd.installedModulesStatusRequest:
			break
		case cmd.installedModulesStatusResponse1:
			break
		case cmd.mixerDisconnected:
			break
		case cmd.installedModulesStatusResponse3:
			break
		case cmd.connectOnGoGroupSalvo:
			break
		case cmd.goGroupSalvo:
			break
		case cmd.connectOnGoGroupSalvoAck:
			break
		case cmd.goDoneGroupSalvoAck:
			break
		case cmd.installedModulesStatusResponse2:
			break
		case cmd.routerInputOutputParametersInterrogate:
			break
		case cmd.routerInputOutputParametersTally:
			break
		case cmd.routerInputOutputParametersConnect:
			break
		case cmd.routerInputOutputParametersConnected:
			break
		case cmd.dualControllerStatusRequest:
			break
		case cmd.dualControllerStatusResponse:
			if (reply.length != msgLength.dualControllerStatusResponse) {
				this.log(
					'warn',
					` dualControllerStatusResponse. Unexpected Length. Expected: ${msgLength.dualControllerStatusResponse} Recieved: ${reply.length}`,
				)
				return undefined
			}
			if (reply[1] & 1) {
				this.log('info', 'Slave is Active')
			} else {
				this.log('info', 'Master is Active')
			}
			if (reply[1] & 2) {
				this.log('info', 'Active Status: Active')
			} else {
				this.log('info', 'Active Status: Inactive')
			}
			switch (reply[2]) {
				case cmdParam.dualControllerStatusResponse.byte2.idleControllerOK:
					this.log('info', 'Idle controller OK')
					break
				case cmdParam.dualControllerStatusResponse.byte2.idleControllerFaulty:
					this.log('warn', 'Idle controller missing / faulty')
					break
				case cmdParam.dualControllerStatusResponse.byte2.idleControllerUnknown:
					this.log('warn', 'Idle controller status unknown')
					break
				default:
					this.log('warn', `Unexpected idle controller status response ${reply[2]}`)
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
				'unit unexpectedly returned a extendedTally/extendedConnected. this module does not handle extended commands',
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
		case cmd.extendedConnectOnGoGroupSalvo:
			break
		case cmd.extendedConnectOnGoGroupSalvoAck:
			break
		case cmd.statusDataRequest:
			break
		case cmd.statusDataResponse1:
			break
		case cmd.routerConfigurationRequest:
			if (reply.length != msgLength.routerConfigurationRequest) {
				this.log(
					'warn',
					`Unexpected Length. Expected: ${msgLength.routerConfigurationRequest} Recieved: ${reply.length}`,
				)
				return undefined
			}
			this.log('info', `Router Configuration Request: ${reply}`)
			break
		case cmd.routerConfigurationResponse1:
			if (reply.length != msgLength.routerConfigurationResponse1) {
				this.log(
					'warn',
					`Unexpected Length. Expected: ${msgLength.routerConfigurationResponse1} Recieved: ${reply.length}`,
				)
				return undefined
			}
			this.log('info', `Router Configuration Response 1: ${reply}`)
			break
		case cmd.routerConfigurationResponse2:
			if (reply.length != msgLength.routerConfigurationResponse2) {
				this.log(
					'warn',
					`Unexpected Length. Expected: ${msgLength.routerConfigurationResponse2} Recieved: ${reply.length}`,
				)
				return undefined
			}
			this.log('info', `Router Configuration Response 2: ${reply}`)
			break
		case cmd.probelInternalUse1:
			break
		case cmd.probelInternalUse2:
			break
		case cmd.probelInternalUse3:
			break
		case cmd.probelInternalUse4:
			break
		case cmd.probelInternalUse5:
			break
		case cmd.broadcastTech16x2reserved1:
			break
		case cmd.broadcastTech16x2reserved2:
			break
		case cmd.broadcastTech16x2reserved3:
			break
		case cmd.broadcastTech16x2reserved4:
			break
		case cmd.broadcastTech16x2reserved5:
			break
		case cmd.broadcastTech16x2reserved6:
			break
		case cmd.extendedProtectTally:
			break
		case cmd.extendedProtectConnected:
			break
		case cmd.extendedProtectDisconected:
			break
		case cmd.protectDeviceNameResponse:
			break
		case cmd.extendedProtectTallyDump:
			break
		case cmd.extendedProtectInterrogate:
			break
		case cmd.extendedProtectConnect:
			break
		case cmd.protectDeviceNameRequest:
			break
		case cmd.extendedProtectDisconnect:
			break
		case cmd.extendedProtectTallyDumpRequest:
			break
		case cmd.preprocessingConfigRequest:
			break
		case cmd.preprocessingConfigResponse:
			break
		case cmd.preprocessingInterrogate:
			break
		case cmd.preprocessingConnect:
			break
		case cmd.preprocessingTally:
			break
		case cmd.preprocessingConnected:
			break
		case cmd.cannotExecute:
			break
		case cmd.extendedCommandSet:
			switch (reply[1]) {
				case extendedCommandSet.monitorRowInterrogate:
					break
				case extendedCommandSet.monitorRowConnect:
					break
				case extendedCommandSet.monitorRowTally:
					break
				case extendedCommandSet.monitorRowConnected:
					break
				default:
					this.log('warn', `Unknown extended command: ${reply}`)
			}
			break
		case cmd.xTallyStatus:
			break
		case cmd.xTallyInterrogate:
			break
		case cmd.xTallyStatusAck:
			break
		case cmd.xTallyResponse:
			break
		default:
			this.log('warn', `Unexpected response from unit: ${reply.toString()}`)
	}
	return true
}
