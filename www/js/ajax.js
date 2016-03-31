// DIT STUURT DATA NAAR HEROKU BACKEND OFTEWEL AJAX POST
function messagePost() {
   $('#button_send').on('tap',function(event){
    event.preventDefault();

    // VARIABLES OPHALEN TEXT EN CONTROLEREN OF HET EINDIGT OP INTERPUNCTIE
    var text = $('#text').val();
    var regex = /[^\r\n.!?]+(:?(:?\r\n|[\r\n]|[.!?])+|$)/gi;
    var split = text.match(regex).map($.trim);
    var message = split.join("\\n");
    var data = '{"text": "'+message+'"}';

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
           showAnalyzedData(response,false, 0);
           $('#list').listview('refresh');
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

// OLD VERSON - DIT IS HET OUDE CODE OM DATA TE TONEN BIJ ANALYSE
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

// OLD VERSON - DIT IS HET OUDE CODE OM DATA TE TONEN BIJ GESCHIEDENIS
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

// NEW VERSON - DIT IS HET NIEUWE CODE OM DATA TE TONEN BIJ ANALYSE EN GESCHIEDENIS
function showAnalyzedData(response,isHistory, analyse_id) {
  
  // HIER ZET IK ANALYZETYPE, OF HET GESCHIEDENIS OF AJAX POST IS. BIJ HISTORY HAAL IK DE KEY OP VAN LOCALSTORAGE.
    var analyzeType;

    if(isHistory == true){
      var localData = JSON.parse(window.localStorage.getItem(analyse_id));
      analyzeType = localData;
    }else{
      settingsHistoryOn(response);
      // saveAnalyse(response);
      analyzeType = response;
    }
      console.log(isHistory); 
    console.log(analyzeType); 
    var detailsPage = createDetailsPage();
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
    
  // HIER CONTROLEER IK OF SENTECE_TONE BESTAAT OF NIET. 
  // DAARNA LOOP IK DOOR AANTAL ZINNEN. PER ZIN HAAL IK DE 3 CATEGORIEEN MET AANTAL TONES OP.
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

          // HIER FILTER IK DE SCORE OM DE HOOGSTE OP TE HALEN
            filtered_e = Math.round(filterToneScore("score",e_tone).score*100);
            filtered_w = Math.round(filterToneScore("score",w_tone).score*100);
            filtered_s = Math.round(filterToneScore("score",s_tone).score*100);
            e_tone_name = filterToneScore("score",e_tone).tone_name;
            w_tone_name = filterToneScore("score",w_tone).tone_name;
            s_tone_name = filterToneScore("score",s_tone).tone_name;


          // HIER KIJK IK OF EEN TOON UNDEFINED IS, DAAR KEN IK EEN ANDER EMOTIE TOE.
            if(isNaN(filtered_e)){result_e = "Emotion not found";}else{result_e = e_tone_name+" - " +filtered_e+'%';}
            if(isNaN(filtered_w)){result_w = "Emotion not found";}else{result_w = w_tone_name+" - " +filtered_w+'%';}
            if(isNaN(filtered_s)){result_s = "Emotion not found";}else{result_s = s_tone_name+" - " +filtered_s+'%';}

          // HIER MAAK IK DE HTML OP VAN DE DETAILS
            list += '<li>';
            list += '<div class="sentence">'+sentences[i].text+'</div>';
            list += '<div class="emotion-tone"><img class="'+e_tone_name+'" src="">'+result_e+'</div>';
            list += '<div class="writing-tone"><img class="'+w_tone_name+'" src="">'+result_w+'</div>';
            list += '<div class="social-tone"><img class="'+s_tone_name+'" src="">'+result_s+'</div>';
            list += '</li>';
        }
        list += '</ul>';

      // HIER CONTROLEER IK OF HET GESCHIEDENIS DETAILS IS OF DIRECTE ANALYSE.
        if(isHistory == true){
          $(detailsPage).insertAfter('#history');
           $('.details.list-holder').append(list);
            $.mobile.changePage('#details', { transition: "slide"} );
           $('#close_details').on('tap',function(){
              $.mobile.changePage('#history', { transition: "slide", reverse: true} );
              $('#details').remove();
            });
        }else{
          // $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="list-holder">'+list+'</div></div>').insertBefore('#home');
          // $('#resultAnalyse').animate({'top':'0'},300); 
            $(detailsPage).insertAfter('#home');
            $('.details.list-holder').append(list);
            $.mobile.changePage('#details', { transition: "slide"} );
            $('#close_details').on('tap',function(){
              $.mobile.changePage('#home', { transition: "slide", reverse: true} );
              $('#text').val('');
              $('#details').remove();
            });

          // $('#close_details').on('tap',function(){
          //      $('#resultAnalyse').animate({'top':'-100%'},300, function(){$(this).remove();});  
          //      $('#text').val('');
          // }); 
        }

      // HIER ROEP IK GRAFIEK FUNCTIE AAN
        createChart(e_category, w_category, s_category);

    }else{
      // DE ELSE IS VOOR TONEN VAN RESULTAAT VAN EEN ENKELE ZIN, DIE GEEN SENTENCE TONE HEEFT.
        if(isHistory == true){
            $(detailsPage).insertAfter('#history');
            $('.details.list-holder').text(localData.text);
             $.mobile.changePage('#details', { transition: "slide"} );
            $('#close_details').on('tap',function(){
               $.mobile.changePage('#history', { transition: "slide", reverse: true} );
               $('#details').remove();
            });
          }else{
            $(detailsPage).insertAfter('#home');
            $('.details.list-holder').text(localData.text);
             $.mobile.changePage('#details', { transition: "slide"} );
            $('#close_details').on('tap',function(){
               $.mobile.changePage('#home', { transition: "slide", reverse: true} );
               $('#text').val('');
               $('#details').remove();
            });

            // $('<div id="resultAnalyse" class="panel"><div class="resultAnalyse-header"><a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a><h2>Analyse</h2></div><div class="graph-holder"><canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div><canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div><canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div></div><div class="list-holder">'+response.text+'</div></div>').insertBefore('#home');
            // $('#resultAnalyse').animate({'top':'0'},300);  

            // $('#close_details').on('tap',function(){
            //    $('#resultAnalyse').animate({'top':'-100%'},300, function(){$(this).remove();});  
            //    $('#text').val('');
            // });
        }

        createChart(e_category, w_category, s_category);
        
    }

}

// DIT IS DE GRAFIEK FUNCTIE, DIE GRAFIEK AANMAAKT.
function createChart(e_category, w_category, s_category) {

  // HIER KEN IK KLEUREN TOE EN DAARNAAST LOOP IK PER ALGEMENE CATEGORIE OM JSON OBJECT ERVAN TE MAKEN.
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

  // DIT IS LEGENDA
    var doughnutOptions = {
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%> - <%=segments[i].value%>%</li><%}%></ul>"
    };
  
    if(dataA[0].value != 0 && dataA[1].value != 0 && dataA[2].value != 0 && dataA[3].value != 0 && dataA[4].value != 0){
      var myDoughnutChartA = new Chart(document.getElementById("graphA").getContext("2d")).Pie(dataA, doughnutOptions);
      var legendA = myDoughnutChartA.generateLegend();
      $('#js-legendA').append(legendA);
    }else{
      $('#graphA, #js-legendA').hide();
    }

    if(dataB[0].value != 0 && dataB[1].value != 0 && dataB[2].value != 0){
      var myDoughnutChartB = new Chart(document.getElementById("graphB").getContext("2d")).Pie(dataB, doughnutOptions);
      var legendB = myDoughnutChartB.generateLegend();
      $('#js-legendB').append(legendB);
      console.log('ja');
    }else{
      $('#graphB, #js-legendB').hide();
       console.log('nee');
    }

     console.log(dataB[0].value);
     console.log(dataB[1].value);
     console.log(dataB[2].value);
    if(dataC[0].value != 0 && dataC[1].value != 0 && dataC[2].value != 0 && dataC[3].value != 0 && dataC[4].value != 0){
      var myDoughnutChartC = new Chart(document.getElementById("graphC").getContext("2d")).Pie(dataC, doughnutOptions);
      var legendC = myDoughnutChartC.generateLegend();
      $('#js-legendC').append(legendC);
    }else{
      $('#graphC, #js-legendC').hide();
    }



    

}

