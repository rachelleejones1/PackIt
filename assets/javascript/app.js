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

$("#submit").click(function () {
    event.preventDefault();
    webcamSearch();
})

function webcamSearch() {
    let destination = $("#country").val().trim();
    let queryURL = "https://webcamstravel.p.rapidapi.com/webcams/list/country=" + destination + "?show=webcams:image,player"
    $.ajax({
        headers: {
            "X-RapidAPI-Host": "webcamstravel.p.rapidapi.com",
            "X-RapidAPI-Key": "27c7e87c7dmshda62b4854259734p18e751jsn4a9528e072f1",
            },
        data:"data",
        method: "GET",
        url: queryURL,
        success: function(response){
            $("#webcam").html('');
            $("#webcam").append("<h3 class='text center'>Click image to view webcam</h3>");
            for (var i=0; i<4; i++){
                var webcam = response.result.webcams[i].image.daylight.preview;
                var link = response.result.webcams[i].player.day.link;
                var newDiv = $("<div>");
                $(newDiv).append("<a href='"+link+"' target='_blank''><img src='" + webcam +"'></a>");
                $(newDiv).attr('id', 'web-img')
                $("#webcam").append(newDiv);

           }
        }
    })
}
