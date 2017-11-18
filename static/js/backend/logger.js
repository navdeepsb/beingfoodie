window.LOGGER = function( moduleName ) {

    var _obj = {
        info: function( message) {
            var d = new Date();
            console.log ( $.tmpl( "log-string", {
                module: moduleName,
                type: "info",
                timestamp: d.getFullYear() + "/" + ( d.getMonth() + 1 ) + "/" + d.getDate() + " " + d.toTimeString().substr( 0, 8 ),
                message: message
            }).text() );
        }
    };

    return _obj;
};