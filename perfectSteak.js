var perfectSteak = function (div) {


    function Model(div) {

        var currentInfo = {

            'meatTemp': 23, //initial temperature of the meat
            'thickness': 3, //thickness of the meat in centimeters
            'data': [[240,150,23],[240,23,150],[150,23,23]], //timestamps of temperatures
            'numRows': 3, //how many steps there are in the recipe
            'time': 0, //time
            'OKToGraph': true, //flag for when data is ready to graph
            'recipe': {}, //recipes -- THIS HAS ALL SAVED RECIPES, INCLUDING THE ONES THAT WE SAVED
            'totalTime': 0, //total cooking
            'names': {
                'Steak': 0,
                'Tuna': 0,
                'Turkey': 0
            }

        };

        var timeStep = 240;
        var inputTable = $(".inputTable");
        var toF = function (C) {
            return C*(9 / 5) + 32;
        }
        var toC = function (F) {
            return ((5 / 9) * (F - 32));
        }

        var importRecipes = function () {
         
		var saved=[{"name":"Heston Blumenthal","data":[[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[15,23,150],[15,150,23],[150,23,23]],"Temp":23},
	{"name":"4 minutes a side","data":[[240,150,23],[240,23,150],[150,23,23]],"Temp":23},
	{"name":"America's Test Kitchen","data":[[15,230,23],[15,23,230],[150,110,110],[900,23,23]],"Temp":23},
				 {"name":"Nathan Myhrvold","data":[[3600,53,53],[30,-200,-200],[120,200,200]],"Temp":23}];
		for (var i=0;i<4;i++){
				var name=saved[i]["name"];
				var data=saved[i]["data"];




			var steaktemp=saved[i]["Temp"];
			var steak = [data[0][1]];
            for (var m = 0; m < 30; m++) {
                steak.push(toC(steaktemp))
            }
            steak.push(data[0][2]);
            var myheatsolver = HeatSolver(steak);
            var Thedata = myheatsolver.sixty_graph_arrays_duration(data);
            var maxTemps = Thedata.maxTemps;
            var meatType = "Steak";
            var recipe = [meatType, maxTemps, data, steaktemp,3,'C'];
            addRecipe(name, recipe);
			}
		}

        var changeThickness = function (newVal) {

            currentInfo["thickness"] = newVal;

        }

        var browserInfo = function (M) {
            currentInfo["browser"] = M;
        }

        var updateTotalTime = function (secs) {
            currentInfo["totalTime"] = secs;
        }

        var checkDiv = function () {
            currentInfo["OKToGraph"] = true;
            $(".alert").remove();
            for (var h = 0; h < currentInfo["numRows"]; h++) {

                if (parseFloat($("#inp1_" + h).val()) < 0) {
                    var side1Alert = $("<div class='alert alert-danger' id='row" + h + "side1alert'>Too low!</div>");
                    $("#row" + h + "side1").append(side1Alert);
                    currentInfo["OKToGraph"] = false;
                }
                if (parseFloat($("#inp2_" + h).val()) < 0) {
                    var side2Alert = $("<div class='alert alert-danger' id='row" + h + "side2alert'>Too low!</div>");
                    $("#row" + h + "side2").append(side2Alert);
                    currentInfo["OKToGraph"] = false;
                }
                if (parseFloat($("#row" + h + "time").val()) < 0) {
                    var timeAlert = $("<div class='alert alert-danger' id='row" + h + "timeAlert'>Negative time</div>");
                    $("#duration" + h).append(timeAlert);
                    currentInfo["OKToGraph"] = false;
                }
            }
        }

        var addTime = function (value) {
            currentInfo['time'] += value;
        }

        var changeTime = function (value) {
            currentInfo['time'] = value;
        }

        var addRecipe = function (name, recipe) {
            currentInfo['recipe'][name] = recipe;
        }



        //CHANGES X SECONDS INTO Y:X WHERE Y IS MINUTES X IS SECONDS
        var convertTime = function (secs) {

            var minutes = Math.floor(parseInt(secs) / 60);
            var seconds = parseInt(secs) % 60;

            if (minutes == 0 && seconds < 10) {

                return String(0) + ":0" + String(seconds);
            } else if (seconds == 0) {

                return String(minutes) + ':' + String(seconds) + '0';
            } else {

                return String(minutes) + ':' + String(seconds);
            }
        }

        var numRowsPlus = function () {
            currentInfo["numRows"]++;
        }

        var numRowsMinus = function () {
            currentInfo["numRows"]--;
        }

		var numRowsChange=function(num){
			currentInfo["numRows"]=num;
		}

        var changeMeatTemp = function (newVal) {
            currentInfo["meatTemp"] = newVal;
        }

        //OK THIS WORKS NOW
        var dataClear = function () {
            currentInfo["data"] = [];
        }

        //THIS ADDS AN ELEMENT TO THE DATA ARRAY
        var dataAdd = function (item) {

            currentInfo["data"].push(item);
        }

        //THIS IS FOR CHANGING THE ENTIRE DATA ARRAY
        var dataChange = function (array) {
            currentInfo["data"] = array;

        }

        var saveRecipe = function (name) {

            var steak = [currentInfo["data"][0][1]];
            for (var m = 0; m < parseFloat($("#thicknessInp").val()) * 10; m++) {

                if ($('.mytog2:checked').attr('id') == 'C') {
                    steak.push(parseFloat($("#steakTemp").val()))
                } else {
                    steak.push(toC(parseFloat($("#steakTemp").val())))
                }
            

                steak.push(parseFloat($("#steakTemp").val()))

				}
				 steak.push(currentInfo["data"][0][2]);
            
            var myheatsolver = HeatSolver(steak);
            var Thedata = myheatsolver.sixty_graph_arrays_duration(currentInfo["data"]);
            var maxTemps = Thedata.maxTemps;
            var meatType = $("input[type='radio'][name='meat']:checked").attr('id');
            var recipe = [meatType, maxTemps, currentInfo["data"], currentInfo["meatTemp"], currentInfo['thickness'], $('.mytog2:checked').attr('id')];
            addRecipe(name, recipe);

        }



        var buildData = function () {
            var newData = [];
            //THIS IS BEFORE THE NEXT BUTTON IS ADDED, SO NUMROWS IS ACTUALLY ONE LESS THAN IT DISPLAYS

            for (var g = 0; g < currentInfo["numRows"]; g++) {

                var side1data = parseFloat($("#inp1_" + g).val());
                var side2data = parseFloat($("#inp2_" + g).val());
                var timedata = $("#row" + g + "time").val() || 1000;


                if (timedata == 1000) {
                    var timeMin = 4;
                    return 4;
                } else if (timedata.length > 2) {
                    var timeMin = function (time) {

                        var timeString = '';
                        for (var x = 0; x < time.length; x++) {
                            if (time.charAt(x) == ':') {
                                break;
                            } else {
                                timeString += time.charAt(x);
                            }
                        }
                        return parseInt(timeString)
                    }
                } else {
                    var timeMin = function (time) {
                        return 0;
                    }
                }
                var timeSec = parseInt(timedata.charAt(timedata.length - 2) + timedata.charAt(timedata.length - 1));
                var timeForGraph = 60 * timeMin(timedata) + timeSec;
                newData.push([timeForGraph, side1data, side2data]);

            }

            dataChange(newData);

        }

        // returns a human-readable string containing a temperature
        // temperature: temperature value in Celsius
        // mode: "C" if the result should be in Celsius, "F" if it should be in Fahrenheit
        // returns e.g. "5°C"
        var printTemperature = function(temperature, mode) {
            var value = temperature;
            if (mode == "F") {
                value = toF(value);
            }
            return value.toFixed(0) + "\xB0" + mode;
        }

        // returns a temperature value in Celsius, given the value as a string and a mode which is either "C" or "F". 
        var parseTemperature = function(temperatureStr, mode) {
            var value = parseInt(temperatureStr);
            if (mode == "F") {
                value = toC(value);
            }
            return value;
        }


        // Returns the recipe in currentInfo as a human-readable string, for display in the "as text" tab and
        // for the user to copy-and-paste and share with other people.
        // mode is "F" for Fahrenheit/inches, and "C" for Celsius/cm.
        // The format of the string is this (separated by newlines:
        //      <thickness> <meat> starts at <starting-temp>
        //      <time> at <side1-temp> and <side2-temp>
        //      ...
        //      <time> at <side1-temp> and <side2-temp>
        // where
        //     <thickness> ::= <number> [cm|in]
        //     <meat> ::= Steak | Tuna | Turkey | ...
        //     <temp> ::= <number> °[C|F]
        var printRecipe = function(mode) {
            var recipe = []; // make a list of lines that we'll then join into a string
            recipe.push(currentInfo["thickness"] + "cm "// TODO: convert to inches if mode=="F" 
                        + "Steak " // TODO: need to store meat type in currentInfo
                        + "starts at " + printTemperature(currentInfo["meatTemp"], mode));
            var data = currentInfo["data"];
            for(var i=0; i<data.length; i++) {
                var step = data[i];
                recipe.push(convertTime(step[0])
                            + " at "
                            + printTemperature(step[1], mode)
                            + " and "
                            + printTemperature(step[2], mode));
            }
            return recipe.join("\n");
        }

        // capitalizes first character of s and lowercases the rest
        var toTitleCase = function(s) {
            return s[0].toUpperCase() + s.substring(1).toLowerCase();
        }

        // Parses the human-readable string returned by printRecipe() and stores the recipe in currentInfo.
        // Needs to be very tolerant of whitespace, alphabetic case changes, and extra words entered into the recipe, since
        // the user may edit the string before parseRecipe() gets to it.
        var parseRecipe = function (recipeStr) {
            var lines = recipeStr.split(/[\r\n]/);

            var data = [];
            var meatType;
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];

                // try to parse starting conditions
                var m = line.match(/(\d+)\s*(in|cm).*?(steak|tuna|turkey).*?(\d+)\xB0\s*([CF])/i);
                if (m) {
                    console.log(m);
                    currentInfo["thickness"] = parseInt(m[1]); // TODO: handle inches
                    currentInfo["meatTemp"] = parseTemperature(m[4], m[5]);
                    meatType = toTitleCase(m[4]); // so that "steak" becomes "Steak"
                    continue; // don't parse the line as a step
                }

                // otherwise try to parse a recipe step
                var m = line.match(/((\d)+:)?(\d+)?.*?(\d+)\xB0\s*([CF]).*?(\d+)\xB0\s*([CF])/i);
                if (m) {
                    console.log(m);
                    var time = parseInt(m[3]); // seconds field
                    if (m[2]) time += 60*parseInt(m[2]); // optional minutes field
                    var side1Temp = parseTemperature(m[4], m[5]);
                    var side2Temp = parseTemperature(m[6], m[7]);
                    data.push([time, side1Temp, side2Temp]);
                    continue;
                }

                console.log("ignored " + line);

            }
            currentInfo["data"] = data;
            currentInfo["numRows"] = data.length;
            // TODO: need to update currentInfo["totalTime"]
        }

        return {
            currentInfo: currentInfo,
            changeThickness: changeThickness,
            timeStep: timeStep,
            dataAdd: dataAdd,
            dataClear: dataClear,
            dataChange: dataChange,
            changeMeatTemp: changeMeatTemp,
            buildData: buildData,
            numRowsPlus: numRowsPlus,
            numRowsMinus: numRowsMinus,
			numRowsChange: numRowsChange,
            convertTime: convertTime,
            changeTime: changeTime,
            addTime: addTime,
            buildData: buildData,
            checkDiv: checkDiv,
            saveRecipe: saveRecipe,
            addRecipe: addRecipe,
            browserInfo: browserInfo,
            updateTotalTime: updateTotalTime,
            printRecipe: printRecipe,
            parseRecipe: parseRecipe,
            importRecipes: importRecipes
        }
    }




    function View(div, model) {

        navigator.sayswho = (function () {
            var N = navigator.appName,
                ua = navigator.userAgent,
                tem;
            var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
            M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];


            if (M[0] == "MSIE") {
                $('input[type=text]').each(function () {
                    $(this).css(
                        "height", "100px !important"
                    )
                })
            }
            model.browserInfo(M);
        })();

        model.importRecipes();
        var clicked = false;
        var displayDiv = $("<div class='displayDiv'><h4>Input Recipe</h4></div>");
        var tableTabs = $('<ul class="nav nav-tabs"><li><a href="#table" data-toggle="tab" class="mytab">As table</a></li><li><a href="#text" data-toggle="tab" class="mytab">As text</a></li></ul>');

        var tabContent = $("<div class='tab-content'></div>");
        var tabPaneActive = $("<div class='tab-pane active' id='table'></div>");
        var thickInpDiv = $("<span id='thickInpDiv'>Thickness: <input type='text' id='thicknessInp' value='3'> cm </span>'");
		var tempInp=$("<div><span id='tempInpDiv'>   Initial Temperature: <input type='text' id='steakTemp' value='23'><span id='work'>&#176;C</span></span></div>");
        var meatInp = $("<span><form id='meatInp'><b>Meat: </b><input type='radio' name='meat' id='Steak' checked>Steak<input type='radio' name='meat' id='Tuna'>Tuna <input type='radio' name='meat' id='Turkey'>Turkey </form></span>");
        var switcheroo = $('<span class="switcheroo"></span>');
        var mytog2 = $("<input type='radio' class='mytog2' id='C' name='toggle2' checked><label for='C' class='btn'>C</label><input type='radio' class='mytog2' id='F' name='toggle2'><label for='F' class='btn'>F</label>");
		var inputTableContainer=$("<div class='inputTableContainer'></div>");
        var inputTable = $("<table class='inputTable table table-striped'></table>");
		inputTableContainer.append(inputTable)
        var tabPane = $("<div class='tab-pane' id='text'></div>")
        var inpTabHeader = $("<table class='header table table-striped'><tr><th class='inpTabHeader' id= 'si1'>Side 1 (&#176;C)</th><th class='inpTabHeader' id='si2'>Side 2 (&#176;C)</th><th class='inpTabHeader'>Duration (mm:ss)</th></tr></table>");
        var containerm = $("<div class='containerm'><textarea id='recipeInput' cols=40 rows=5></textarea></div>");
		
        inputTableContainer.append(inputTable);
        switcheroo.append(mytog2);
		switcheroo.change(function () {

            $('#si1').html("Side 1 (&#176;" + $('.mytog2:checked').attr('id') + ")");
            $('#si2').html("Side 2 (&#176;" + $('.mytog2:checked').attr('id') + ")");
            $('#work').html("&#176;" + $('.mytog2:checked').attr('id'));
            //graph(false, $('.mytog:checked').attr('id'));
        });
        tabPaneActive.append( meatInp,thickInpDiv,tempInp,inpTabHeader,inputTableContainer);
		 // tabPaneActive.append( inpTabHeader);
        tabPane.append(containerm);
        tabContent.append(tabPaneActive, tabPane);


        displayDiv.append(tableTabs, tabContent);
    
        var addButton;

        var flipButton;
        var cookButton;
		var cookButt=$('<button class="btn" id="Cook"><input type="image" id="myimage" style="height:20px;width:20px;"" src="flame.png"><span>Cook</span><input type="image" id="myimage" style="height:20px;width:20px;" src="flame.png"></button>');
        //var cookButt = $("<button class='btn' id='Cook'>"+flame+"Cook"+flame+"</button>");
        cookButt.css("width", '100%');

        /*
            updateTime goes through the table and updates the total cooking time entered. It also checks for any entries that are in seconds and calls to change them into the format mm:ss
        */
        var updateTime = function () {
            var time = 0;
            for (var i = 0; i < model.currentInfo["numRows"]; i++) {
                //THIS WILL BE TRIGGERED IF THE TIME NEEDS TO BE CONVERTED
				
                if (String($("#row" + i + "time").val()).indexOf(':') == -1) {
					
                    time += isNaN(parseFloat($("#row" + i + "time").val()))?0:parseFloat($("#row" + i + "time").val());
                   // $("#row" + i + "time").val(model.convertTime(parseFloat($("#row" + i + "time").val())));
                } else {
                    var colon = String($("#row" + i + "time").val()).indexOf(':');
                    var min = String($("#row" + i + "time").val()).substring(0, colon);
                    var sec = String($("#row" + i + "time").val()).substring(colon + 1);
                    time += 60 * parseFloat(min)+parseFloat(sec);
                }
				
            }
            model.updateTotalTime(time);
        }

        /*
            addDropdown configures the two dropdowns associated with comparing different meats. It accounts for selecting a previous meat and calling a function to draw that meat in the appropriate window
        */
        var addDropdown = function () {
            $(".dropdown").remove();

            var dropdownDiv = $("<div class='dropdown'><div><h4>Compare Two Recipes</h4></div></div>");
            var dropdown1 = $('<select class="steakHist" id ="d1"></select>');
            var dropdown2 = $('<select class="steakHist"id ="d2"></select>');

            var dropdown3 = $('<select class="steakHist dropdown" id="d3" name="dropdown3"></select><br class="dropdown">')
            dropdown3.append('<option></option>');

            for (var key in model.currentInfo['recipe']) {
                dropdown1.append($('<option>' + key + '</option>'));
                dropdown2.append($('<option>' + key + '</option>'));
                dropdown3.append($('<option>' + key + '</option>'));
            }

     dropdownDiv.change(function () {

                var e1 = document.getElementById("d1");
                var name1 = e1.options[e1.selectedIndex].text;
                var e2 = document.getElementById("d2");
                var name2 = e2.options[e2.selectedIndex].text;
                var info = model.currentInfo['recipe'][name1];
			
                d3.selectAll('.finalsteak').remove();

                drawFinished(info[0], info[1], info[2], info[3], 0,info[4],$('.mytog2:checked').attr('id'));
                var inf = model.currentInfo['recipe'][name2];

                drawFinished(inf[0], inf[1], inf[2], inf[3], 1, inf[4], inf[5]);
            });
			
			//NOW THIS DELETES EVERY ROW AND ADDS THEIR OWN LITTLE ROWS
            dropdown3.change(function () {
				var e3=document.getElementById("d3");
				var name3=e3.options[e3.selectedIndex].text;
				model.dataChange(model.currentInfo['recipe'][name3][2]);
				var newNum=model.currentInfo['data'].length;
				//REMOVING ALL THE ROWS THAT CURRENTLY EXIST
				for (var i =0; i<model.currentInfo['numRows']; i++){
				
					$("#row"+i).remove();	
				}
				model.numRowsChange(0);

				//NOW ADDING THEM ALL AGAIN
				for (var j=0; j<newNum; j++){
					addRow(j, inputTable);
				}
				addAddButton();
            })

            dropdownDiv.append(dropdown1, dropdown2);
            tabPaneActive.prepend(dropdown3);
            $(".span12").prepend(dropdownDiv);
        }

        /*
            buildDisplay places the necessary items on the screen for the user to interact with.
        */
        var buildDisplay = function () {
            if (model.currentInfo["OKToGraph"]) {
                div.append("<div class='row'><div class='container optionBar'></div></div><div class='span3'></div><div class='span9'></div><div class='span12'></div></div>");
                var switches = $('<div class="switch"><input type="radio" class="mytog" id="PS" name="toggle" checked><label for="PS" class="btn" >Protein State</label><input type="radio" class="mytog"id="T" name="toggle"><label for="T" class="btn" >Temperature</label></div>');
                div.append(switches,switcheroo);
                switches.change(function () {

                    graph(false, $('.mytog:checked').attr('id'));
                });

                $(".span3").append(displayDiv);
				

                $("#startModal").modal("show");

                cookButton = $(".cookButton");

                buildTable();
            } else {
                (".")
            }


            addDropdown();
        }
		
        var toF = function (C) {
            return (C * (9 / 5) + 32 + "&#176;F");
        }
        var toC = function (F) {
            return ((5 / 9) * (F - 32));
        }

