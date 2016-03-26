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

// OLD VERSON
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

// OLD VERSON
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

// NEW VERSON
function showAnalyzedData(response,isHistory, analyse_id) {
  
    var analyzeType;

    if(isHistory == true){
      var localData = JSON.parse(window.localStorage.getItem(analyse_id));
      analyzeType = localData;
    }else{
      settingsHistoryOn(response);
      // saveAnalyse(response);
      analyzeType = response;
    }
      
    var list = '<ul data-role="listview" id="list">';

    var e_tone;
    var w_tone;
    var s_tone;
    var e_tone_name;
    var w_tone_name;
    var s_tone_name;
    var filtered_e;
    var filtered_w;
    var filtered_s;
    var result_e;
    var result_w;
    var result_s;
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

            filtered_e = Math.round(filterToneScore("score",e_tone).score*100);
            filtered_w = Math.round(filterToneScore("score",w_tone).score*100);
            filtered_s = Math.round(filterToneScore("score",s_tone).score*100);
            e_tone_name = filterToneScore("score",e_tone).tone_name;
            w_tone_name = filterToneScore("score",w_tone).tone_name;
            s_tone_name = filterToneScore("score",s_tone).tone_name;

            if(isNaN(filtered_e)){result_e = "Emotion not found";}else{result_e = e_tone_name+" - " +filtered_e+'%';}
            if(isNaN(filtered_w)){result_w = "Emotion not found";}else{result_w = w_tone_name+" - " +filtered_w+'%';}
            if(isNaN(filtered_s)){result_s = "Emotion not found";}else{result_s = s_tone_name+" - " +filtered_s+'%';}

            list += '<li>';
            list += '<div class="sentence">'+sentences[i].text+'</div>';
            list += '<div class="emotion-tone"><img class="'+e_tone_name+'" src="">'+result_e+'</div>';
            list += '<div class="writing-tone"><img class="'+w_tone_name+'" src="">'+result_w+'</div>';
            list += '<div class="social-tone"><img class="'+s_tone_name+'" src="">'+result_s+'</div>';
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

function addMore() {
    $.mobile.loading("show", {
        text: "loading more..",
        textVisible: true,
        theme: "a"
    });
    setTimeout(function () {
        var items = '';
        for (var i = 0; i < 10; i++) {
            items += "<li>" + i + "</li>";
        }
        $("#list").append(items).listview("refresh");
        $.mobile.loading("hide");
    }, 500);
}

function showHistory() {
  var list = '<ul data-role="listview" id="list">';
  // var sentences; 
  var counter = 0;
  list += '</ul>';
  $('.history.list-holder').append(list);

  for (var analyseItem in localStorage) {
    if(analyseItem != 'saveHistory'){
      if(analyseItem != 'activePage'){
          counter++;
        // if(counter < 11){
          addToHistory(analyseItem);
            
           // // weet alleen niet hoe ik verder +10 moet doen
           // $(document).on("scrollstop", function (e) {
           //    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
           //    screenHeight = $.mobile.getScreenHeight(),
           //    contentHeight = $(".ui-content", activePage).outerHeight(),
           //    header = $(".ui-header", activePage).outerHeight() - 1,
           //    scrolled = $(window).scrollTop(),
           //    footer = $(".ui-footer", activePage).outerHeight() - 1,
           //    scrollEnd = contentHeight - screenHeight + header + footer;
           //    if (activePage[0].id == "history" && scrolled >= scrollEnd) {
           //      console.log("adding...");
           //      // addMore();
           //      // continue;
           //      addToHistory(analyseItem);
           //    }
          // });
        // }
      }
    }
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
  // old = !(window.localStorage.getItem('saveHistory'))
  if(analyse_id != 'saveHistory'){
    if(analyse_id != 'activePage'){
      var sentences = JSON.parse(localStorage[analyse_id]);
      var li = '<li><a href="#" class="show-details">' +
      '<div class="analyse_id" id="'+sentences._id+'">'+sentences._id+'...</div>' +
      '<div class="sentence">'+sentences.text.substring(0,20)+'...</div>' +
      '<div class="analyse-date">'+sentences.date.split('T')[0]+'</div></a></li>';
      $('.history.list-holder #list').append(li);
    }
  }
  
}

function createDetailsPage() {
  var detailsPage = '<div data-role="page" id="details"><div data-role="header"><h1>Emotional Analyzer - Details</h1><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><button onclick="captureImage();">Capture Image</button></div><div role="main" class="ui-content"><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="details list-holder"></div></div><div data-role="footer"><h4>Footer Text</h4></div></div>';
  $(detailsPage).insertAfter('#history');
}

function refreshData() {
  $( "#history" ).on( "pagebeforeshow", function( event ) {
      $('#list').listview('refresh');
  }); 
}


function settingsHistoryOn(data) {
  if($('#savingHistory').val() == 'on'){
    saveAnalyse(data);
  }
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
    if($.mobile.activePage.attr('id') != 'details'){
       window.localStorage.setItem('activePage',  data.toPage[0].id);
    }
  });
}


    // Called when capture operation is finished
    //
    function captureSuccess(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
        }
    }

    // Called if something bad happens.
    //
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }

    // A button will call this function
    //
    function captureImage() {
        // Launch device camera application,
        // allowing user to capture up to 2 images
        navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
    }

    // Upload files to server
    function uploadFile(mediaFile) {
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;

        ft.upload(path,
            "http://my.domain.com/upload.php",
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            { fileName: name });
    }



$(document).on('ready', function(){
    messagePost();
    showHistory();  
    activePage();
    saveSettings();
    getSettings();
    showAlert();
});


// $( document ).on( 'pageinit','#history', function(event){
//   // alert('Demo');  
// //   $('#list li').on('tap', function(){
// //     alert('tap');  
// // });

// });
