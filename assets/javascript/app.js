$("#submit").click(function () {
    event.preventDefault();
    webcamSearch();
})

function webcamSearch() {
    let destination = $("#search").val().trim();
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

            for (var i=0; i<4; i++){
                var webcam = response.result.webcams[i].image.daylight.preview;
                $("#webcam").append("<img src='" + webcam +"'>");
           }
        }
    })
}
