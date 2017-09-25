'use strict';

const mongooseCrudify = require('mongoose-crudify');

const Kitten = require('../models/kitten');

module.exports = function (server, router) {

	server.use(
		'/api/kittens',
		mongooseCrudify({
			Model: Kitten
		})
	);

};