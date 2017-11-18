This folder contains all the __javascript__ files interacting with the database. Various APIs can be found in their own folder such as:

1. __DB_OPS__ from __/db-ops.js__
2. __AUTH_OPS__ from __/auth-ops.js__

<br />
<br />

__\_dbconfig.js__

This is a special kind of file that contains important configuration for Firebase. To protect this db information, __this file is not committed to Github__, every developer is encouraged to create their own dummy Firebase database to play around with. Follow below steps to create this file:

1. Go to [Firebase](https://firebase.google.com/ "Firebase")'s official website
2. Create free account
3. Add a project, give it any name
4. In your project console, click on "Add Firebase to your web app"
5. A pop-up window will appear, copy all the values inside the `config` object
6. Create __\_dbconfig.js__ in the folder `static/js/backend/` which will look something like this:

```
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

### Author
[Navdeep Bagga](http://www.navdeepsb.com "Navdeep's online portfolio")