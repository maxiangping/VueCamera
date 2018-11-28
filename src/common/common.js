let _ = {};

_.isNull = (str) => !(typeof str === 'string' && str && str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));

_.now = () => new Date().getTime();

let FnExpr = function(val) {
	FnExpr.match_val = val;
};

FnExpr.prototype = {
	constructor: FnExpr,
	expr: function(requirement) {
		this.requirement = requirement;
		return this;
	},
	match: function(cb) {
		if (this.requirement && cb instanceof Function) {
			try {
				let _args = [];
				if (typeof FnExpr.match_val !== 'undefined') {
					_args.push(FnExpr.match_val);
				}
				cb();
			} catch (error) {
				this.pance = true;
				return this;
			}
		}
		return this;
	},
	unwrap: function(cb) {
		if (!this.requirement && cb instanceof Function) {
			try {
				cb();
			} catch (error) {
				this.pance = true;
				return this;
			}
		}
		return this;
	},
	pance: function(cb) {
		if (this.pance && cb instanceof Function) {
			cb();
		}
		return this;
	},
};

_.expr = function(requirement) {
	return new FnExpr().expr(requirement);
};

export default _;
