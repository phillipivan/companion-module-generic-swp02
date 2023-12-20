export const msgDelay = 20 // Always leave at least 20 ms open between commands
export const cmdsPerMsg = 20 // Refer SW-P-88 V 4b Section 4.2, Page 11
export const keepAliveInterval = 30000 //half the default time out interval: 60s
export const SOM = 0xff
//connectOnGo, go only supported by 2413/4 HD LOCAL CONTROLLER, XD LOCAL CONTROLLER (2419) according to SW-P-88
export const cmd = {
	databaseChecksum: 0x00, //defined in SW-P-02 - This message is used to request a database checksum. ALSO This message responds with the checksum of a database after a DATABASE CHECKSUM REQUEST has been received.
	interrogate: 0x01,
	connect: 0x02,
	tally: 0x03,
	connected: 0x04,
	connectOnGo: 0x05,
	go: 0x06,
	statusRequest: 0x07, // defined in SW-P-02 - Triggers the receiving device to respond with a status response message (3.2.10, 3.2.11, 3.2.12, 3.2.18 or 3.2.19).
	statusResponse1: 0x08, // defined in SW-P-02 - Issued by a 2513/2514/2515/2659/2440 card or a TDM 4-Wire router (2510) card in response to the STATUS REQUEST message (3.2.9).
	statusResponse2: 0x09, // defined in SW-P-02 - Issued by a 5007/5107 TDM controller card in response to the STATUS REQUEST message (3.2.9).
	statusResponse3: 0x0a, // defined in SW-P-02 - Issued by an HD local control card (2412/2413/2414) in response to the STATUS REQUEST message (3.2.9)
	enableCrosspointUpdate: 0x0b, // defined in SW-P-02 - Issued to a router to enable actual crosspoint setting to take place, otherwise the crosspoint card will store requests until enabled. Note: Currently only implemented in the HD local control card and this feature is jumper selectable. Also this command has no effect on HD Digital video/RS422 routers or MADI routers.
	connectOnGoAck: 0x0c,
	goDoneAck: 0x0d,
	sourceLockStatusRequest: 0x0e, // defined in SW-P-02 - Triggers the receiving device to respond with a SOURCE LOCK STATUS response message (3.2.17).  This command is only applicable to the HD digital video routers.
	sourceLockStatusResponse: 0x0f, // defined in SW-P-02 - Issued by an HD series local control card in response to the Source Lock Status request message (3.2.16).  This message indicates the source lock status on the input modules.
	statusResponse5: 0x10, // defined in SW-P-02 - This is sent in response to a STATUS REQUEST message (3.2.9).  It indicates which modules in an XD router are faulty.
	statusResponse5: 0x11, // defined in SW-P-02 - This is sent in response to a STATUS REQUEST message (3.2.9).  It indicates which modules in a router made up of multiple routers are faulty. This message would normally be implemented on an interface unit which combines several router frames to make a logically larger router.
	statusRequest2: 0x12, //mentioned but not defined in SW-P-88
	statusResponse6: 0x13, //mentioned but not defined in SW-P-88
	mixerInterrogate: 0x15, // defined in SW-P-02 - The MIXER INTERROGATE message is sent by the control system to inquire about all sources contributing to the given output.  The TDM 4-Wire Router controller (2510) will reply with MIXER TALLY DUMP (3.2.22).
	mixerConnect: 0x16, // defined in SW-P-02 - This message is sent by the control system to the TDM 4-Wire Router to set a mixing crosspoint with the given gain coefficient.
	mixerTallyDump: 0x17, // defined in SW-P-02 - This message is sent by a TDM 4-Wire Router in response to a  MIXER   INTERROGATE message.  It returns information about all sources contributing to the given output.
	mixerConnected: 0x18, // defined in SW-P-02 - This message confirms that crosspoint has been set following the MIXER CONNECT message.
	assignSlot: 0x19, //  defined in SW-P-02 - This message allows the TDM 4-Wire Router to change assignment of physical inputs to time slots.  It is indispensable for routers of size greater than 384 x 384. This message is also sent in response to a READ SLOT ASSIGNMENT message (3.2.25) by the TDM 4-Wire Router controller.
	readSlotAssignment: 0x1a, // defined in SW-P-02 - This message interrogates the TDM 4-Wire Router to find out which slot number is allocated to the given input.
	setOutputGain: 0x1b, // defined in SW-P-02 - This message is sent to the TDM 4-Wire Router to change gain on the given output.  This message is also sent in response to READ OUTPUT GAIN message (3.2.27).
	readOutputGain: 0x1c, // defined in SW-P-02 - This message is sent by the control system to read the gain coefficient applied on the given output of the TDM 4-Wire Router.
	readTwinkler: 0x1d, // defined in SW-P-02 - This message is sent by the control system to read the input signal levels on all 96 ports of the TDM 4-Wire Router.
	twinklerStatus: 0x1e, // defined in SW-P-02 - This message is sent by the TDM 4-Wire Router in response to a READ TWINKLER command.
	installedModulesStatusRequest: 0x1f, // defined in SW-P-02 - This command requests the current configuration of installed crosspoint and I/O modules in a router.
	installedModulesStatusResponse1: 0x20, // defined in SW-P-02 - This message is sent in response to the INSTALLED MODULES STATUS REQUEST.  It indicates which cards were present when RECONFIGURE button was pressed last on router controller card.
	mixerDisconnected: 0x21, // defined in SW-P-02 - This message will be sent by a 4-Wire Router if a source has been replaced by the parking source on the given destination.
	installedModulesStatusResponse3: 0x22, // defined in SW-P-02 - This message is sent in response to the INSTALLED MODULES STATUS REQUEST.  It indicates which cards were present when RECONFIGURE button was pressed last on router controller card.
	connectOnGoGroupSalvo: 0x23, // defined in SW-P-02 - Used in configuring up to 128  Salvos required for switching situations.  Routing information is held in the receiving device until activated by GO GROUP SALVO command (3.2.35).
	goGroupSalvo: 0x24, // defined in SW-P-02 - Triggers the receiving device to set all routes in / clear the previously received CONNECT ON GO GROUP SALVO messages.  A GO DONE GROUP SALVO acknowledge message (3.2.37) will be issued to indicate that the command has been executed.
	connectOnGoGroupSalvoAck: 0x25, // defined in SW-P-02 - This message is issued by a device in response to a CONNECT ON GO GROUP SALVO request (3.2.34).
	goDoneGroupSalvoAck: 0x26, // defined in SW-P-02 - This message is issued by a device in response to a GO GROUP SALVO message (3.2.35). 
	installedModulesStatusResponse2: 0x2a, // defined in SW-P-02 - This is sent in response to the INSTALLED MODULES STATUS REQUEST.  It indicates which cards were present when RECONFIGURE button was pressed last on XD router controller card.
	routerInputOutputParametersInterrogate: 0x2b, // defined in SW-P-02 - This message requests the router input/output parameter data, the nature of which depends on the router type.  The maximum number of sources that can be requested from any one request is restricted to 64.
	routerInputOutputParametersTally: 0x2c, // defined in SW-P-02 - This message is issued in response to a ROUTER INPUT/OUTPUT PARAMETERS INTERROGATE message (3.2.39).  The message data content depends on the router type selected
	routerInputOutputParametersConnect: 0x2d, // defined in SW-P-02 - This message is issued to set input/output parameters for various router types.
	routerInputOutputParametersConnected: 0x2e, // defined in SW-P-02 - This message is issued in response to a ROUTER INPUT/OUTPUT PARAMETERS CONNECT message (3.2.41).  The message is issued as confirmation of a successful ‘connect’.
	dualControllerStatusRequest: 0x32, // defined in SW-P-02 - This message is issued to a dual router controller system to request the status of the controllers.
	dualControllerStatusResponse: 0x33, // defined in SW-P-02 - This message is issued by the active controller on power-up or in response to a DUAL CONTROLLER STATUS REQUEST message (Command byte 50).
	extendedInterrogate: 0x41, // This message requests tally information for devices with greater than 1024 sources and/or destinations. A device responds to this message with an Extended TALLY message (3.2.47). This message allows up to 4096 destinations to be addressed.
	extendedConnect: 0x42, // defined in SW-P-02
	extendedTally: 0x43, // defined in SW-P-02
	extendedConnected: 0x44, // defined in SW-P-02
	extendedConnectOnGo: 0x45, // defined in SW-P-02
	extendedConnectOnGoAck: 0x46, // defined in SW-P-02
	extendedConnectOnGoGroupSalvo: 0x47, // defined in SW-P-02
	extendedConnectOnGoGroupSalvoAck: 0x48, // defined in SW-P-02
	statusDataRequest: 0x49, // defined in SW-P-02 - This is sent to request status data from the target system. A number of responses are possible depending on the target type. Multiple bits can be set in the status data type bit, to request more then 1 type of information in a single message.
	statusDataResponse1: 0x4a, // defined in SW-P-02 - This is sent in response to a STATUS DATA REQUEST message (Command byte 73). It contains status information pertaining to MADI Eclipse router. 
	routerConfigurationRequest: 0x4b, // defined in SW-P-02 - This is sent to request how the router is configured. The router responds with the ROUTER CONFIGURATION RESPONSE Message (Command byte 76).
	routerConfigurationResponse1: 0x4c, // defined in SW-P-02 - This is sent in response to a ROUTER CONFIGURATION REQUEST message (Command byte 75). It contains a bit map showing which levels are configured and the number of destinations and sources on each level. When controlling a router with multiple levels the destinations are stacked on top of each other. 
	routerConfigurationResponse2: 0x4d, // not defined in SW-P-02
	extendedProtectTally: 0x60, // defined in SW-P-02 - This message is issued by a controller or a router in response to an EXTENDED PROTECT INTERROGATE message (Command Byte 101). It returns the current protect status of a destination. 
	extendedProtectConnected: 0x61, // defined in SW-P-02 - This message is issued by either a controller or a router when the protect data is altered and also if the data was unsuccessfully altered as a result of an EXTENDED PROTECT CONNECT message (Command Bytes 102). This message is broadcast on all ports.
	extendedProtectDisconected: 0x62, // defined in SW-P-02 - This message is issued by a controller or a router when the protect data is altered, i.e. a destination has been unprotected and also if the data was unsuccessfully altered as a result of an EXTENDED PROTECT DIS-CONNECT message (Command Bytes 104).
	protectDeviceNameResponse: 0x63, // defined in SW-P-02 - This message is issued by a controller or a Router in response to a PROTECT DEVICE NAME REQUEST message (Command Byte 103), returning the device name protecting a particular destination. 
	extendedProtectTallyDump: 0x64, // defined in SW-P-02 - This message is issued by a controller or a router in response to an EXTENDED PROTECT DUMP REQUEST (Command Byte 105). It returns all the Protect Information. 
	extendedProtectInterrogate: 0x65, // defined in SW-P-02 - This message is issued either by a controller or by a router to get the current protect status of a destination. The router will respond with an EXTENDED PROTECT TALLY message (Command Byte 96).
	extendedProtectConnect: 0x66, // defined in SW-P-02 - This message is issued by a router or a remote device to protect a destination. The router will respond with an EXTENDED PROTECT CONNECTED message (Command Byte 97).
	protectDeviceNameRequest: 0x67, // defined in SW-P-02 - Any device issues this message when the device name protecting a particular destination is required.
	extendedProtectDisconnect: 0x68, // defined in SW-P-02 - This message is issued by a router or a remote device to remove protection from a destination. The controller or the router will issue an EXTENDED PROTECT DIS-CONNECTED message (Command Byte 98) in response. 
	extendedProtectTallyDumpRequest: 0x69, // defined in SW-P-02 - This message allows all the Protect information to be requested from a controller by a router when the router initialises. 
	xTallyStatus: 0x7c, // defined in SW-P-02 - This message is sent by Charisma Ten X to an external device whenever the tally status inside the Charisma Ten X changes.
	xTallyInterrogate: 0x7d, // defined in SW-P-02 - This message is sent by an external device to the Charisma Ten X to request a bitmap of the video and key sources that currently appear on the output of the Charisma Ten X, and, for the Ten X destination number mapping for each of video input.
	xTallyStatusAck: 0x7e, // defined in SW-P-02 - This message is sent by an external device to the Charisma Ten X to acknowledge an X_TALLY_STATUS message previously sent by a Charisma Ten X.
	xTallyResponse: 0x7f, // defined in SW-P-02 - This message is sent by Charisma Ten X in response to a X_TALLY_INTERROGATE request.
}

