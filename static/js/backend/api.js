/**
 *   @desc The backend API interface
 * @author Navdeep
 *  @usage window.BACKEND_API.users.login( "navdeepsb@example.com", "abc@123" )
 *             .then( function( response ) {
 *                 console.log( resoponse );
 *             });
 **/


window.BACKEND_API = ((function( AUTH_OPS, DB_OPS, UTILS, logger ) {
    var _obj = {};
    var _logger = logger( "BACKEND_API" );

    // User operations:
    _obj[ "users" ] = {
        login: function( email, password ) {
            /**
             * Queries the email & password with the db:
             *     - Returns user db object if values are correct
             *     - Returns error object if values are incorrect
             *     - Adds user info to the current auth session
             **/
            _logger.info( "users.login" );
            return AUTH_OPS.loginUser({ email: email, password: password });
        },
        signup: function( username, email, password ) {
            /**
             * Adds the user info in database:
             *     - Returns user db object
             *     - Returns error object if email is not unique
             *     - Adds user info to the current auth session
             **/
            _logger.info( "users.signup" );
            return AUTH_OPS.signupUser({ username: username, email: email, password: password });
        },
        logout: function() {
            /**
             * Logs the current user out
             *     - Returns success obj
             **/
            _logger.info( "users.logout" );
            return AUTH_OPS.logoutUser();
        },
        getCurrentUserEmailFromSession: function() {
            /**
             * Returns the email address of the user currently logged-in, otherwise undefined
             **/
            _logger.info( "users.getCurrentUserEmailFromSession" );
            return AUTH_OPS.getCurrentUserEmail();
        },
        getCurrentUserInfoFromDb: function() {
            /**
             * Returns the user info of currently logged-in user
             **/
            _logger.info( "users.getCurrentUserInfoFromDb" );

            var currentUserEmail = this.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            _logger.info( "currentUserEmail: " + currentUserEmail );

            return DB_OPS.get( "users/" + UTILS.formatEmailAsKey( currentUserEmail ) );
        },
        getByEmail: function( email ) {
            /**
             * Returns the user info by matching the email address
             **/
            _logger.info( "users.getByEmail " + email );

            return DB_OPS.get( "users/" + UTILS.formatEmailAsKey( email ) );
        },
        getAll: function() {
            /**
             * Returns all users
             **/
            _logger.info( "users.getAll" );

            return DB_OPS.get( "users/" )
                .then( function( response ) {
                    return Object.keys( response ).map( function( k ) {
                        return response[ k ];
                    });
                });
        },
        modifyCurrentUser: function( updateObj ) {
            /**
             * Modifies the current user
             *     - Returns success obj
             **/
            _logger.info( "users.modifyCurrentUser" );

            var _chain = window.Promise.resolve( {} ).then( function( o ) { return o; } );

            if( !AUTH_OPS.getCurrentUserEmail( true ) ) {
                _logger.info( "User info not found in session, could not modify user" );

                return _chain.then( function() {
                    return { message: "User info not in session, could not modify" };
                });
             }

            _logger.info( "updateObj: " + JSON.stringify( updateObj, null, 4 ) );

            Object.keys( updateObj ).forEach( function( k ) {

                // Handle password update:
                if( k === "password" ) {
                    AUTH_OPS.updateCurrentUserPassword( updateObj[ k ] );
                }

                _chain = _chain.then( function() {
                    var _p = DB_OPS.updateValue( "users/" + AUTH_OPS.getCurrentUserEmail( true ) + "/" + k, updateObj[ k ] );

                    // Also update email in the session:
                    if( k === "email" ) {
                        _p = _p.then( function() {
                            return AUTH_OPS.updateCurrentUserEmail( updateObj[ k ] );
                        });
                    }

                    return _p;
                });
            });

            return _chain;
        },
        removeCurrentUser: function() {
            /**
             * Removes the current user
             *     - Returns success obj
             **/
            return AUTH_OPS.removeUser();
        }
    };

    // Recipe operations:
    _obj[ "recipes" ] = {
        add: function( name, desc, type, culturalOrigin, ingredients ) {
            /**
             * Adds a recipe for the current user
             **/
            _logger.info( "recipes.add" );

            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't add recipe for them" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            _logger.info( "currentUserEmail: " + currentUserEmail );

            var _data = {
                id: UTILS.getUniqueIdentifier(),
                name: name,
                description: desc,
                type: type,
                culturalOrigin: culturalOrigin,
                ingredients: ingredients,
                createdBy: currentUserEmail
            };

            var modelLocation = "users/" + UTILS.formatEmailAsKey( currentUserEmail ) + "/recipes/" + _data.id;

            _logger.info( "Recipe will be added at " + modelLocation );

            return DB_OPS.upsert( modelLocation, _data, "recipe" );
        },
        modify: function( recipeId, updateObj ) {
            /**
             * Modifies the recipe for the current user
             **/
            _logger.info( "recipes.modify" );

            var _chain = window.Promise.resolve( {} ).then( function( o ) { return o; } );
            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't modify recipe for them" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            _logger.info( "currentUserEmail: " + currentUserEmail );

            Object.keys( updateObj ).forEach( function( k ) {
                _chain = _chain.then( function() {
                    return DB_OPS.updateValue( "users/" + UTILS.formatEmailAsKey( currentUserEmail ) + "/recipes/" + recipeId + "/" + k, updateObj[ k ] );
                });
            });

            return _chain;
        },
        remove: function( recipeId ) {
            /**
             * Removes a recipe
             *     - Returns success obj
             **/
            _logger.info( "recipes.remove" );

            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't delete recipe for them" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            return DB_OPS.remove( "users/" + UTILS.formatEmailAsKey( currentUserEmail ) + "/recipes/" + recipeId );
        },
        incrementUpvote: function( ownerEmail, recipeId, isDecrOp ) {
            /**
             * Increments/decrements upvote count of the recipe
             **/
            _logger.info( "recipes." + ( isDecrOp ? "decrementUpvote" : "incrementUpvote" ) );

            var modelLocation = ""
            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't change vote" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            if( ownerEmail === currentUserEmail ) {
                // User trying to upvote their recipe, disallow:
                _logger.info( "User trying to change thier own recipe's upvote, email: " + currentUserEmail );
                return window.Promise.resolve( { message: "User trying to change thier own recipe's upvote" } );
            }

            modelLocation = "users/" + UTILS.formatEmailAsKey( ownerEmail ) + "/recipes/" + recipeId + "/numUpvotes";
            _logger.info( "Updating at this location: " + modelLocation );

            return DB_OPS.get( modelLocation )
                .then( function( numUpvotes ) {
                    return DB_OPS.updateValue( modelLocation, isDecrOp ? --numUpvotes : ++numUpvotes );
                });
        },
        decrementUpvote: function( ownerEmail, recipeId ) {
            return this.incrementUpvote( ownerEmail, recipeId, true );
        },
        getRecipesByUserEmail: function( email, recipeId ) {
            /**
             * Returns a recipe created by the user w/ provided email
             **/
            _logger.info( "recipes.getRecipesByUserEmail" );

            if( !email ) {
                _logger.info( "No email provided" );
                return window.Promise.resolve( { message: "No email provided" } );
            }

            _logger.info( "email: " + email );

            return DB_OPS.get( "users/" + UTILS.formatEmailAsKey( email ) + "/recipes" + ( recipeId ? "/" + recipeId : "" ) )
                .then( function( response ) {
                    if( !response ) return {};
                    if( recipeId ) return response;
                    return Object.keys( response ).map( function( k ) {
                        return response[ k ];
                    });
                });
        },
        getAll: function() {
            /**
             * Gets all the recipes in the db
             **/
            _logger.info( "recipes.getAll" );

            var _chain = window.Promise.resolve( {} );
            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            return _chain
                .then( function() {
                    return DB_OPS.get( "users/" );
                })
                .then( function( users ) {
                    var _allRecipes = [];

                    Object.keys( users ).forEach( function( k ) {
                        var _recipes = users[ k ].recipes;
                        if( _recipes ) {
                            Object.keys( _recipes ).forEach( function( k ) {
                                _allRecipes.push( _recipes[ k ] );
                            });
                        }
                    });

                    return _allRecipes;
                });
        }
    };

    // Comment operations:
    _obj[ "comments" ] = {
        add: function( recipeOwnerEmail, recipeId, commentText ) {
            /**
             * Adds a comment for the current user in the recipe provided
             **/
            _logger.info( "comments.add" );

            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't add comment" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            _logger.info( "currentUserEmail: " + currentUserEmail );

            var _data = {
                id: UTILS.getUniqueIdentifier(),
                text: commentText,
                createdBy: currentUserEmail
            };

            var modelLocation = "users/" + UTILS.formatEmailAsKey( recipeOwnerEmail ) + "/recipes/" + recipeId + "/comments/" + _data.id;

            _logger.info( "Comment will be added at " + modelLocation );

            return DB_OPS.upsert( modelLocation, _data, "comment" );
        },
        modify: function( recipeOwnerEmail, recipeId, commentId, newCommentText ) {
            /**
             * Modifies the comment for the current user
             **/
            _logger.info( "comments.modify" );

            var modelLocation = "users/" + UTILS.formatEmailAsKey( recipeOwnerEmail ) + "/recipes/" + recipeId + "/comments/" + commentId;
            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't modify comment" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            _logger.info( "currentUserEmail: " + currentUserEmail );
            _logger.info( "modelLocation: " + modelLocation );

            return DB_OPS.updateValue( modelLocation + "/lastModifiedOn", Date.now() )
                .then( function() {
                    return DB_OPS.updateValue( modelLocation + "/text", newCommentText )
                });
        },
        remove: function( recipeOwnerEmail, recipeId, commentId ) {
            /**
             * Removes a comment
             *     - Returns success obj
             **/
            _logger.info( "comments.remove" );

            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't delete comment" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            return DB_OPS.remove( "users/" + UTILS.formatEmailAsKey( recipeOwnerEmail ) + "/recipes/" + recipeId + "/comments/" + commentId );
        },
        incrementUpvote: function( recipeOwnerEmail, recipeId, commentId, isDecrOp ) {
            /**
             * Increments/decrements upvote count of the comment
             **/
            _logger.info( "comments." + ( isDecrOp ? "decrementUpvote" : "incrementUpvote" ) );

            var modelLocation = ""
            var currentUserEmail = _obj.users.getCurrentUserEmailFromSession();

            if( !currentUserEmail ) {
                _logger.info( "The user is not logged in, can't change vote for comment" );
                return window.Promise.resolve( { message: "The user is not logged in" } );
            }

            // if( recipeOwnerEmail === currentUserEmail ) {
            //     // User trying to upvote their recipe, disallow:
            //     _logger.info( "User trying to change thier own comment's upvote, email: " + currentUserEmail );
            //     return window.Promise.resolve( { message: "User trying to change thier own recipe's upvote" } );
            // }

            modelLocation = "users/" + UTILS.formatEmailAsKey( recipeOwnerEmail ) + "/recipes/" + recipeId + "/comments/" + commentId + "/numUpvotes";
            _logger.info( "Updating at this location: " + modelLocation );

            return DB_OPS.get( modelLocation )
                .then( function( numUpvotes ) {
                    return DB_OPS.updateValue( modelLocation, isDecrOp ? --numUpvotes : ++numUpvotes );
                });
        },
        decrementUpvote: function( recipeOwnerEmail, recipeId, commentId ) {
            return this.incrementUpvote( recipeOwnerEmail, recipeId, commentId, true );
        },
        getCommentsByRecipe: function( recipeOwnerEmail, recipeId ) {
            /**
             * Returns a recipe created by the user w/ provided email
             **/
            _logger.info( "comments.getCommentsByRecipe" );

            var modelLocation = "users/" + UTILS.formatEmailAsKey( recipeOwnerEmail ) + "/recipes/" + recipeId + "/comments";

            return DB_OPS.get( modelLocation )
                .then( function( response ) {
                    return Object.keys( response ).map( function( k ) {
                        return response[ k ];
                    });
                });
        }
    };

    return _obj;
})( window.AUTH_OPS, window.DB_OPS, window.UTILS, window.LOGGER ));