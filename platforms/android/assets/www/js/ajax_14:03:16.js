/* check scroll function */
function postRedirect() {
   $('#button_send').on('tap',function(event){
    event.preventDefault();
    // var message = $('#text').val();
    // $.ajax({
    //     url: "details.html",
    //     type: "post",
    //     data: message,
    //     success: function (response) {
    //        // you will get response from your php page (what you echo or print)                 
    //        console.log(response);
    //        $('body').html(response);
    //        // messagePost(message);

    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //        console.log(textStatus, errorThrown);
    //     }
    // });

  });
}

/* check scroll function */
function messagePost(message) {

    var data = '{"text": "'+message+'"}';
    // route url aangepast naar /analyzer/analyze
    $.ajax({
        url: "https://emotionanalyzer.herokuapp.com/analyzer",
        type: "post",
        contentType: "application/json",
        data: data,
        success: function (response) {
           // you will get response from your php page (what you echo or print)                 
           console.log(response);
           getResults(response); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
}

function getResults(response) {

      message = response.text;
      console.log();
      var splitted = message.replace(/(?:\r\n|\r|\n)/g, '.');
      var partsOfStr = splitted.split('.');
      var list = '<ul data-role="listview" id="list">';
      for (var i = partsOfStr.length - 1; i >= 0; i--) {
         if(partsOfStr[i] != ""){
            list += '<li>'+partsOfStr[i]+'</li>';
         }
      }
      list += '</ul>';
      
      values = response.analysis.document_tone.tone_categories[0].tones;
      createChart(values);

      $('.list-holder').append(list);
}

function createChart(values) {
    //chartdata
    var createJSON;
    var colors = [ "red", "yellow", "black", "green", "blue"];

    data = [];

    for (var i = 0; i < values.length; i++) {
      createJSON = {};
      createJSON["value"] = values[i].score*100;
      createJSON["color"] = colors[i];
      createJSON["highlight"] = colors[i];
      createJSON["label"] = values[i].tone_name;

       console.log(createJSON);
       data.push(createJSON);
      
    }
    console.log(data);
    var myDoughnutChart = new Chart(document.getElementById("graph").getContext("2d")).Doughnut(data);
}

$(document).on('ready', function(){
    postRedirect();

});

// $(document).on("pagebeforecreate", "#details",function(){
//     // messagePost();
//     // $('#home, #info, #history').remove();
//     alert('demo');
// });

// $(document).on("pagebeforecreate", "#home",function(){
//     // messagePost();
//     $('#details').remove();
//     alert('wqd');
//      // postRedirect();
// });

// $(document).on("pagecreate",function(){
  
// });

