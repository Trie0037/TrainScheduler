var config = {
    apiKey: "AIzaSyBYtSssMWewVD5Zetu2i_a0MDr--jgngPE",
    authDomain: "train-time-f8d12.firebaseapp.com",
    databaseURL: "https://train-time-f8d12.firebaseio.com",
    projectId: "train-time-f8d12",
    storageBucket: "train-time-f8d12.appspot.com",
    messagingSenderId: "540884784227"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit-btn").click(function () {
    //Creating variables for Train Schedule
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var trainFrequency = $("#frequency").val().trim();
    console.log(trainName);

    database.ref().push({

        Train: trainName,
        Destination: trainDestination,
        Frequency: trainFrequency,
        FirstTrain: firstTrain,
        //NextArrival: nextArrival,
        //MinutesAway: minutesAway,

        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });
});

/*Formatting Time of Departure and Upcoming Arrival with an emphasis on minutes away
var trainFrequency = $("#frequency").val().trim();
var dateFormat = moment().format('LLLL');
var frequencyConvert = moment(trainFrequency, dateFormat);
var firstTrain = moment($("#first-train").val().trim(), "HH:mm").format(); //Need to have a 'set' time.
var currentTime = moment();
var nextArrival = moment()
//var minutesAway = moment().endOf('').fromNow();*/

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {
    var trainFrequency = (childSnapshot.val().Frequency);
    var dateFormat = moment().format('LLLL');
    //var frequencyConvert = moment(trainFrequency, dateFormat);
    var firstTrain = moment($("#first-train").val().trim(), "HH:mm").format(); //Need to have a 'set' time.
    var currentTime = moment();
    //var currentDay = 
    var nextArrival = moment(childSnapshot.val().FirstTrain, "HH:mm");
    while (nextArrival.isBefore(currentTime)) {
        nextArrival.add(trainFrequency, "minutes");
    }
    var minutesAway = Math.abs(currentTime.diff(nextArrival, 'minutes'));
    console.log(minutesAway);
    console.log(nextArrival);
    var minutesAwayTd = $("<td>").html(minutesAway);
    var tBody = $("tbody");
    var tRow = $("<tr>");
    trainName = $("<td>").html(childSnapshot.val().Train);
    trainDestination = $("<td>").html(childSnapshot.val().Destination);
    trainFrequency = $("<td>").html(childSnapshot.val().Frequency);
    firstTrain = $("<td>").html(childSnapshot.val().FirstTrain); //this overrode Train Name, Destination, and Frequency
    nextArrivalTd = $("<td>").html(nextArrival.format('LT'));
    //minutesAway = $("<td>").html(childSnapshot.val().MinutesAway);

    tRow.append(trainName, trainDestination, trainFrequency, firstTrain, nextArrivalTd, minutesAwayTd); //nextArrival, minutesAway
    tBody.append(tRow);
});
