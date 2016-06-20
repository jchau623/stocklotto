$.ajaxSetup({'cache': true});

function initAutoComplete(){
    $("input#stocklookup").autocomplete({
        source: function(request, response){
            $.ajax({
                url: '//d.yimg.com/autoc.finance.yahoo.com/autoc?query='+request.term+'&region=US&lang=en-US',
                //cache: true,
                dataType: 'jsonp',
                jsonpCallback: 'YAHOO.util.ScriptNodeDataSource.callbacks',
                jsonp: 'callback',
                headers: {
                    'Cache-Control': 'max-age=0'
                }
            });

            YAHOO = {
                util: {
                    ScriptNodeDataSource: {
                        callbacks: function(data) {
                            console.log(data);
                        }
                    }
                }
            };
        }
    })
}