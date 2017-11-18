window.firebaseApp  = firebase.initializeApp( FIREBASE_CONFIG );
window.firebaseAuth = firebaseApp.auth();
window.firebaseDb   = firebaseApp.database();