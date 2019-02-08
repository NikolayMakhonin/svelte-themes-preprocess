/* eslint-disable no-undefined,no-global-assign,no-undef,no-var,vars-on-top */
/* eslint prefer-template: "off" */
/* eslint-env es5 */
/* eslint semi: ["error", "always"] */
(function () {
	if (typeof navigator === 'undefined') {
		return;
	}

	// see: https://stackoverflow.com/a/16136040/5221762
	function getIeVersion() {
		var match = navigator.userAgent.match(/msie\s*(\d+)/);
		if (!match) {
			return null;
		}
		return parseInt(match[1], 10);
	}

	var ieVersion = getIeVersion();

	if (ieVersion && ieVersion <= 10) {
		Uint8Array = undefined;
	}
})();
