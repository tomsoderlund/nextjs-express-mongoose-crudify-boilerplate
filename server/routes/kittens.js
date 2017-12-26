'use strict';

const mongooseCrudify = require('mongoose-crudify');

const Kitten = require('../models/kitten');

// Since DELETE doesn't return the _id of deleted item by default
const formatResponse = function (req, res, next) {
	return res.json(req.crudify.err || (req.method === 'DELETE' ? req.params : req.crudify.result));
};

module.exports = function (server, router) {

	// Docs: https://github.com/ryo718/mongoose-crudify
	server.use(
		'/api/kittens',
		mongooseCrudify({
			Model: Kitten,
			endResponseInAction: false,
			afterActions: [
				{ middlewares: [formatResponse] },
			],
		})
	);

};