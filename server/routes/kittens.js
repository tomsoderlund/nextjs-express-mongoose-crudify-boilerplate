'use strict';

const mongooseCrudify = require('mongoose-crudify');

const Kitten = require('../models/kitten');

// DELETE doesn't return the _id of deleted item by default
const addIdToDeleteResults = function (req, res, next) {
	return res.json(req.crudify.err || (req.method === 'DELETE' ? req.params : req.crudify.result));
};

module.exports = function (server, router) {

	server.use(
		'/api/kittens',
		mongooseCrudify({
			Model: Kitten,
			endResponseInAction: false,
			afterActions: [
				{ middlewares: [addIdToDeleteResults] },
			],
		})
	);

};