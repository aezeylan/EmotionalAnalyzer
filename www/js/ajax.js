/* check scroll function */
function messagePost() {
   $('#button_send').on('tap',function(){

    var message = $('#text').val();
    var data = '{"text": "'+message+'"}';

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
  
    console.log(response);
      message = $('#text').val();
      var splitted = message.replace(/(?:\r\n|\r|\n)/g, '.');
      var partsOfStr = splitted.split('.');
      var list = '<ul data-role="listview" id="list">';
      for (var i = partsOfStr.length - 1; i >= 0; i--) {
         if(partsOfStr[i] != ""){
            list += '<li>'+partsOfStr[i]+'</li>';
         }
      }
      list += '</ul>';

      $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"> <a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close panel</a><h2>Grafiek</h2></div><div class="graph-holder"><canvas id="graph"></canvas></div><div class="list-holder">'+list+'</div></div>').insertAfter('#settings');
      $('#resultAnalyse').animate({'top':'0'},300);  
      createChart();

  $('#close_details').on('tap',function(){
       $('#resultAnalyse').animate({'top':'-100%'},300).remove();  
       $('#text').val('');
  });
}

function createChart() {
     var data = [
          {
              value: 300,
              color:"#F7464A",
              highlight: "#FF5A5E",
              label: "Red"
          },
          {
              value: 50,
              color: "#46BFBD",
              highlight: "#5AD3D1",
              label: "Green"
          },
          {
              value: 100,
              color: "#FDB45C",
              highlight: "#FFC870",
              label: "Yellow"
          }
      ];    
      var myDoughnutChart = new Chart(document.getElementById("graph").getContext("2d")).Doughnut(data);
}

$(document).on('ready', function(){
  messagePost();
  // getResults();
});