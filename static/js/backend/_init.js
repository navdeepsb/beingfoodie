/**
 *   @desc This module initializes the backend
 * @author Navdeep
 **/


((function( firebase, logger ) {
    // Initialize Firebase:
    window.firebaseApp  = firebase.initializeApp( window.FIREBASE_CONFIG );
    window.firebaseAuth = firebaseApp.auth();
    window.firebaseDb   = firebaseApp.database();

    // Set up logging:
    var _logger = logger( "_init" );

    _logger.info( "Backend started..." );

    // Set up the auth persistence:
    var PERSISTENCE_TYPE = firebase.auth.Auth.Persistence.SESSION;
    window.firebaseAuth.setPersistence( PERSISTENCE_TYPE );
    _logger.info( "Setting-up auth persistence as '" + PERSISTENCE_TYPE + "'" );

    _logger.info( "Adios! And reap responsibly..." );
})( window.firebase, window.LOGGER ));