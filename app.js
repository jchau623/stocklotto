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
                url: ' https://ichart.yahoo.com/table.csv?s=AAPL&a=5&b=19&c=2015&d=5&e=19&f=2016',
                dataType: 'jsonp',
                jsonpCallback: 'getCSV'
            });
            var getCSV = function(data) {
                console.log(data)
            };
            console.log(ui.item.value);
        }
    })
}