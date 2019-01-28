$(document).ready(function() {
    
 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyBvccAjuf0MOsHiLeF0vwMZ_jYhMbN5BH0",
    authDomain: "train-51419.firebaseapp.com",
    databaseURL: "https://train-51419.firebaseio.com",
    projectId: "train-51419",
    storageBucket: "train-51419.appspot.com",
    messagingSenderId: "999807913384"
  };
  firebase.initializeApp(config);
    
    // a var for database
     var database = firebase.database();
    
    // button to submit the user given info
    $("#trainInfoBtn").on("click", function(event) {
        event.preventDefault(); 
    
        //input values to variables
        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();
        var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("X");
        var frequency = $("#freq").val().trim();
    

        //new train info to link with firebase def
        var newTrain = {
            train: trainName,
            trainGoing: destination,
            trainComing: firstTime,
            everyXMin: frequency
        };
    
        //uploads newTrain to firebase
        database.ref().push(newTrain);
        
        //clears elements 
        $("#name").val("");
        $("#dest").val("");
        $("#firstTime").val("");
        $("#freq").val("");
    
        return false;
    
    }); 
    
    //adding to current Train Schedule table from Add Train Input
    database.ref().on("child_added", function(childSnapshot,prevChildKey) {
    
            //console.log(childSnapshot.val());
            //store in variables
            var trainName = childSnapshot.val().train;
            var destination =childSnapshot.val().trainGoing;
            var firstTime = childSnapshot.val().trainComing;
            var frequency = childSnapshot.val().everyXMin;
    
    //console.log(trainName);
    //console.log(destination);
    //console.log(firstTime);
    //console.log(frequency);
    
            //define current time
            var trainTime = moment(firstTime, "hh:mm a").subtract(1, "years");
            var currentTime = moment().format("HH:mm a");
            console.log("Current Time:" + currentTime);
            
            //difference
            var difference =  moment().diff(moment(trainTime),"minutes");
    
            //time left
            var trainRemain = difference % frequency;
    
            //minutes until arrival
            var minUntil = frequency - trainRemain;
    
            //next arrival time
            var nextArrival = moment().add(minUntil, "m").format("hh:mm a");
    
            //adding info to main table 
            $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");
    
    });
    });
    