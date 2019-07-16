$(document).ready(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyCUcH5ibC9EUc2JBDfS8zprT9ccnOgxRhk",
        authDomain: "pack-your-bag-project.firebaseapp.com",
        databaseURL: "https://pack-your-bag-project.firebaseio.com",
        projectId: "pack-your-bag-project",
        storageBucket: "",
        messagingSenderId: "604698367094",
        appId: "1:604698367094:web:a6470ea0bcfd991e"
    };

    firebase.initializeApp(firebaseConfig);

    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    
    
    $('#newAccount').on('click', function(event) {
        event.preventDefault();

        ui.start('#firebaseui-auth-container', {
            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                  // User successfully signed in.
                  // Return type determines whether we continue the redirect automatically
                  // or whether we leave that to developer to handle.
                  console.log('signed in')
                  return false;
                },
                uiShown: function() {
                  // The widget is rendered.
                  // Hide the loader.
                  // document.getElementById('loader').style.display = 'none';
                }
              },
          });
    })
}) 
   
