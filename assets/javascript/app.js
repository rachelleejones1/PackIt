$(document).ready(function() {
    let firebaseConfig = {
        apiKey: "AIzaSyCUcH5ibC9EUc2JBDfS8zprT9ccnOgxRhk",
        authDomain: "pack-your-bag-project.firebaseapp.com",
        databaseURL: "https://pack-your-bag-project.firebaseio.com",
        projectId: "pack-your-bag-project",
        storageBucket: "",
        messagingSenderId: "604698367094",
        appId: "1:604698367094:web:a6470ea0bcfd991e"
    };

    firebase.initializeApp(firebaseConfig);
    

   /*
    let ui = new firebaseui.auth.AuthUI(firebase.auth());

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
                  console.log(authResult);
                  console.log('signed in')
                  $('.modal').modal('close');
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

    $('#signOut').on('click', function(event) {
        event.preventDefault();
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('signed out')
          }).catch(function(error) {
            // An error happened.
            console.log('error while signing out');
          });
    })
    */

    let database = firebase.database().ref('items');
    let toDoArray = [];
    let keyNames = [];

    



    $('#add-to-list').on('click', function(event) {
        event.preventDefault();
        let itemName = $("#add-this-item").val().trim();
        $('#add-this-item').val('');
        if (toDoArray.includes(itemName) === false) {
            database.push(
                itemName
            );
        }
    });

    database.on('child_added', function(snap) {
        console.log(snap);
        let newItem = snap.val();
        console.log(newItem);
        let itemKey = snap.key;
        console.log(itemKey);
        keyNames.push(itemKey);
        toDoArray.push(newItem);
        displayItems(toDoArray);
    });


    $(document.body).on("click", ".deleteItem", function() {
        let toPackNumber = $(this).attr("data-to-do");
        database.child(keyNames[toPackNumber]).remove();
        toDoArray.splice(toPackNumber, 1);
        keyNames.splice(toPackNumber, 1);
        console.log(toDoArray);
        console.log(keyNames);
        displayItems(toDoArray);
        }); 

}) 


function displayItems(arr) {
    $('#displayList').html('');
    for (let j = 0; j < arr.length; j++) {
        let newLi = $('<li>').addClass('collection-item').attr('id', 'item-' + j).text(arr[j]);
        let button = $("<button>").attr({ "data-to-do": j, "class": "deleteItem" }).text('x');
        newLi.append(button);
        $('#displayList').append(newLi);
      }
}





/*

<li class="collection-item" id="add-item"></li>

authResult.user.uid

var toPackCount = 0;
var toPackArray = [];

if(localStorage.getItem("list") !== null) {
    todDoArray = JSON.parse(localStorage.getItem("list"));
    updateList(toPackArray);
    console.log(toPackArray);
  }

  $(document).ready(function() {
    M.updateTextFields();
  });

    $(document).on("click", "#add-to-list", function(event) {
      event.preventDefault();
      var toPackItem = $("#add-this-item").val().trim(); 
      $('#add-this-item').val('');
      toPackArray.push(toPackItem);
      console.log(toPackArray);
      localStorage.setItem("list", JSON.stringify(toPackArray));
      JSON.parse(localStorage.getItem("list"));
      updateList(toPackArray); 
      toPackCount++;
    });

    function updateList(arr) {
      $("#add-item").html("");
      for (var i = 0; i < arr.length; i++) {
        var newLi = $("<li>").attr("id", "item-" + i).text(arr[i]);
        var button = $("<button>").attr({ "data-to-do": i, "class": "checkbox" }).text('x');
        var newItem = newLi.prepend(button);
        $("#add-item").append(newItem);
      }
    }

    localStorage.setItem("add-item", [])
 

    $(document.body).on("click", ".checkbox", function() {

    var toPackNumber = $(this).attr("data-to-do");

    $("#item-" + toPackNumber).remove();

    toDoArray.splice(toDoNumber, 1);
    localStorage.setItem("list", JSON.stringify(toPackArray));
    console.log(toPackArray);

    }); 
   */
