function initAutoComplete(){
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
                                    value: ticker.symbol
                                }
                            }))
                        }
                    }
                }
            };
        },
        select: function(event, ui){
            $.ajax({
                url: queryBuilder(ui.item.value, 'json', false, 'getJSON'),
                dataType: 'jsonp'
            });
            console.log(ui.item.value);
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

    function dateBuilder(){
        var now = new Date();
        var day = now.getDate() < 10 ? '0' + now.getDate().toString() : now.getDate().toString();
        var month = now.getMonth()+1 < 10 ? '0' + (now.getMonth()+1).toString() : (now.getMonth()+1).toString();
        var year = now.getFullYear();
        return [(year-1).toString() + '-' + month + '-' + day,
                year.toString() + '-' + month + '-' + day];

    }
}

function getJSON(data) {
    console.log(data);
}