/**
 *   @desc The module for various authentication operations.
 *         This module is used in the BACKEND_API module and is not
 *         intended to be used directly, rather only through the
 *         BACKEND_API interface.
 * @author Navdeep
 **/


var AUTH_OPS = ((function( auth, DB_OPS, UTILS, logger ) {
    var _obj = {
        loginUser: function( data ) {
            var _logger = logger( "AUTH_OPS.loginUser" );

            return auth.signInWithEmailAndPassword( data.email, data.password )
                .then( function( firebaseUser ) {
                    if( firebaseUser ) {
                        _logger.info( "Proceeding to fetch user info from db w/ email: " + data.email );

                        // Get this user from the db, check if it exists or not:
                        return DB_OPS.get( "users/" + UTILS.formatEmailAsKey( data.email ) );
                    }
                })
                .then( function( fromDb ) {
                    if( UTILS.decrypt( fromDb.password ) === data.password ) {
                        _logger.info( "Successfully logged in user with email: " + fromDb.email );
                        return fromDb;
                    }

                    _logger.info( "User with email: " + fromDb.email + " not found in the db" );
                    return {
                        error: "error",
                        message: "User not found in DB."
                    };
                })
                .catch( function( err ) {
                    _logger.info( "[error: " + err.code + "] " + err.message + " Email: " + data.email );
                    return err;
                });
        },

        signupUser: function( data ) {
            var _logger = logger( "AUTH_OPS.signupUser" );

            return auth.createUserWithEmailAndPassword( data.email, data.password )
                .then( function( firebaseUser ) {
                    if( firebaseUser ) {
                        _logger.info( "Proceeding to add this user to database w/ email: " + data.email );

                        data.uid = firebaseUser.uid;
                        return DB_OPS.upsert( "/users/" + UTILS.formatEmailAsKey( data.email ), data, "user" );
                    }
                })
                .then( function( fromDb ) {
                    _logger.info( "Successfull data transaction: " + JSON.stringify( fromDb, null, 4 ) );
                    return fromDb.newData;
                })
                .catch( function( err ) {
                    _logger.info( "[error " + err.code + "] " + err.message + " Email: " + data.email );
                    return err;
                });
        },

        logoutUser: function() {
            var _logger = logger( "DB_OPS.logoutUser" );

            _logger.info( "Log out request for '" + ( auth.currentUser && auth.currentUser.email ) + "' started" );

            return auth.signOut()
                .then( function() {
                    _logger.info( "User logged out successfully" );
                    return { message: "success" };
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message );
                    return err;
                });
        },

        removeUser: function() {
            var _logger = logger( "DB_OPS.removeUser" );
            var currentUserEmail = auth.currentUser && auth.currentUser.email;

            if( auth.currentUser ) {
                _logger.info( "Delete request for '" + currentUserEmail + "' started" );

                return auth.currentUser.delete()
                    .then( function() {
                        _logger.info( "User removed from auth table, proceeding to remove from database" );

                        return DB_OPS.remove( "users/" + UTILS.formatEmailAsKey( currentUserEmail ) );
                    })
                    .then( function() {
                        _logger.info( "User removed from database successfully too" );
                        return { message: "success" };
                    })
                    .catch( function( err ) {
                        _logger.info( "[error" + err.code + "] " + err.message );
                        return err;
                    });
            }
            else {
                _logger.info( "User info not found in session, could not delete user" );
            }
        },

        isUserLoggedIn: function( userEmail ) {
            var _logger = logger( "DB_OPS.isUserLoggedIn" );
            var currentUserEmail = auth.currentUser && auth.currentUser.email;
            _logger.info( "In session: " + currentUserEmail + "; To match: " + userEmail );
            return currentUserEmail === userEmail;
        },

        getCurrentUserEmail: function( formatAsKey ) {
            var _logger = logger( "DB_OPS.getCurrentUserEmail" );
            var currentUserEmail = auth.currentUser && auth.currentUser.email;
            _logger.info( "In session: " + currentUserEmail );
            return formatAsKey && currentUserEmail ? UTILS.formatEmailAsKey( currentUserEmail ) : currentUserEmail;
        },

        updateCurrentUserEmail: function( newUserEmail ) {
            var _logger = logger( "DB_OPS.updateCurrentUserEmail" );

            return auth.currentUser.updateEmail( newUserEmail )
                .then( function() {
                    _logger.info( "User email updated successfully" );
                    return { message: "success" };
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message );
                    return err;
                });
        },

        updateCurrentUserPassword: function( newUserPassword ) {
            var _logger = logger( "DB_OPS.updateCurrentUserPassword" );

            return auth.currentUser.updatePassword( newUserPassword )
                .then( function() {
                    _logger.info( "User password updated successfully" );
                    return { message: "success" };
                })
                .catch( function( err ) {
                    _logger.info( "[error" + err.code + "] " + err.message );
                    return err;
                });
        }
    };

    return _obj;
})( window.firebaseAuth, window.DB_OPS, window.UTILS, window.LOGGER ));