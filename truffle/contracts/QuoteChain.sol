pragma solidity ^0.4.23;

contract QuoteChain {
    mapping(address => address) public fromWho;
    mapping(address => string) private quote;
    address lastQuoteOwner;
    uint index;

    event NewQuote(
        uint index
    );
    
    modifier correctString(string _quote) {
        require(bytes(_quote).length != 0, "EMPTY STRING IN CONSTRUCTOR");
        require(bytes(_quote).length < 300, "STRING IS TO BIG IN CONSTRUCTOR");
        _;
    }

    constructor(string _quote) public correctString(_quote){
        lastQuoteOwner = msg.sender;
        quote[lastQuoteOwner] = _quote;
        fromWho[msg.sender] = 1;
        index = 0;
    }
    
    function getQuote(string _quote) public correctString(_quote){
        require(fromWho[msg.sender] == 0, "ADDRESS IS NOT ZERO IN GETQUOTE");
        
        emit NewQuote(index);
        index++;
        quote[msg.sender] = _quote;
        fromWho[msg.sender] = lastQuoteOwner;
        lastQuoteOwner = msg.sender;
    }
    
    function yourQuote()public view returns(string){
        require(fromWho[msg.sender] != 0, "ADDRESS ZERO IN YOURQUOTE");
        
        return quote[fromWho[msg.sender]];
    }
}