export const cmdParam = {
	databaseChecksum: {
		requestChecksum: 0x00,
	},
	go: {
		set: 0x00,
		clear: 0x01,
	},
	goDoneAck: {
		set: 0x00,
		clear: 0x01,
		none: 0x02,
	},
	statusRequest: {
		leftHandController: 0x00,
		rightHandController: 0x01,
	},
	sourceLockStatusRequest: {
		leftHandController: 0x00,
		rightHandController: 0x01,
	},
	installedModulesStatusRequest: {
		leftHandController: 0x00,
		rightHandController: 0x01,
	},
	goGroupSalvo: {
		set: 0x00,
		clear: 0x01,
	},
	goDoneGroupSalvoAck: {
		set: 0x00,
		clear: 0x01,
		none: 0x02,
	},
	dualControllerStatusResponse: {
		byte1: {
			masterActive: 0x00,
			slaveActive: 0x01,
		},
		byte2: {
			idleControllerOK: 0x00,
			indleControllerFaulty: 0x01,
		},
	},
}
//connectOnGoAck, goDoneAck only supported by 2413/4 HD LOCAL CONTROLLER, XD LOCAL CONTROLLER (2419)
// lengths exlude SOM
export const msgLength = {
	interrogate: 4,
	connect: 5,
	tally: 5,
	connected: 5,
	connectOnGo: 5,
	go: 3,
	statusRequest: 3,
	statusResponse1: 5,
	statusResponse2: 3,
	statusResponse3: 5,
	connectOnGoAck: 5,
	goDoneAck: 3,
	unknown: 2,
	unknownResp: 4,
	extendedInterrogate: 4,
	extendedConnect: 6,
	extendedTally: 7,
	extendedConnected: 7,
	extendedConnectOnGo: 6,
	extendedConnectOnGoAck: 6,
	routerConfigurationRequest: 2,
	routerConfigurationResponse1: 10,
	routerConfigurationResponse2: 16,
}
