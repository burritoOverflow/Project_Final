const Router = require('express');
const bodyParser = require('body-parser');

const { getCustomers, addCustomer, deleteCustomer } = require('./db.js');

const routes = new Router();
routes.use(bodyParser.json());

routes.route('/customers')
    .get(async (req, res) => {
    try {
        const result = await getCustomers();
        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    } catch (err) {
        res.status(500);
        console.log(err);
        res.end(JSON.stringify({ status: "error" }));
    }
}).post(async (req, res) => {
    if (req.headers['content-type'] != 'application/json') {
        res.status(416);
        res.end(JSON.stringify({ status: 'incorrect content-type' }));
    }
    try {
        const result = await addCustomer(req.body);
        res.status(201);
        const response = {
            resultID: `${result.insertedId}`
        };
        res.end(JSON.stringify(response));
    } catch (err) {
        res.status(500);
        console.log(err);
        res.end(JSON.stringify({ status: 'error' }));
    }
}).delete(async (req, res) => {
    try {
        const result = await deleteCustomer(req.body._id);
        if (result !== 1) {
            // if delete fails for the id provided, 
            // and it's not the result of an error, the id doesn't exist in the database,
            // so we'll go with this.
            res.status(404);
            res.end(JSON.stringify({ nDeleted: result }));
        }
        res.status(202);
        res.end(JSON.stringify({ nDeleted: result }));
    } catch (err) {
        console.log(err);
        res.end(JSON.stringify({ status: 'error' }));
    }
});

module.exports = { routes };