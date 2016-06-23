function initAutoComplete(){
    var stocks = new StockList();

    $("input#stocklookup").autocomplete({
        source: function(request, response){
            $.ajax({
                url: '//d.yimg.com/autoc.finance.yahoo.com/autoc?query='+request.term+'&region=US&lang=en-US',
                dataType: 'jsonp',
                jsonpCallback: 'YAHOO.util.ScriptNodeDataSource.callbacks'
            });
            YAHOO = {
                util: {
                    ScriptNodeDataSource: {
                        callbacks: function(data) {
                            console.log(data);
                            response($.map(data.ResultSet.Result, function(ticker){
                                return {
                                    label: ticker.symbol + " - " + ticker.name + " (" + ticker.exchDisp + ")",
                                    ticker: ticker.symbol,
                                    exchange: ticker.exchDisp
                                }
                            }));
                        }
                    }
                }
            };
        },
        select: function(event, ui){
            var stock = ui.item;
            $.ajax({
                url: queryBuilder(stock.ticker, 'json', false, 'getJSON'),
                dataType: 'jsonp'
            });
            stocks.addStock(new Stock(stock.ticker, stock.exchange, stock.label));
            console.log(stocks.getStockList());
            //clears input field of characters
            $('#stocklookup').val('');
            return false;
        }
    })
}

/*
YQL finance query builder
YQL turns CSV from ichart.yahoo.com/table.csv?s=... to JSON
extra step necessary because CSV can't be returned via JSONP
 */
function queryBuilder(symbol, type, diagnostics, callback){
    var resource;
    var dateRange = dateBuilder();
    resource = 'http://query.yahooapis.com/v1/public/yql?q=' +
            'select * from   yahoo.finance.historicaldata ' +
            'where           symbol = "' + symbol + '"' +
            'and    startDate = "' + dateRange[0] + '"' +
            'and    endDate   = "' + dateRange[1] + '"' +
            '&format=' + type  +
            '&diagnostics=' + diagnostics.toString() +
            '&env=store://datatables.org/alltableswithkeys' + '&callback=' + callback;
    console.log(resource);
    return resource;

    //build date in yyyy-mm-dd format
    function dateBuilder(){
        var now = new Date();
        var day = now.getDate() < 10 ? '0' + now.getDate().toString() : now.getDate().toString();
        var month = now.getMonth()+1 < 10 ? '0' + (now.getMonth()+1).toString() : (now.getMonth()+1).toString();
        var year = now.getFullYear();
        return [(year-1).toString() + '-' + month + '-' + day,
                year.toString() + '-' + month + '-' + day];

    }
}

function StockList() {
    var stockList = {};
    this.addStock = function(stock) {
        var elementID = stock.ticker+'::'+stock.exchange;
        if(stockList[elementID]) {
            return;
        }
        stockList[elementID] = {
            ticker: stock.ticker,
            exchange: stock.exchange
        };
        $('#stockList').append('<li id="'+elementID+'">'+stock.label+' <a href="#" id='+elementID+'DEL'+'>X</a>');
        document.getElementById(elementID+'DEL').addEventListener('click', function() {
            removeStock(elementID);
        });
    };
    this.getStockList = function() {
        return stockList;
    };
    function removeStock(eID) {
        delete stockList[eID];
        var elem = eID.replace(/\:\:/, '\\:\\:');
        $('#'+elem).remove();
    }
}

class Stock {
    constructor(ticker, exchange, label) {
        this.ticker = ticker;
        this.exchange = exchange;
        this.label = label;
    }
}

function getJSON(data) {
    console.log(data.query.results);
}