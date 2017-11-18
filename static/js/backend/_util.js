var UTILS = ((function() {

    var _obj = {
        encrypt: function( str ) {
            return window.btoa( str );
        },

        decrypt: function( str ) {
            return window.atob( str );
        },

        formatEmailAsKey: function( email ) {
            return email.replace( new RegExp( /@/, "g" ), "(at)" ).replace( new RegExp( /\./, "g" ), "(dot)" );
        },

        getKeyFromModelLocation: function( modelLocation ) {
            var i1 = modelLocation.indexOf( '/' );
            var i2 = modelLocation.lastIndexOf( '/' );
            return modelLocation.substr( i1 + 1, i2 - i1 - 1 );
        }
    };

    return _obj;
})());