/**
 * handlebars-helper-formatdate
 * Handlebars helper that format dates using moment.
 *
 * @author Antonio Hernandez <ahdiaz@gmail.com>
 * @license MIT
 */

var moment = require('moment');

module.exports = function(date, format) {
	var mmnt = moment(date);
	return mmnt.format(format);
};
