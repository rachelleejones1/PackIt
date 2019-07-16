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


      $("#add-this-item").val("");

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