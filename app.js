var admin = require("firebase-admin");
var b = require('bonescript');

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
var motionInterval=null;
var morseSignal="";
currentCount=0;
var morseSeq=""
var message=""
var gapCount=0
var mSeq=""
var motion = "P8_7";
b.pinMode(motion, b.INPUT);

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
    message=streamSignal(seqInput[i], motionInterval);
}
return message
}


var stateRef = db.ref('/State/motion');
stateRef.on('value', function(snapshot) {
  toggle(snapshot.val());
});

function toggle(data){
  toggleMotion(data.state)
}
// function toggleLed (state) {
//   b.digitalWrite(led, state);
// }


console.log('lets start')
function streamSignal(signal, motionInterval){
  motionRef.update({'/motionSeq':morseSignal});
  
    if (signal==='L'){
      motionRef.update({'/motionType':'Long'});
    }
    else if (signal==='S'){
      motionRef.update({'/motionType':'Short'});
    }
  if (signal !=" ")
  {
    morseSeq+=signal
    morseSignal+=signal
    gapCount=0
  }
  else { //if (signal===" ")
    gapCount+=1
    if (gapCount===3){
      //parse
      console.log(morseTable[morseSeq])
      if (morseTable[morseSeq]){
        message+=morseTable[morseSeq]
        if (message==='SK'){
          clearInterval(motionInterval);
          console.log('terminated')
          return
        }
       
      }
      else{
        message+=''
      }
       morseSignal+=' '
        morseSeq=""
    }
    else if (gapCount===7){
      message+=" "
      morseSignal+='_'
    }
  }
  messageRef.update({'/message':message});
  return message
}

function toggleMotion(state){
  if (state===1)// if checked activate motion detector
  {
      console.log('on')
      mSeq=""
      messageRef.update({'/message':''});
      motionRef.update({'/motionType':'','motionSeq':''});
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
        streamSignal(" ",motionInterval)
              if (currentCount>3)// if motion more than 3 seconds
              {
                //  });
                  motionState="L"
                  mSeq+=motionState
                  streamSignal(motionState)
                  currentCount=0;
              }
              else if(currentCount>=1){// if 1<= motion<3 
                  motionState="S"
                  mSeq+=motionState
                  streamSignal(motionState, motionInterval)
                  currentCount=0;
              }
    }
    return mSeq
    }
    
    
    function streamMotion(mDetectedSeq){
        for(i = 0; i < mDetectedSeq.length; i++){
            motionSeq=printStatus(mDetectedSeq[i]);
            console.log(motionSeq)
}
    }
  }
  else
  {
      // if unchecked stop interval
      console.log("stop");
      morseSeq=""
      message=""
      morseSignal=""
      clearInterval(motionInterval);
  }
}

module.exports = {
  processSeq:processSeq,
}