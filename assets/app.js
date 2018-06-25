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
       
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });
});

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {
    var trainFrequency = (childSnapshot.val().Frequency);
    var dateFormat = moment().format('LLLL');
    
    var firstTrain = moment($("#first-train").val().trim(), "HH:mm").format();
    var currentTime = moment();
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
    firstTrain = $("<td>").html(childSnapshot.val().FirstTrain); 
    nextArrivalTd = $("<td>").html(nextArrival.format('LT'));
    
    tRow.append(trainName, trainDestination, trainFrequency, firstTrain, nextArrivalTd, minutesAwayTd); 
    tBody.append(tRow);
});
