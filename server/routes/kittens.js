'use strict';

const mongooseCrudify = require('mongoose-crudify');

const helpers = require('../services/helpers');
const Kitten = require('../models/kitten');

module.exports = function (server) {

	// Docs: https://github.com/ryo718/mongoose-crudify
	server.use(
		'/api/kittens',
		mongooseCrudify({
			Model: Kitten,
			selectFields: '-__v', // Hide '__v' property
			endResponseInAction: false,
			afterActions: [
				{ middlewares: [helpers.formatResponse] },
			],
		})
	);

};