// HIER SLA IK ANALYSE OP. IK SLA HET OP IN LOCALSTORAGE DAAARNAAST ZET IK HET OOK IN ARRAY VOOR DE LISTVIEW
function saveAnalyse(data) {
    var dataAnalyse = JSON.stringify(data);
    window.localStorage.setItem(data._id, dataAnalyse);
    // addToHistory(data._id);
    addToArray(data._id);
    
    navigator.notification.alert(
      'Analyse is saved.',  // message
        'callback',         // callback
        'Analyse',            // title
        'Close.'                  // buttonName
    );

}

// DIT IS DE ENDLESS SCROLL VOOR DE HISTORY LIST
function checkScroll() {
  var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
    screenHeight = $.mobile.getScreenHeight(),
    contentHeight = $(".ui-content", activePage).outerHeight(),
    header = $(".ui-header", activePage).outerHeight() - 1,
    scrolled = $(window).scrollTop(),
    footer = $(".ui-footer", activePage).outerHeight() - 1,
    scrollEnd = contentHeight - screenHeight + header + footer;;
    if (activePage[0].id == "history" && scrolled >= scrollEnd) {
      console.log("adding...");
      addMore(activePage);
    }
}


// DIT IS DE FUNCTIE DIE MEERDERE LISTITEMS TOEVOEGT
function addMore(page) {
  // HIER GAAT HET MIS MET DIE LOADINGBAR IN HISTORY, IK DACHT OM HET OP TE PAKKEN ALS ER MEER DAN 3 ITEMS IN LOCALSTORAGE ZIT. 
  // MAAR ZO TE ZIEN WERKT HET NIET OP TELEFOON.
   $.mobile.loading("hide");
    $(document).off("scrollstop");
    $.mobile.loading("show", {
      text: "loading more..",
      textVisible: true
    });
    setTimeout(function() {
        var items = '',
        last = $("li", page).length,
        cont = last + 5;
        analysis = analysisArray();
        var lastAnalyse = Object.keys(analysis).length;

        for (var index = last; index < cont; index++) {
           if(index <= lastAnalyse){
              addToHistory(analysis[index]);
               $.mobile.loading("hide");
           }
        }

      // $("#list", page).append(items).listview("refresh");
      $.mobile.loading("hide");
      $(document).on("scrollstop", checkScroll);
    }, 500);
}

