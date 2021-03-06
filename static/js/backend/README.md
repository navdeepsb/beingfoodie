## Backend

This folder contains all the __javascript__ files interacting with the database. Various APIs can be found in the __api.js__ file

<br />
<br />
<br />

### Usage

```javascript
window.BACKEND_API.users.login( "navdeepsb@example.com", "abc@123" )
    .then( function( response ) {
        // `response` will be a JSON containing
        // the server's response
        // ...
    });
```

<br />
<br />
<br />

### APIs available

All of the APIs below return a "thenable" promise and most of them rely on user info from the current session (REST implementation)

__User operations:__

1. `window.BACKEND_API.users.login( email, password )`
2. `window.BACKEND_API.users.signup( username, email, password )`
3. `window.BACKEND_API.users.logout()`
4. `window.BACKEND_API.users.getCurrentUserEmailFromSession()`
5. `window.BACKEND_API.users.getCurrentUserInfoFromDb()`
6. `window.BACKEND_API.users.getByEmail( email )`
7. `window.BACKEND_API.users.getAll()`
8. `window.BACKEND_API.users.modifyCurrentUser({ email: newEmail, password: newPassword, username: newUsername, ... })`
9. `window.BACKEND_API.users.removeCurrentUser()`

__Recipe operations__

1. `window.BACKEND_API.recipes.add( name, desc, type, culturalOrigin, ingredients )`
2. `window.BACKEND_API.recipes.modify( recipeId, updateObj )`
3. `window.BACKEND_API.recipes.remove( recipeId )`
4. `window.BACKEND_API.recipes.incrementUpvote( recipeOwnerEmail, recipeId )`
5. `window.BACKEND_API.recipes.decrementUpvote( recipeOwnerEmail, recipeId )`
6. `window.BACKEND_API.recipes.getRecipesByUserEmail( email )`
7. `window.BACKEND_API.recipes.getAll()`

__Comment operations__

1. `window.BACKEND_API.comments.add( recipeOwnerEmail, recipeId, commentText )`
2. `window.BACKEND_API.comments.modify( recipeOwnerEmail, recipeId, commentId, newCommentText )`
3. `window.BACKEND_API.comments.remove( recipeOwnerEmail, recipeId, commentId )`
4. `window.BACKEND_API.comments.incrementUpvote( recipeOwnerEmail, recipeId, commentId )`
5. `window.BACKEND_API.comments.decrementUpvote( recipeOwnerEmail, recipeId, commentId )`
6. `window.BACKEND_API.comments.getCommentsByRecipe( recipeOwnerEmail, recipeId )`

<br />
<br />
<br />

### \_dbconfig.js

This is a special kind of file that contains important configuration for Firebase. To protect this db information, __this file is not committed to Github__, every developer is encouraged to create their own dummy Firebase database to play around with. Follow below steps to create this file:

1. Go to [Firebase](https://firebase.google.com/ "Firebase")'s official website
2. Create free account
3. Add a project, give it any name
4. In your project console, click on "Add Firebase to your web app"
5. A pop-up window will appear, copy all the values inside the `config` object
6. Create __\_dbconfig.js__ in the folder `static/js/backend/` which will look something like this:

```javascript
window.FIREBASE_CONFIG = {
    apiKey: "...paste here...",
    authDomain: "...paste here...",
    databaseURL: "...paste here...",
    projectId: "...paste here...",
    storageBucket: "...paste here...",
    messagingSenderId: "...paste here..."
  };
```

<br />
<br />
<br />

### Author
[Navdeep Bagga](http://www.navdeepsb.com "Navdeep's online portfolio")