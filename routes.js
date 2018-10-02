var db = require('./db');

var { registerAccount } = require("./requests/register");
var { findTransactions } = require("./requests/getTransactions");
var { getSettings } = require("./requests/setConfig");
var { getListBalances } = require("./requests/getBalance");

function displayHome(res, account_id, account) {
  var promises = [
    getSettings(account_id).then((setts) => {
      var result = new Array();
      for (var key in setts) {
        result.push({
          key: key,
          value: setts[key]
        });
      }
      return result;
    }),
    findTransactions(account_id),
    getListBalances(account_id, "XBT")
  ];

  Promise.all(promises).then((responses) => {
    var btcBalance = 0.0;
    var btcCoins = 0;
    if (responses[2] && responses[2].length > 0) {
      btcBalance = responses[2][0].total;
      btcCoins = responses[2][0].numCoins;
    }
    res.render('home', {
      transactions: responses[1],
      settings: responses[0],
      accountName: account.name || "unnamed",
      accountId: account_id,
      btcBalance: btcBalance,
      btcCoins: btcCoins
    });
  }).catch((err) => {
    res.render('index', { error: err.message });
  });
}

exports.panelRoute = function(req, res, next) {
  switch(req.originalUrl) {
    case "/panel/register":
      res.render('register');
      break;

    case "/panel/confirmRegistration":
      registerAccount(req).then((resp) => {
        res.render('confirmRegistration', resp);
      }).catch((err) => {
        res.status(400).send(err.message || err);
      });
      break;

    case "/panel/logout":
      req.session.destroy();
      res.render('index');
      break;

    case "/panel/home":
      var {
        account_id,
        account,
      } = req.session;

      if (account_id && account) {
        displayHome(res, account_id, account);
        return;
      }

      if (!req.body.authToken) {
        res.render('index', { error: 'no authToken provided' });
        return;
      }

      var query = { authToken: req.body.authToken };
      db.findOne("accounts", query).then((resp) => { 
        if (!resp) {
          res.render('index', { error: 'incorrect authToken' });
          return;
        }

        var id = resp._id;
        delete resp.privateKey;
        delete resp.authToken;
        delete resp.id;
        req.session.account_id = id;
        req.session.account = resp;

        displayHome(res, id, resp);
      }).catch((err) => {
        console.log("Error on login ", err.message);
        res.render('index', { error: "incorrect authToken" });
      });
      break;

    default:
      res.status(400).send("Not found");
  }
}
