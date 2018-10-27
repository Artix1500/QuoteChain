import shouldfail from 'openzeppelin-solidity/test/helpers/shouldfail.js';
import expectEvent from 'openzeppelin-solidity/test/helpers/expectEvent';

var QuoteChain = artifacts.require("QuoteChain");

var instance;
var quotes;

require('chai').should();


contract('QuoteChain test', async (accounts) => {
    beforeEach(async () => {
        var account_zero = accounts[0];
        instance = await QuoteChain.new("Test");
        quotes = instance;
    })

    contract('constructor', async () => {
        it('Empty string as constructor argument', async () => {
            instance = await shouldfail.reverting(QuoteChain.new(""));
        })

        it('BIG string as constructor argument', async () => {
            let temp = generateString();
            instance = await shouldfail.reverting(QuoteChain.new(temp));
        })

        it("Should give first quote", async () => {
            instance = await QuoteChain.new("Test");
            quotes = instance;
            var account_one = accounts[1];
            let _quote = "quote 2";
            await quotes.getQuote.sendTransaction(_quote,{from: account_one});
            let myquote = await quotes.yourQuote.call({from: account_one});
            let wynik = myquote.toString();
            assert.equal(wynik, "Test");
        })
    });

    contract('getQuote', async () => {
        it('Empty string as getQuote argument', async () => {
            var account_one = accounts[1];
            let _quote1 = "";
            await shouldfail.reverting(quotes.getQuote.sendTransaction(_quote1,{from: account_one}));
         })

         it('BIG string as getQuote argument', async () => {
            var account_one = accounts[1];
            let _quote1 = generateString();
            await shouldfail.reverting(quotes.getQuote.sendTransaction(_quote1,{from: account_one}));
         })

         it("Sending message twice", async () => {
            var account_one = accounts[1];
            let _quote1 = "Next Quote";
            let _quote2 = "New Quote";
            await quotes.getQuote.sendTransaction(_quote1,{from: account_one});
            await shouldfail.reverting(quotes.getQuote.sendTransaction(_quote2,{from: account_one}));
        })
    });

    contract('yourQuote', async () => {
        it("Should give last quote", async () => {
            var account_one = accounts[1];
            var account_two = accounts[2];
            let _quote1 = "Next Quote";
            let _quote2 = "New Quote";
            await quotes.getQuote.sendTransaction(_quote1,{from: account_one});
            await quotes.getQuote.sendTransaction(_quote2,{from: account_two});
            let myquote = await quotes.yourQuote.call({from: account_two});
            let wynik = myquote.toString();
            assert.equal(wynik, _quote1);
        })

        it('Call for quote without sending one', async () => {
            var account_one = accounts[1];
            await shouldfail.reverting(quotes.yourQuote.call({from: account_one}));
        })
    }); 

    contract('Event NewQuote', async () => {
        it('Emiting event', async function () {
            let account_one = accounts[1];
            let _quote1 = "Next Quote";
            expectEvent.inTransaction(quotes.getQuote.sendTransaction(_quote1,{from: account_one}), 'NewQuote');
          });
    }); 
})

function generateString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 500; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}