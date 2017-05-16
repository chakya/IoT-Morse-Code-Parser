var admin = require("firebase-admin");
// var b = require('bonescript');

var serviceAccount = require("./serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assignment-2-team-94-482d5.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var motionRef = db.ref("/motion"); // channel name
var messageRef = db.ref("/message")


function loadMorse(filename){
  var fs = require("fs");
  fs.readFile("./morse.txt", "utf8", function (err,data) {
    if (err) {
      return console.log(err);
    }
  myData= JSON.parse(data); 
  main(myData);
  });
}


loadMorse("morse.txt");
var morseTable;
function main(data) {
  // Receive user input
  var readline = require("readline");
  var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  });
  morseTable=data;
  rl.question("Input your test sequence? ", (seqInput) => {
  message=processSeq(seqInput);
  console.log(message);
  rl.close();
});
}


function processSeq(seqInput){
  message=''
  morseSeq=''
  for(i = 0; i < seqInput.length; i++){
    message=streamSignal(seqInput[i]);
}
return message
}

function toggle(data){
  // var val = data.val();
  // if (val.type=="led"){
  // toggleLed(val.state);
  // }
  // else{
  toggleMotion(val.state)
}
// function toggleLed (state) {
//   b.digitalWrite(led, state);
// }

var morseSeq=""
var message=""
var gapCount=0
function streamSignal(signal){
  motionRef.update({'/motionSeq':morseSeq});
    if (signal==='L'){
      motionRef.update({'/motionType':'Long'});
    }
    else if (signal==='S'){
      motionRef.update({'/motionType':'Short'});
    }
  if (signal !=" ")
  {
    morseSeq+=signal
    gapCount=0
  }
  else { //if (signal===" ")
    gapCount+=1
    if (gapCount===3){
      //parse
      message+=morseTable[morseSeq]
      morseSeq=""
    }
    else if (gapCount===7){
      message+=" "
    }
  }
  messageRef.update({'/message':message});
  return message
}

function toggleMotion(state){
  if (state===1)// if checked activate motion detector
  {
    motionInterval=setInterval(checkPIR, 1000); // Checks the Sensor Every Second
    function checkPIR(){
    b.digitalRead(motion, printStatus);
  }
  
    function printStatus(x) 
    {
        if(x.value === 1){
        console.log("Motion Detected");
        // socket.emit("motionDetected", currentCount)
        currentCount+=1
    }
        else
        {
        console.log("No Motion Detected");
              if (currentCount>3)// if motion more than 3 seconds
              {
                //  motionData.once("value", function(Snapshot) {
                //     longCount = parseInt(Snapshot.val().longMotion);
                //     motionCount = parseInt(Snapshot.val().motion);
                //     motionCount+=1;
                //     longCount+=1;
                //     motionDatdsa.update({"/longMotion":longCount, "/motion":motionCount});
                    
                //  });
                  motionState="L"
                  streamSignal(motionState)
                  // seq4=seq4.substr(1)
                  // console.log(seq4)
                  //pass long count and motion count to be updated in client html 
                  // socket.emit("longMotionPoll",longCount, motionCount)
                  currentCount=0;
              }
              else if(currentCount>=1){// if 1<= motion<3 
                //     motionData.once("value", function(Snapshot) {
                //     shortCount = parseInt(Snapshot.val().shortMotion);
                //     motionCount = parseInt(Snapshot.val().motion);
                //     motionCount+=1;
                //     shortCount+=1;
                //  });
              
                  //pass short count and motion count to be updated in client html 
                  // socket.emit("shortMotionPoll",shortCount, motionCount)
                  motionState="S"
                  streamSignal(motionState)
                  // seq4=seq4.substr(1)
                  // console.log(seq4)
                  currentCount=0;
              }
    }
    }
  }
  else
  {
      // if unchecked stop interval
      console.log("stop");
      clearInterval(motionInterval);
  }
}

module.exports = {
  processSeq:processSeq,
}