//I'M NOT CONVINCED WE NEED THIS FUNCTION AT ALL. WE REALLY SHOULD JUST BE USING ADDROW I THINK --KATE
        var buildTable = function () {
			
			$(".inputTable tr").remove();
			for (var i=0; i<model.currentInfo['data'].length;i++){
				addRow(i, inputTable)
			}
          
                saveBut = $('<a href="#saveBut" role="button" class="btn sBut" data-toggle="modal">Save</a>');
                var saveModal = $('<div id="saveBut" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-body">Please select a name for your recipe</div></div>');
                    var nameInp = $('<input type="text" id=recipeName width="150px"></input>');
                    var okModal = $('<button class="btn" data-dismiss="modal" aria-hidden="true" id="okModal">OK</button>');
             
                  cookButt.on("click", function () {
					  
					  var meat= $("input[type='radio'][name='meat']:checked").attr('id');
						model.currentInfo['names'][meat]=model.currentInfo['names'][meat]+1;
                        var name =  "My "+meat+" "+ model.currentInfo['names'][meat];
						model.saveRecipe(name);
                        var dropdown1 = $("#d1");
                        var dropdown2 = $("#d2");
                        dropdown1.append($('<option>' + name + '</option>'));
                        dropdown2.append($('<option>' + name + '</option>'));
                        var e1 = document.getElementById("d1");
                        var name1 = e1.options[e1.selectedIndex].text;
                        var e2 = document.getElementById("d2");
                        var name2 = e2.options[e2.selectedIndex].text;
                        var info = model.currentInfo['recipe'][name1];
                        d3.selectAll('.finalsteak').remove();

                       
                   drawFinished(info[0], info[1], info[2], info[3], 0,info[4],$('.mytog2:checked').attr('id'));
                var inf = model.currentInfo['recipe'][name2];
                drawFinished(inf[0], inf[1], inf[2], inf[3], 1,inf[4],$('.mytog2:checked').attr('id'));
							  
                        if ($("#recipeInput").closest(".tab-pane").hasClass("active")) {
                            var recipeString = $("#recipeInput").val();
                            model.parseRecipe(recipeString);
							
                        } else {
                            model.checkDiv();
                            updateTime();
				$('.tt').html(model.convertTime(model.currentInfo["totalTime"]));
                            model.buildData();


                            if (clicked && model.currentInfo["OKToGraph"]) {
                                graph(false, $('.mytog:checked').attr('id'))
                            } else {
                                d3.selectAll(".containers").remove();
                                d3.selectAll(".mysteak").remove();
                                model.dataClear();
                            }
                        }
                    });
              
				
                    $(".span3").append(cookButt);
                    addDropdown();
          
     
            

            model.dataClear();
			addAddButton();
            CookButtonFun(cookButton);
            closeRowFun();
        };

		
		
		//THIS FUNCTION JUST HAS A BARREL OF ISSUES
        var addRow = function (i, table) {
            var row = $("<tr class ='row' id='row" + i + "'></tr>");

            

            var rowiside1 = $("<td id='row" + i + "side1'></td>");
            var inp1_i = $("<input id='inp1_" + i + "' type=text></input>");
		
			var label=$("<span> "+i+"</span>");
			if(i<10){label.css("margin-left","8px");}
			label.css("margin-right","3px");
			label.css("font-size",'12px');
			label.css("text-anchor",'end');
            var flipButtoni = $("<button class='btn btn-mini flipButton' id='flipButton" + i + "'><font size=4px>&harr;</font></button>");
            rowiside1.append(label,inp1_i);

            var rowiside2 = $("<td id='row" + i + "side2' class='row" + i + "'></td>");
            var inp2_i = $("<input id='inp2_" + i + "' type='text'></input>");
          
            rowiside2.append(flipButtoni,inp2_i);
							 var durationi = $("<td id='duration" + i + "'></td>");
            var rowitime = $("<input id='row" + i + "time' type=text></input>");
			var rowibutton = $("<button type='button' id=row" + i + "button' class='close closeRow'>&times;</button>")
            durationi.append(rowitime,rowibutton);

            rowibutton.on("click", function () {
				$(".lastrow").remove();
				//$(".tt").remove();
                var rowNum = String($(this).attr("id").charAt(3))
                //NOW WE'RE REMOVING THE ROW WITH THE X NEXT TO IT
                row.remove();
                //REDUCING THE NUMBER OF EXPECTED ROWS
                model.numRowsMinus();
              
                //NOW WE NEED TO CHANGE THE ROW NUMBER OF ALL THE OTHER ROWS
                for (var l = i + 1; l < model.currentInfo["numRows"] + 1; l++) {
					
                    $("#row" + l).attr("id", String("row" + parseInt(l - 1)));
                    $("#row" + l + "time").attr("id", String("row" + parseInt(l - 1) + "time"))
                    $("#row" + l + "button").attr("id", String("row" + parseInt(l - 1) + "button"))
                    $("#duration" + l).attr("id", String("duration" + parseInt(l - 1)));
                    $("#row" + l + "side1").attr("id", String("row" + parseInt(l - 1) + "side1"));
                    $("inp1_" + l).attr("id", String("inp1_" + parseInt(l - 1)));
                    $("#row" + l + "side2").attr("id", String("row" + parseInt(l - 1) + "side2"));
                    $("#inp2_" + l).attr("id", String("inp2_" + parseInt(l - 1)));
                }
				addAddButton();
            })

            row.append( rowiside1, rowiside2,durationi)
            table.append(row);
            if (i < model.currentInfo['data'].length) {

                rowitime.val(model.convertTime(model.currentInfo['data'][i][0]));
                inp1_i.val(model.currentInfo['data'][i][1]);
                inp2_i.val(model.currentInfo['data'][i][2])
            } else {

                rowitime.val("4:00");
                inp1_i.val($(String("#inp1_" + parseInt(i - 1))).val() || 23);
                inp2_i.val($(String("#inp2_" + parseInt(i - 1))).val() || 180);
            }
			
			//model.numRowsPlus();
        }

		var addAddButton=function(){
			$('#lastrow').remove();
		
			 var row = $("<tr class ='row' id='lastrow'></tr>");
			var addButton = $("<td><button class='btn btnBar addButton' id='addButton" + model.currentInfo['numRows'] + "'>+</button></td>");
            addButtonFun(addButton)
	
			var label=$('<td><span>Total:</span></td>');
			label.css("text-align","right");
			updateTime();
			var info=$('<td><span class="tt">'+model.convertTime(model.currentInfo["totalTime"])+'</span></td>');
			row.append(addButton,label,info);
            inputTable.append(row);
		}
		
        var addButtonFun = function (addButton) {
            addButton.on("click", function () {
		
                addButton.remove();
			
                model.buildData();
                model.numRowsPlus();
                addRow(model.currentInfo['numRows']-1, $(".inputTable"));
				addAddButton();
				updateTime();
				$('.tt').html(model.convertTime(model.currentInfo["totalTime"]));
				$(".inputTableContainer").animate({
        scrollTop: 1000
    }, 300);


            });
        };


        var closeRowFun = function () {
            $(".closeRow").on("click", function () {
                var rowNum = String($(this).attr("id").charAt(3))
                $("#row" + rowNum).remove();
                model.numRowsMinus();

                //NOW WE NEED TO CHANGE THE ROW NUMBER OF ALL THE OTHER ROWS
                for (var l = rowNum + 1; l < model.currentInfo["numRows"]; l++) {
                    $("#row" + l).attr("id", "row" + l - 1);
                    $("#duration" + l).attr("id", "duration" + l - 1);
                    $("#row" + l + "side1").attr("id", "row" + l - 1 + "side1");
                    $("inp1_" + l).attr("id", "inp1_" + l - 1);
                    $("#row" + l + "side2").attr("id", "row" + l - 1 + "side2");
                    $("#inp2_" + l).attr("id", "inp2_" + l - 1);
                }

            });
        }



		var loadRecipe=function(recipe){

		}


        var graph = function (isFirst, falseColor) {

            d3.selectAll(".mysteak").remove();
            d3.selectAll(".containers").remove();
		
            model.dataClear();

            for (var e = 0; e < model.currentInfo["numRows"]; e++) {
				 
                var curTime = String($("#row" + e + "time").val());

                var cur1 = parseFloat($("#inp1_" + e).val());
                var cur2 = parseFloat($("#inp2_" + e).val());
			
                var time = curTime.replace(':', '.').split('.');
                if (time.length > 1) {
                    var sumtime = parseFloat(time[1])+ 60*parseFloat(time[0]);
                } else {
                    var sumtime = parseFloat(time[0]);
                }
				
			
                model.dataAdd([sumtime, cur1, cur2]);
					
            }
			
            var OKtoCook = true; //IF WE HAVE INVALID INPUTS, IT WILL BE CHANGED TO FALSE

            //THIS BIT IS CHECKING WHETHER THE THICKNESS AND INITIAL TEMP INPUTS ARE VALID
            $("#tempAlert").remove();
            $("#thickAlert").remove();
            var tempAlert = $("<div class='alert' id='tempAlert'>Temperature is not a valid number</div>");
            var thicknessAlert = $("<div class='alert' id='thickAlert'>Thickness is not a valid number</div>");
            if (String(parseInt($("#steakTemp").val())) == 'NaN') {
                $("#tempInpDiv").append(tempAlert);
                OKtoCook = false;
            } else if (($('.mytog2:checked').attr('id') == 'C')&&(parseInt($("#steakTemp").val()) < -273 )||
				($('.mytog2:checked').attr('id') == 'F')&&(parseInt($("#steakTemp").val()) < -459)) {
                $("#tempInpDiv").append(tempAlert);
                OKtoCook = false;
            } else {
                model.changeMeatTemp(parseFloat($("#steakTemp").val()))
            };

            if (String(parseInt($("#thicknessInp").val())) == 'NaN') {
                $("#thickInpDiv").append(thicknessAlert);
                OKtoCook = false;
            } else if (parseFloat($("#thicknessInp").val()) < 0.5 || parseFloat($("thicknessInp").val()) > 35) {
                $("#thickInpDiv").append(thicknessAlert);
                OKtoCook = false;
            } else {
                model.changeThickness(parseFloat($("#thicknessInp").val()))
            };

            //add to on click and calculate(blah,blah,blah, meatType)
            var meatType = $("input[type='radio'][name='meat']:checked").attr('id');


            if (falseColor == 'T') {

                meatType = 'False';
            }
		
            //THIS WILL COOK THE STEAK IF WE HAVE VALID INPUTS
            if (OKtoCook == true) {
                var steak = [model.currentInfo["data"][0][1]];
                for (var m = 0; m < parseFloat($("#thicknessInp").val()) * 10; m++) {
                    if ($('.mytog2:checked').attr('id') == 'C') {
                        steak.push(parseFloat($("#steakTemp").val()))
                    } else {
                        steak.push(toC(parseFloat($("#steakTemp").val())))
                    }
                }
                steak.push(model.currentInfo["data"][0][2]);
                  updateTime();
				$('.tt').html(model.convertTime(model.currentInfo["totalTime"]));
				
                calculate(model.currentInfo["data"], steak, meatType, isFirst, model.currentInfo["totalTime"], $('.mytog2:checked').attr('id'))
            }
        }
        var CookButtonFun = function (cookButton) {
            cookButton.on("click", function () {
		
                clicked = true;
                model.checkDiv();
                d3.selectAll(".mysteak").remove();
                d3.selectAll(".containers").remove();
                if (model.currentInfo["OKToGraph"]) {
                    d3.selectAll("svg").remove();
                    model.dataClear();
                    graph(true, '');
                };
            });
        }

        var timeFun = function (j) {
            $("#row" + j + "time").change(function () {

                if (j == 0) {
                    timeStep = parseInt($("#row" + j + "time").value);
                }


                if (j == 0) {
                    timeStep = parseInt($("#row" + j + "time").value);
                }

            })
        };

        var flipButtonFun = function (k) {
            $(".flipButton").on("click", function () {
                side1data = 0
                side1data += parseInt(parseFloat($('#inp1_' + k).val())) || 0;
                side2data = parseInt(parseFloat($('#inp2_' + k).val()));
                $('#inp1_' + k).val(side2data);
                $('#inp2_' + k).val(side1data);
            })
        };

        return {
            buildDisplay: buildDisplay,
            buildTable: buildTable,
            addButtonFun: addButtonFun,
            flipButtonFun: flipButtonFun,
            timeFun: timeFun
        }

    }


    var setup = function (div) {
        var model = Model();
        var view = View(div, model);

        perfectSteak.model = model;
        perfectSteak.view = view;
        //model.parseRecipe();



        view.buildDisplay();

        /* $('.inputTable').offset(
            top: 1030
        });*/




    };
    return {
        setup: setup
    };

}();

//call setup when the document is ready
$(document).ready(function () {
    $('.perfectSteak').each(function () {
        perfectSteak.setup($(this));
    });
});