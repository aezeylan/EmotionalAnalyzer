/* check scroll function */
function messagePost() {
   $('#button_send').on('tap',function(event){
    event.preventDefault();

    var text = $('#text').val();
    var regex = /[^\r\n.!?]+(:?(:?\r\n|[\r\n]|[.!?])+|$)/gi;
    var split = text.match(regex).map($.trim);
    var message = split.join("\\n");
    var data = '{"text": "'+message+'"}';

    // route url aangepast naar /analyzer/analyze
    $.ajax({
        beforeSend: function() { $.mobile.loading("show") }, 
        complete: function() { $.mobile.loading("hide") },
        url: "https://emotionanalyzer.herokuapp.com/analyzer/analyze",
        type: "post",
        contentType: "application/json",
        data: data,
        success: function (response) {
           // you will get response from your php page (what you echo or print)                 
           console.log(response);
           // getResults(response); 
           showAnalyzedData(response,false, 0);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
  });
}

function filterToneScore(sort,array) {
  var score = 0;
  var tone = 0;
  for (var key in array) {
    if (array.hasOwnProperty(key)) {
      if(array[key][sort] > score)
      {
          score = array[key][sort];
          tone = array[key];
      }
    }
  }
  return tone;
}

function getResults(response) {
      settingsHistoryOn(response);
      // saveAnalyse(response);
      var list = '<ul data-role="listview" id="list">';
      var e_tone;
      var w_tone;
      var s_tone;
      var tone_result;
      var toneCategorie;
      var sentences = response.analysis.sentences_tone;
      
      if(sentences){
        for (var i = 0; i < sentences.length; i++) {
            toneCategorie  = sentences[i].tone_categories; 
            
            for (var j = 0; j < toneCategorie.length; j++) {
                if(j==0) {
                  e_tone = toneCategorie[j].tones;
                   for (var k = 0; k < e_tone.length; k++) {
                    e_tone[k].score;
                  }
                }
                if(j==1) {
                  w_tone = toneCategorie[j].tones;
                  for (var k = 0; k < w_tone.length; k++) {
                    w_tone[k].score;
                  }
                }
                if(j==2) {
                  s_tone = toneCategorie[j].tones;
                  for (var k = 0; k < s_tone.length; k++) {
                    s_tone[k].score;
                  }
                }   
            }

              list += '<li>';
              list += '<div class="sentence">'+sentences[i].text+'</div>';
              list += '<div class="emotion-tone"><img class="'+filterToneScore("score",e_tone).tone_name+'" src="">'+filterToneScore("score",e_tone).tone_name+" - " +Math.round(filterToneScore("score",e_tone).score*100)+'%</div>';
              list += '<div class="writing-tone"><img class="'+filterToneScore("score",w_tone).tone_name+'" src="">'+filterToneScore("score",w_tone).tone_name+" - " +Math.round(filterToneScore("score",w_tone).score*100)+'%</div>';
              list += '<div class="social-tone"><img class="'+filterToneScore("score",s_tone).tone_name+'" src="">'+filterToneScore("score",s_tone).tone_name+" - " +Math.round(filterToneScore("score",s_tone).score*100)+'%</div>';
              list += '</li>';
        }
        list += '</ul>';

        $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="list-holder">'+list+'</div></div>').insertBefore('#home');
        $('#resultAnalyse').animate({'top':'0'},300);  
        
        var e_category = response.analysis.document_tone.tone_categories[0].tones;
        var w_category = response.analysis.document_tone.tone_categories[1].tones;
        var s_category = response.analysis.document_tone.tone_categories[2].tones;
        createChart(e_category, w_category, s_category);
        

        $('#close_details').on('tap',function(){
             $('#resultAnalyse').animate({'top':'-100%'},300, function(){$(this).remove();});  
             $('#text').val('');
        });
    }else{
        $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="list-holder">'+response.text+'</div></div>').insertBefore('#home');
        $('#resultAnalyse').animate({'top':'0'},300);  
        
        var e_category = response.analysis.document_tone.tone_categories[0].tones;
        var w_category = response.analysis.document_tone.tone_categories[1].tones;
        var s_category = response.analysis.document_tone.tone_categories[2].tones;
        createChart(e_category, w_category, s_category);
        

        $('#close_details').on('tap',function(){
             $('#resultAnalyse').animate({'top':'-100%'},300, function(){$(this).remove();});  
             $('#text').val('');
        });
    }
}

function showHistoryDetails(analyse_id) {

    var localData = JSON.parse(window.localStorage.getItem(analyse_id));
    var list = '<ul data-role="listview" id="list">';
    var e_tone;
    var w_tone;
    var s_tone;
    var tone_result;
    var toneCategorie;
    var sentences = localData.analysis.sentences_tone;

    for (var i = 0; i < sentences.length; i++) {
      toneCategorie  = sentences[i].tone_categories; 
            
        for (var j = 0; j < toneCategorie.length; j++) {
            if(j==0) {
              e_tone = toneCategorie[j].tones;
                for (var k = 0; k < e_tone.length; k++) {
                e_tone[k].score;
              }
            }
            if(j==1) {
              w_tone = toneCategorie[j].tones;
              for (var k = 0; k < w_tone.length; k++) {
                w_tone[k].score;
              }
            }
            if(j==2) {
              s_tone = toneCategorie[j].tones;
              for (var k = 0; k < s_tone.length; k++) {
                s_tone[k].score;
              }
            }   
        }

        list += '<li>';
        list += '<div class="sentence">'+sentences[i].text+'</div>';
        list += '<div class="emotion-tone"><img class="'+filterToneScore("score",e_tone).tone_name+'" src="">'+filterToneScore("score",e_tone).tone_name+" - " + Math.round(filterToneScore("score",e_tone).score*100)+'%</div>';
        list += '<div class="writing-tone"><img class="'+filterToneScore("score",w_tone).tone_name+'" src="">'+filterToneScore("score",w_tone).tone_name+" - " +Math.round(filterToneScore("score",w_tone).score*100)+'%</div>';
        list += '<div class="social-tone"><img class="'+filterToneScore("score",s_tone).tone_name+'" src="">'+filterToneScore("score",s_tone).tone_name+" - " +Math.round(filterToneScore("score",s_tone).score*100)+'%</div>';
        list += '</li>';
    }
    list += '</ul>';

    $('.details.list-holder').append(list);

    var e_category = localData.analysis.document_tone.tone_categories[0].tones;
    var w_category = localData.analysis.document_tone.tone_categories[1].tones;
    var s_category = localData.analysis.document_tone.tone_categories[2].tones;
    createChart(e_category, w_category, s_category);

    $('#close_details').on('tap',function(){
       $.mobile.changePage('#history', { transition: "slide", reverse: true} );
       $('#details').remove();
    });
         
}

function showAnalyzedData(response,isHistory, analyse_id) {
  
    var analyzeType;

    if(isHistory == true){
      var localData = JSON.parse(window.localStorage.getItem(analyse_id));
      analyzeType = localData;
    }else{
      // settingsHistoryOn(response);
      saveAnalyse(response);
      analyzeType = response;
    }
      
    var list = '<ul data-role="listview" id="list">';

    var e_tone;
    var w_tone;
    var s_tone;
    var tone_result;
    var toneCategorie;
    var sentences = analyzeType.analysis.sentences_tone;
    var e_category = analyzeType.analysis.document_tone.tone_categories[0].tones;
    var w_category = analyzeType.analysis.document_tone.tone_categories[1].tones;
    var s_category = analyzeType.analysis.document_tone.tone_categories[2].tones;
    
      
    if(sentences){
      for (var i = 0; i < sentences.length; i++) {
        toneCategorie  = sentences[i].tone_categories;   
         for (var j = 0; j < toneCategorie.length; j++) {
            if(j==0) {
              e_tone = toneCategorie[j].tones;
              for (var k = 0; k < e_tone.length; k++) {
                e_tone[k].score;
              }
            }
            if(j==1) {
              w_tone = toneCategorie[j].tones;
              for (var k = 0; k < w_tone.length; k++) {
                w_tone[k].score;
              }
            }
            if(j==2) {
              s_tone = toneCategorie[j].tones;
              for (var k = 0; k < s_tone.length; k++) {
                s_tone[k].score;
              }
            }   
        }
            list += '<li>';
            list += '<div class="sentence">'+sentences[i].text+'</div>';
            list += '<div class="emotion-tone"><img class="'+filterToneScore("score",e_tone).tone_name+'" src="">'+filterToneScore("score",e_tone).tone_name+" - " +Math.round(filterToneScore("score",e_tone).score*100)+'%</div>';
            list += '<div class="writing-tone"><img class="'+filterToneScore("score",w_tone).tone_name+'" src="">'+filterToneScore("score",w_tone).tone_name+" - " +Math.round(filterToneScore("score",w_tone).score*100)+'%</div>';
            list += '<div class="social-tone"><img class="'+filterToneScore("score",s_tone).tone_name+'" src="">'+filterToneScore("score",s_tone).tone_name+" - " +Math.round(filterToneScore("score",s_tone).score*100)+'%</div>';
            list += '</li>';
        }
        list += '</ul>';

        if(isHistory == true){
           $('.details.list-holder').append(list);

           $('#close_details').on('tap',function(){
              $.mobile.changePage('#history', { transition: "slide", reverse: true} );
              $('#details').remove();
            });
        }else{
          $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="list-holder">'+list+'</div></div>').insertBefore('#home');
          $('#resultAnalyse').animate({'top':'0'},300); 

          $('#close_details').on('tap',function(){
               $('#resultAnalyse').animate({'top':'-100%'},300, function(){$(this).remove();});  
               $('#text').val('');
          }); 
        }


        createChart(e_category, w_category, s_category);

    }else{
        if(isHistory == true){
            $('.details.list-holder').append(list);

            $('#close_details').on('tap',function(){
               $.mobile.changePage('#history', { transition: "slide", reverse: true} );
               $('#details').remove();
            });
          }else{
            $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="list-holder">'+response.text+'</div></div>').insertBefore('#home');
            $('#resultAnalyse').animate({'top':'0'},300);  

            $('#close_details').on('tap',function(){
               $('#resultAnalyse').animate({'top':'-100%'},300, function(){$(this).remove();});  
               $('#text').val('');
            });
        }

        createChart(e_category, w_category, s_category);
        
    }

}

function createChart(e_category, w_category, s_category) {
    var createJSONA;
    var colorsA = [ "red", "purple", "green", "orange", "blue"];
    var colorsB = [ "cyan", "blue", "gray"];
    var colorsC = [ "red", "purple", "green", "orange", "blue"];

    var dataA = [];

    for (var i = 0; i < e_category.length; i++) {
      createJSONA = {};
      createJSONA["value"] = Math.round(e_category[i].score*100);
      createJSONA["color"] = colorsA[i];
      createJSONA["highlight"] = colorsA[i];
      createJSONA["label"] = e_category[i].tone_name;

       dataA.push(createJSONA); 
    }

    var createJSONB;
    var dataB = [];
    for (var i = 0; i < w_category.length; i++) {

      createJSONB = {};
      createJSONB["value"] = Math.round(w_category[i].score*100);
      createJSONB["color"] = colorsB[i];
      createJSONB["highlight"] = colorsB[i];
      createJSONB["label"] = w_category[i].tone_name;

       dataB.push(createJSONB); 
    }


    var createJSONC;
    var dataC = [];

    for (var i = 0; i < s_category.length; i++) {
      createJSONC = {};
      createJSONC["value"] = Math.round(s_category[i].score*100);
      createJSONC["color"] = colorsC[i];
      createJSONC["highlight"] = colorsC[i];
      createJSONC["label"] = s_category[i].tone_name;

       dataC.push(createJSONC); 
    }

    var doughnutOptions = {
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%> - <%=segments[i].value%>%</li><%}%></ul>"
    };
 
    var myDoughnutChartA = new Chart(document.getElementById("graphA").getContext("2d")).Pie(dataA, doughnutOptions);
    var myDoughnutChartB = new Chart(document.getElementById("graphB").getContext("2d")).Pie(dataB, doughnutOptions);
    var myDoughnutChartC = new Chart(document.getElementById("graphC").getContext("2d")).Pie(dataC, doughnutOptions);

    var legendA = myDoughnutChartA.generateLegend();
    var legendB = myDoughnutChartB.generateLegend();
    var legendC = myDoughnutChartC.generateLegend();

    $('#js-legendA').append(legendA);
    $('#js-legendB').append(legendB);
    $('#js-legendC').append(legendC);

}

function saveAnalyse(data) {
    var dataAnalyse = JSON.stringify(data);
    window.localStorage.setItem(data._id, dataAnalyse);
    addToHistory(data._id);
    // showAlert();
}

function showHistory() {
  var list = '<ul data-role="listview" id="list">';
  var sentences; 

  list += '</ul>';
  $('.history.list-holder').append(list);


  for (var analyseItem in localStorage) {
    addToHistory(analyseItem);
  }

  $('.show-details').on('tap' ,function(analyse_id){ 
    analyse_id = $(this).children('.analyse_id').attr('id');
    createDetailsPage();
    alert('demo');
    $.mobile.changePage('#details', { transition: "slide"} );
    // showHistoryDetails(analyse_id);
    showAnalyzedData(0,true, analyse_id);
  });
}

function addToHistory(analyse_id){
  //jquery append id=list 
  sentences = JSON.parse(localStorage[analyse_id]);
  var li = '<li><a href="#" class="show-details">' +
  '<div class="analyse_id" id="'+sentences._id+'">'+sentences._id+'...</div>' +
  '<div class="sentence">'+sentences.text.substring(0,20)+'...</div>' +
  '<div class="analyse-date">'+sentences.date.split('T')[0]+'</div></a></li>';
  $('.history.list-holder #list').append(li);
}

function createDetailsPage() {
  var detailsPage = '<div data-role="page" id="details"><div data-role="header"><h1>Emotional Analyzer - Details</h1><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a></div><div role="main" class="ui-content"><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="details list-holder"></div></div><div data-role="footer"><h4>Footer Text</h4></div></div>';
  $(detailsPage).insertAfter('#history');
}

function refreshData() {
  $( "#history" ).on( "pagebeforeshow", function( event ) {
      $('#list').listview('refresh');
  }); 
}


function settingsHistoryOn(status) {
  $('#savingHistory').on('change', function() {
      if(JSON.parse($(this).val()) == 'on'){
        saveAnalyse(status);
      }
  });
}

function saveSettings() {
  $('#savingHistory').on('change', function() {
      window.localStorage.setItem('saveHistory',  $(this).val());
  });
}

function getSettings() {
  var currentState = window.localStorage.getItem('saveHistory');
  $('#savingHistory').val(currentState).change();
}


function showAlert() {
    navigator.notification.alert(
    'You\'re analyze is saved in history.',  // message
    'Een callback',         // callback
    'Analyze is saved',            // title
    'Analyze saved'                  // buttonName
  );
}


function activePage() {
  $(document).on("pagechange", function (e, data) {
      window.localStorage.setItem('activePage',  data.toPage[0].id);
  });
}




$(document).on('ready', function(){
    messagePost();
    showHistory();  
    // activePage();
    // saveSettings();
    // getSettings();
     // showAlert();
});


// $( document ).on( 'pageinit','#history', function(event){
//   // alert('Demo');  
// //   $('#list li').on('tap', function(){
// //     alert('tap');  
// // });

// });
