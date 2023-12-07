//export const regexpAddr = new RegExp(/^.{0,6}[^.*,`"]$/g)
export const msgDelay = 20 // Always leave at least 20 ms open between commands
export const cmdsPerMsg = 20 // Refer SW-P-88 V 4b Section 4.2, Page 11
export const keepAliveInterval = 30000 //half the default time out interval: 60s
export const SOM = '0xFF'
//connectOnGo, go only supported by 2413/4 HD LOCAL CONTROLLER, XD LOCAL CONTROLLER (2419)
export const cmd = {
	interrogate: 1,
	connect: 2,
	connectOnGo: 5,
	go: 6,
}

export const cmdParam = {
	go: {
		set: 0,
		clear: 1,
	},
}
//connectOnGoAck, goDoneAck only supported by 2413/4 HD LOCAL CONTROLLER, XD LOCAL CONTROLLER (2419)
export const resp = {
	tally: 3,
	connected: 4,
	connectOnGoAck: 12,
	goDoneAck: 13,
}

export const respParam = {
	goDoneAck: {
		xpointsSet: 0,
		xpointsCleared: 1,
		noXpoints: 2,
	},
}
