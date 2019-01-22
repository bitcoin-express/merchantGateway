"use strict";

/**
 * API routes definition.
 * Defines a route, together with http methods available for it and necessary actions.
 *
 * It is important to remember to always explicitly define if a route requires - or not - an authentication.
 * @module core/api
 * @link module:core/api/actions
 * @link module:core/api/endpoints
 * @link module:core/api/helpers
 */

const config = require('config');
const actions = require(config.get('system.root_dir') + '/core/api/actions');
const endpoints = require(config.get('system.root_dir') + '/core/api/endpoints');
const helpers = require(config.get('system.root_dir') + '/core/api/helpers');


/**
 * @typedef APIRouteCallback
 * @type function
 * @description A callback to be called by the Express router. Each callback should accept three
 * standard Express router parameters (req, res, next) and call next() as the last operation to proceed with the chain
 * execution - unless this is the last step in the chain,
 * @param {object} req - The Express' request object
 * @param {object} res - The Express' response object
 * @param {function} next - function to be called to proceed with the Express' chain of execution
 */

/**
 * @typedef APIRoute
 * @type object
 * @property {string} path - route path generated by {@link module:core/api/endpoints/getEndpointPath} with an argument
 * of one of the static path definitions in {@link module:core/api/endpoints}
 * @property {string} method - one of http standards methods that should be enabled for this path i.e post
 * @property {array} actions - action
 * @property {...APIRouteCallback} actions.action - an action to be performed for this route by the Express router
 */

/**
 * Definition of all available and externally accessible API routes.
 *
 * Each route is defined as an {Array} with two elements:
 * - identifier {string} - a short camelCase description to easily identify purpose of this route
 * - definition {APIRoute} - definition of a route
 *
 * Every endpoint may have multiple routes' definitions, each one for a different http method.
 * @type {Map}
 */
exports.routes = new Map([
    [ 'getTransactions', {
            path: endpoints.getEndpointPath(endpoints.TRANSACTIONS),
            method: 'get',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.getTransactions), ],
        },
    ],
    [ 'postTransactions', {
            path: endpoints.getEndpointPath(endpoints.TRANSACTIONS),
            method: 'post',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.postTransactions), ],
        },
    ],
    [ 'getTransactionById', {
            path: endpoints.getEndpointPath(endpoints.TRANSACTION_ID),
            method: 'get',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.getTransactionById), ],
        },
    ],
    [ 'getTransactionByOrderId', {
            path: endpoints.getEndpointPath(endpoints.TRANSACTION_ORDER_ID),
            method: 'get',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.getTransactionByOrderId), ],
        },
    ],
    [ 'postTransactionPayment', {
            path: endpoints.getEndpointPath(endpoints.TRANSACTION_ID_PAYMENT),
            method: 'post',
            actions: [ helpers.noAuthentication, helpers.asyncWrapper(actions.postTransactionByIdPayment), ],
        },
    ],
    [ 'postAccounts', {
            path: endpoints.getEndpointPath(endpoints.ACCOUNTS),
            method: 'post',
            actions: [ helpers.noAuthentication, helpers.asyncWrapper(actions.postAccounts), ],
        },
    ],
    [ 'getAccount', {
            path: endpoints.getEndpointPath(endpoints.ACCOUNT),
            method: 'get',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.getAccount), ],
        },
    ],
    [ 'patchAccount', {
            path: endpoints.getEndpointPath(endpoints.ACCOUNT),
            method: 'patch',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.patchAccount), ],
        },
    ],
    [ 'getAccountSettings', {
            path: endpoints.getEndpointPath(endpoints.ACCOUNT_SETTINGS),
            method: 'get',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.getAccountSettings), ],
        },
    ],
    [ 'patchAccountSettings', {
            path: endpoints.getEndpointPath(endpoints.ACCOUNT_SETTINGS),
            method: 'patch',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.patchAccountSettings), ],
        },
    ],
    [ 'getAccountBalance', {
            path: endpoints.getEndpointPath(endpoints.ACCOUNT_BALANCE),
            method: 'get',
            actions: [ helpers.requireAuthentication, helpers.asyncWrapper(actions.getAccountBalance), ],
        },
    ],
]);
