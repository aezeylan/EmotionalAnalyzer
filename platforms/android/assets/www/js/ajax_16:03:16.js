/* check scroll function */
function messagePost() {
   $('#button_send').on('tap',function(event){
    event.preventDefault();
    var message = $('#text').val();
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

      $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graph"></canvas></div><div class="list-holder">'+list+'</div></div>').insertBefore('#home');
      $('#resultAnalyse').animate({'top':'0'},300);  
      
      values = response.analysis.document_tone.tone_categories[0].tones;
      createChart(values);

      $('.list-holder').append(list);

      $('#close_details').on('tap',function(){
           // $('#resultAnalyse').animate({'top':'-100%'},300).remove();  
           $('#text').val('');
      });
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
    messagePost();
});

