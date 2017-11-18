window.firebaseApp  = firebase.initializeApp( window.FIREBASE_CONFIG );
window.firebaseAuth = firebaseApp.auth();
window.firebaseDb   = firebaseApp.database();


((function( firebase, auth, logger ) {
    // Set up logging:
    var _logger = logger( "_init" );

    // Set up the auth persistence:
    auth.setPersistence( firebase.auth.Auth.Persistence.SESSION );
    _logger.info( "Setting-up auth persistence as '" + firebase.auth.Auth.Persistence.SESSION + "'" );

    // Set up auth state change callback:
    auth.onAuthStateChanged( function( currentUser ) {
        if( currentUser ) {
            _logger.info( "User logged in w/ email: " + currentUser.email );
        }
        else {
            _logger.info( "User not logged in anymore" );
        }
    });
})( window.firebase, window.firebaseAuth, window.LOGGER ));