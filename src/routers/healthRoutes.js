const Router = require("express").Router();

Router.get("/", (request, response) => {
	const healthCheck = {
		uptime: process.uptime(),
		message: "OK",
		timestamp: Date.now(),
	};
	try {
		response.send(healthCheck);
	} catch (error) {
		healthCheck.message = error;
		response.status(503).send();
	}
});

module.exports = Router;
