export const msgDelay = 20 // Always leave at least 20 ms open between commands
export const cmdsPerMsg = 20 // Refer SW-P-88 V 4b Section 4.2, Page 11
export const keepAliveInterval = 30000 //half the default time out interval: 60s
export const keepAliveMsg = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00] //empty message for keepalive
export const SOM = 0xff
//connectOnGo, go only supported by 2413/4 HD LOCAL CONTROLLER, XD LOCAL CONTROLLER (2419) according to SW-P-88
export const cmd = {
	interrogate: 0x01,
	connect: 0x02,
	tally: 0x03,
	connected: 0x04,
	connectOnGo: 0x05,
	go: 0x06,
	statusRequest: 0x07, //not defined in SW-P-88
	statusResponse1: 0x08, //not defined in SW-P-88
	statusResponse2: 0x09, //not defined in SW-P-88
	statusResponse3: 0x0a, //not defined in SW-P-88
	statusResponse6rtrType1: 0x11, //mentioned but not defined in SW-P-88. Maybe actually response 5?
	statusRequest2: 0x12, //mentioned but not defined in SW-P-88
	statusResponse6: 0x13, //mentioned but not defined in SW-P-88
	connectOnGoAck: 0x0c,
	goDoneAck: 0x0d,
	unknown: 0x32, //probel general switcher sends this on connect
	extendedInterrogate: 0x41, //not defined in SW-P-88
	extendedConnect: 0x42, //not defined in SW-P-88
	extendedTally: 0x43, //not defined in SW-P-88
	extendedConnected: 0x44, //not defined in SW-P-88
	extendedConnectOnGo: 0x45, //not defined in SW-P-88
	extendedConnectOnGoAck: 0x46, //not defined in SW-P-88
	routerConfigurationRequest: 0x4b, //not defined in SW-P-88
	routerConfigurationResponse1: 0x4c, //not defined in SW-P-88
	routerConfigurationResponse2: 0x4d, //not defined in SW-P-88
}

export const cmdParam = {
	go: {
		set: 0x00,
		clear: 0x01,
	},
	goDoneAck: {
		set: 0x00,
		clear: 0x01,
		none: 0x02,
	},
	unknown: {
		unknown: 0x4e, //probel general switcher sends on connect
	},
}
//connectOnGoAck, goDoneAck only supported by 2413/4 HD LOCAL CONTROLLER, XD LOCAL CONTROLLER (2419)

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