$(document).on("scrollstop", checkScroll);

// DE FUNCTIE DIE ARRAY AANMAAKT VAN ANALYSIS OM LISTVIEW BIJ TE HOUDEN VOOR ENDLESS SCROLL.
function analysisArray(analysis) {
  var analysisArray = analysis;
  var counter = 0;
  analysisArray = {};
  for (var analyseItem in localStorage) {
    if(analyseItem != 'saveHistory'){
      if(analyseItem != 'activePage'){
        analysisArray[counter] = analyseItem;
        counter++;
      }
    }
  }
  return analysisArray;
}

// DE FUNCTIE DIE ITEMS TOEVOEGT AAN ARRAY
function addToArray(analyse_id){
   var lastAnalyse = Object.keys(analysis).length;
   analysis = analysisArray();
   analysis[lastAnalyse+1] = analyse_id;
}

// DIT IS HET TONEN VAN DE HISTORY LISTVIEW
function showHistory() {
  var list = '<ul data-role="listview" id="list">';
  list += '</ul>';
  $('.history.list-holder').append(list);
  analysis = analysisArray();

// DIT IS HET OUDE CODE ZONDER DE ARRAY
  // for (var analyseItem in localStorage) {
  //   if(analyseItem != 'saveHistory'){
  //     if(analyseItem != 'activePage'){
  //       // counter++;
  //       // if(counter < limit){
  //            addToHistory(analyseItem);
  //       // }
  //     }
  //   }
  // }

// DIT IS VOOR CONTROLE OM ARRAY TE CHECKEN
  $.each(analysis, function(key, value) {
      console.log(key + ' - ' + value);
  });

// DEZE FUNCTIE ROEPT DE HTML VOOR IEDER LISTITEM IN DE LISTVIEW OP. 
// ALS TEST IS ER GEBRUIK GEMAAKT TOT 5 ITEMS TONEN EN DE REST SCROLLEN.
  for (index = 0; index < Object.keys(analysis).length; index++) {
    if(index < 5){
      console.log(index);
      console.log(analysis[index]);
      addToHistory(analysis[index]); 
    }
  }

// DE LISTITEM AHREF OM DETAILS PAGINA TE TONEN.
  $('.show-details').on('tap' ,function(e){ 
    e.preventDefault();
    console.log($(this));
    var analyse_id = $(this).children('.analyse_id').attr('id');
    showAnalyzedData(0,true, analyse_id);
    return false;
  });
}

