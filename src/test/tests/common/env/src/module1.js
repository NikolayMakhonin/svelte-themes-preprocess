/* eslint-disable quote-props,func-style,no-var,prefer-rest-params */
export const func1 = function (p1, ...params) {
	return `${p1} ${p1?.length} ${params.length} ${Array.from(arguments).length}`
}

export var var1 = 'var1'

export default {
	func1,
	'var_1_1': var1,
	var_1_2  : var1
}
