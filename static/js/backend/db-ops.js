var DB_OPS = ((function( db, DB_SCHEMAS, UTILS, logger ) {

    var _obj = {
        get: function( modelLocation ) {
            var _logger = logger( "DB_OPS.get" );

            _logger.info( "modelLocation: " + modelLocation );

            return db.ref( modelLocation ).once( "value" )
                .then( function( snapshot ) {
                    var fromDb = snapshot.val();
                    _logger.info( "Found this data: " + JSON.stringify( fromDb, null, 4 ) );
                    return fromDb;
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message );
                    return err;
                });
        },

        upsert: function( modelStore, data, modelSchema ) {
            var _logger = logger( "DB_OPS.upsert" );

            return db.ref( modelStore ).once( "value" )
                .then( function( snapshot ) {
                    var oldData    = snapshot.val(); // will be `null` if not found
                    var isUpdateOp = !!oldData; // if data is present, it is an update operation
                    var dataToSend = DB_SCHEMAS[ modelSchema ]();

                    // Inherit schema attributes:
                    Object.keys( dataToSend ).forEach( function( k ) {
                        if( data[ k ] ) {
                            dataToSend[ k ] = data[ k ];
                        }
                    });

                    // Encrypt the password:
                    dataToSend.password = UTILS.encrypt( dataToSend.password );

                    _logger.info( "type: " + ( isUpdateOp ? "update" : "insert" ) + "; modelStore: " + modelStore + "; modelSchema: " + modelSchema + "; dataToSend:\n" + JSON.stringify( dataToSend, null, 4 ) );

                    // db_operation:
                    db.ref( modelStore )[ isUpdateOp ? "update" : "set" ]( dataToSend );

                    return {
                        newData: dataToSend,
                        oldData: oldData,
                        isUpdateOp: isUpdateOp
                    };
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message + " Email: " + data.email );
                    return err;
                });
        },

        updateValue: function( modelLocation, newValue ) {
            var _chain  = window.Promise.resolve( {} ).then( function() { return modelLocation; } );
            var _logger = logger( "DB_OPS.updateValue" );

            _logger.info( "modelLocation: " + modelLocation );

            // Handle password update:
            if( modelLocation.endsWith( "password") ) {
                _logger.info( "Password update detected, encrypting..." );
                newValue = UTILS.encrypt( newValue );
            }

            // Handle email update:
            if( modelLocation.endsWith( "email") ) {
                _logger.info( "Email update detected, proceeding to update the root key" );

                var _usersRef = db.ref( "users/" );
                var _childRef = _usersRef.child( UTILS.getKeyFromModelLocation( modelLocation ) );
                var _snapshot = null;

                _chain = _chain.then( function() {
                        _logger.info( "Chaining child ref update" );
                        return _childRef.once( "value" );
                    })
                    .then( function( snapshot ) {
                        _snapshot = snapshot.val();

                        if( UTILS.formatEmailAsKey( _snapshot.email ) === UTILS.formatEmailAsKey( newValue ) ) {
                            _logger.info( "No update required since it is the same email" )
                            return modelLocation;
                        }

                        _logger.info( "Found this snapshot: " + JSON.stringify( _snapshot, null, 4 ) );
                        _logger.info( "New key: " + UTILS.formatEmailAsKey( newValue ) );
                        _usersRef.child( UTILS.formatEmailAsKey( newValue ) ).set( _snapshot );
                        _childRef.remove();
                        _logger.info( "Old modelLocation: " + modelLocation );
                        modelLocation = "users/" + UTILS.formatEmailAsKey( newValue ) + "/email";
                        _logger.info( "New modelLocation: " + modelLocation );
                        return modelLocation;
                    });
            }

            _logger.info( "Updating w/ val: " + newValue );

            return _chain
                .then( function( modelLocation ) {
                    _logger.info( "Updating at modelLocation: " + modelLocation );
                    return db.ref( modelLocation ).set( newValue );
                })
                .then( function() {
                    _logger.info( "Updated successfully" );
                    return { message: "success" };
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message );
                    return err;
                });
        },

        remove: function( modelLocation ) {
            var _logger = logger( "DB_OPS.remove" );

            _logger.info( "modelLocation: " + modelLocation );

            return db.ref( modelLocation ).remove()
                .then( function() {
                    _logger.info( "Removed data successfully" );
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message );
                    return err;
                });
        },
    };

    return _obj;
})( window.firebaseDb, window.DB_SCHEMAS, window.UTILS, window.LOGGER ));