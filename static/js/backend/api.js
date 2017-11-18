// The backend API interface:
window.BACKEND_API = ((function( AUTH_OPS, DB_OPS, logger ) {
    var _obj = {};
    var _logger = logger( "BACKEND_API" );

    _obj[ "users" ] = {
        login: function( email, password ) {
            /**
             * Queries the email & password with the db:
             *     - Returns user db object if values are correct
             *     - Returns error object if values are incorrect
             *     - Adds user info to the current auth session
             **/
            return AUTH_OPS.loginUser({ email: email, password: password });
        },
        signup: function( username, email, password ) {
            /**
             * Adds the user info in database:
             *     - Returns user db object
             *     - Returns error object if email is not unique
             *     - Adds user info to the current auth session
             **/
            return AUTH_OPS.signupUser({ username: username, email: email, password: password });
        },
        logout: function() {
            /**
             * Logs the current user out
             *     - Returns success obj
             **/
            return AUTH_OPS.logoutUser();
        },
        getCurrentUserEmailFromSession: function() {
            /**
             * Returns the email address of the user currently logged-in, otherwise undefined
             **/
            return AUTH_OPS.getCurrentUserEmail();
        }
    };

    return _obj;
})( window.AUTH_OPS, window.DB_OPS, window.LOGGER ));