var DB_OPS = ((function( db, db_schemas, logger ) {

    var _logger = logger( "DB_OPS" );

    var _obj = {
        upsert: function( modelStore, data, modelSchema ) {
            return db.ref( modelStore ).once( "value" )
                .then( function( snapshot ) {
                    try {
                        var childRef   = snapshot.child( data._key || "-empty-" );
                        var oldData    = childRef.val(); // will be `null` if not found
                        var isUpdateOp = childRef.exists();
                        var dataToSend = db_schemas[ modelSchema ]();

                        // Append the key to make it an update operation:
                        dataToSend._key = isUpdateOp ? dataToSend._key : db.ref( modelStore ).push().key;

                        // Inherit schema attributes:
                        Object.keys( dataToSend ).forEach( function( k ) {
                            if( data[ k ] ) {
                                dataToSend[ k ] = data[ k ];
                            }
                        });

                        _logger.info( "modelStore:" + modelStore + "; modelSchema:" + modelSchema + "; dataToSend:\n" + JSON.stringify( dataToSend, null, 4 ) );

                        // db_operation:
                        db.ref( modelStore + "/" + dataToSend._key ).update( dataToSend );

                        return {
                            newData: dataToSend,
                            oldData: oldData,
                            isUpdateOp: isUpdateOp
                        };
                    }
                    catch( ex ) {
                        _logger.info( "Error occurred!" + JSON.stringify( ex.stack, null, 4 ) );
                    }
                });
        }
    };

    return _obj;
})( window.firebaseDb, window.DB_SCHEMAS, window.LOGGER ));