/**
 *   @desc A logger module for debugging
 * @author Navdeep
 **/

window.LOGGER = function( moduleName ) {
    var isEnabled = true;

    var _obj = {
        info: function( message ) {
            if( message && isEnabled ) {
                var d = new Date();
                console.log ( $.tmpl( "log-string", {
                    module: moduleName,
                    type: "info",
                    timestamp: d.getFullYear() + "/" + ( d.getMonth() + 1 ) + "/" + d.getDate() + " " + d.toTimeString().substr( 0, 8 ),
                    message: message
                }).text() );
            }
        }
    };

    return _obj;
};