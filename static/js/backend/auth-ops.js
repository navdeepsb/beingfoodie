var AUTH_OPS = ((function( DB_OPS ) {

    var encrypt = function( str ) { return window.btoa( str ); };

    var _obj = {
        loginUser: function( data ) {
            data.password = encrypt( data.password );
            console.log( "[" + this.name + "] unm: " + data.email + "; pwd: " + data.password );
        },

        signupUser: function( data ) {
            return firebaseAuth.createUserWithEmailAndPassword( data.email, data.password )
                .then( function( firebaseUser ) {
                    if( firebaseUser ) {
                        data._key = firebaseUser.uid;
                        data.password = encrypt( data.password );

                        return DB_OPS.upsert( "/users", data, "user" );
                    }
                })
                .then( function( fromDb ) {
                    return fromDb.newData;
                })
                .catch( function( err ) {
                    console.log( "[error" + err.code + "] " + err.message );
                });
        },

        logoutUser: function( data ) {
            console.log( "[" + this.name + "] eml: " + data.email );
        },

        getUserInfoFromSession: function( email ) {
            console.log( "[" + this.name + "] eml: " + email );
        }
    };

    return _obj;
})( window.DB_OPS ));