// DE ADDTOHISTORY FUNCTIE, IS HTML VOOR IEDER LISTITEM.
// HET GAAT WEL AF EN TOE FOUT BIJ JSON PARSE. SNAP NIET WAAROM WANR WE VANGEN DE ANALYSE ID OP.
// NA LAATSTE IF PAKT DIE GWN DE STORAGE ITEMS VAN SAVEHISTORY EN ACTIVEPAGE OOK. TERWIJL DIE DAT NIET MOET DEON.
function addToHistory(analyse_id){
  //jquery append id=list 
  // old = !(window.localStorage.getItem('saveHistory'))

  if(analyse_id != 'saveHistory'){
    if(analyse_id != 'activePage'){
      var sentences = JSON.parse(localStorage[analyse_id]);
      var li = '<li><a href="#" class="show-details">' +
      '<div class="analyse_id" id="'+sentences._id+'">'+sentences._id+'</div>' +
      '<div class="sentence">'+sentences.text.substring(0,20)+'...</div>' +
      '<div class="analyse-date">'+sentences.date.split('T')[0]+' '+sentences.date.split('T')[1]+'</div></a></li>';
      $('.history.list-holder #list').append(li);
    }
  }
}


// HET AANMAKEN VAN EEN DETAILS PAGE
// MISS DAT DIT EIGENLIJK OOK DIRECT BIJ ANALYSE KON IPV DAAR GEBRUIKT TE MAKEN VAN EEN EIGEN PANEL.
function createDetailsPage() {
  var detailsPage = 
  '<div data-role="page" id="details">'+
    '<div data-role="header" data-position="fixed" data-tap-toggle="false">'+
        '<h1>Emotional Analyzer - Details</h1>'+
        '<a href="#" id="close_details" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close</a>'+
    '</div>'+
    '<div role="main" class="ui-content">'+
        '<div class="graph-holder">'+
          '<canvas id="graphA"></canvas><div id="js-legendA" class="chart-legend"></div>'+
          '<canvas id="graphB"></canvas><div id="js-legendB" class="chart-legend"></div>'+
          '<canvas id="graphC"></canvas><div id="js-legendC" class="chart-legend"></div>'+
        '</div>'+
        '<div class="details list-holder"></div>'+
    '</div>'+
  '<div data-role="footer" data-position="fixed" data-tap-toggle="false"><h4>Footer Text</h4></div>'+
  '</div>';
  // $(detailsPage).insertAfter('#history');
  return detailsPage;
}

// REFRESHEN VAN LIST. MAAR WORD NERGENS GEBRUIKT.
function refreshData() {
  $( "#history" ).on( "pagebeforeshow", function( event ) {
      $('#list').listview('refresh');
  }); 
}

// HET OPSLAAN VAN DE HISTORY ITEMS IN LOCALSTORAGE BIJ SETTINGS ON.
function settingsHistoryOn(data) {
  if($('#savingHistory').val() == 'on'){
    saveAnalyse(data);
  }
}

// HET OPSLAAN VAN DE SETTINGS IN LOCALSTORAGE
function saveSettings() {
  $('#savingHistory').on('change', function() {
      window.localStorage.setItem('saveHistory',  $(this).val());
  });
}

// HET OPHALEN VAN SETTINGS. DIT OM BIJ HET OPSTARTEN VAN APP DIRECT OP 'ON' TE ZETTEN VAN APP
function getSettings() {
  var currentState = window.localStorage.getItem('saveHistory');
  $('#savingHistory').val(currentState).change();
}

// HET OPSLAAN VAN DE HUIDIGE PAGE. BIJ INDEX.JS WORDT DE GETTER OPGEHAALD. MAAR NIET ECHT GETEST.
function activePage() {
  $(document).on("pagechange", function (e, data) {
    if($.mobile.activePage.attr('id') != 'details'){
       window.localStorage.setItem('activePage',  data.toPage[0].id);
    }
  });
}


// NATIVE FUNCTIE SAMPLEFILE ONCLICK.
function sampleFile() {
  $('#button_sample').on('tap',function(event){
    event.preventDefault();
    onDeviceReady();
  });
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.notification);
}

// DEFAULT GEGEVENS VAN FILE NATIVE PHONEGAP.
 // Wait for PhoneGap to load


document.addEventListener("deviceready", onDeviceReady, false);
// document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(cordova.file);
    StatusBar.hide();
}

// DOCUMENT ON READY. OP HET EINDE GA IK ALLES VERANDEREN NAAR JQUERY MOBILE EVENTS, PAGEINIT ETC.
$(document).on('ready', function(){
    activePage();
    saveSettings();
    getSettings();
    messagePost();
    showHistory();  
    sampleFile();
});




// $( document ).on( 'pageinit','#history', function(event){
//   // alert('Demo');  
// //   $('#list li').on('tap', function(){
// //     alert('tap');  
// // });

// });
