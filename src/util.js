const sevenBit = 128
module.exports = {
	calcCheckSum(msg) {
		let sum = 0
		if (Array.isArray(msg)) {
			for (let i = 0; i < msg.length; i++) {
				if (isNaN(msg[i])) {
					this.log('warn', `calcCheckSum has been passed a NaN: ${msg[i]}`)
					return undefined
				}
				sum += msg[i]
			}
			return sum % sevenBit == 0 ? 0 : sevenBit - (sum % sevenBit)
		}
		this.log('warn', `calcCheckSum was not passed an array: ${msg}`)
		return undefined
	},
	calcDivMod(number) {
		if (isNaN(number)) {
			this.log('warn', `calcDivMod has been passed a NaN: ${number}`)
			return undefined
		}
		number = parseInt(number - 1)
		return [Math.floor(number / sevenBit), number % sevenBit]
	},
	returnDstSrc(multiplier, dst, src) {
		if (isNaN(multiplier) || isNaN(dst) || isNaN(src)) {
			this.log('warn', `returnDstSrc has been passed a NaN: ${multiplier} ${dst} ${src}`)
			return undefined
		}
		multiplier = parseInt(multiplier)
		dst = parseInt(dst) + 1
		src = parseInt(src) + 1
		let srcMult = multiplier & 7
		let dstMult = (multiplier - srcMult) / 16
		return [dstMult * sevenBit + dst, srcMult * sevenBit + src]
	},
}
