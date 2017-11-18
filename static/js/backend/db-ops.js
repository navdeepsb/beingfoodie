var DB_OPS = ((function( db, DB_SCHEMAS, logger ) {


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
            var _logger = logger( "DB_OPS.updateValue" );

            _logger.info( "modelLocation: " + modelLocation );

            return db.ref( modelLocation ).set( newValue )
                .then( function() {
                    _logger.info( "Updated successfully" );
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
})( window.firebaseDb, window.DB_SCHEMAS, window.LOGGER ));