const twoComp = 128
module.exports = {
	calcCheckSum(msg) {
		let sum = 0
		if (Array.isArray(msg)) {
			for (const element in msg) {
				if (isNaN(element)) {
					this.log('warn', `calcCheckSum has been passed a NaN: ${element}`)
					return undefined
				}
				sum += element
			}
			return twoComp - (sum % twoComp)
		}
		this.log('warn', `calcCheckSum was not passed an array: ${msg}`)
		return undefined
	},
	calcDivMod(number) {
		if (isNaN(number)) {
			this.log('warn', `calcDivMod has been passed a NaN: ${number}`)
			return undefined
		}
		number = parseInt(number)
		return [Math.floor(number / twoComp), number % twoComp]
	},
	returnDstSrc(multiplier, dst, src) {
		if (isNaN(multiplier) || isNaN(dst) || isNaN(src)) {
			this.log('warn', `returnDstSrc has been passed a NaN: ${multiplier} ${dst} ${src}`)
			return undefined
		}
		multiplier = parseInt(multiplier)
		dst = parseInt(dst)
		src = parseInt(src)
		let srcMult = multiplier & 7
		let dstMult = (multiplier - srcMult) / 16
		return [dstMult * twoComp + dst, srcMult * twoComp + src]
	},
}
