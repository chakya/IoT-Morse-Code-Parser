//Initialize global variables
var admin = require("firebase-admin");
var b = require('bonescript');
var serviceAccount = require("./serviceAccountKey.json");
var motionInterval=null;
var morseSignal="";
currentCount=0;
var morseSeq=""
var message=""
var gapCount=0
var mSeq=""
var motion = "P8_7";
b.pinMode(motion, b.INPUT);
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assignment-2-team-94-482d5.firebaseio.com/"
});
// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var motionRef = db.ref("/motion"); // channel name
var messageRef = db.ref("/message")
//load morse from a text file called morse.txt
loadMorse("morse.txt");
var morseTable;
var stateRef = db.ref('/State/motion');

//read file from the same directory with filename filename
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

function main(data) {
  //initalize morseTable Data
  morseTable=data;
}

//process sequence of Long and shorts to be intepreted as Alphabet
function processSeq(seqInput){
  message=''
  morseSeq=''
  for(i = 0; i < seqInput.length; i++){
    message=streamSignal(seqInput[i], motionInterval);
}
return message
}

//Turn on and off motion Sensor
stateRef.on('value', function(snapshot) {
  toggleMotion(snapshot.val().state);
});

console.log('lets start')
function streamSignal(signal, motionInterval){
  motionRef.update({'/motionSeq':morseSignal});
//Update the database  
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
  else { 
    gapCount+=1
    if (gapCount===3){
      //parse
      if (morseTable[morseSeq]){
        message+=morseTable[morseSeq]
        if (message==='SK'){//terminate if SK
          clearInterval(motionInterval);
          console.log('terminated')
          return
        }
       
      }
      else{
        message+=''
      }
       morseSignal+=' '//add space to signify new word
        morseSeq=""
    }
    else if (gapCount===7){
      message+=" "//add space to message
      morseSignal+='_'//add space if new word
    }
  }
  messageRef.update({'/message':message});
  return message
}

  function printStatus(x){
    parseMotion(x.value)
  }
  

    function parseMotion(x) 
    {
        if(x === 1){
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
    
    
    
    function processMotion(mDetectedSeq){
       mSeq=""
        for(i = 0; i < mDetectedSeq.length; i++){
            mSeq=parseMotion(parseInt(mDetectedSeq[i]));//stream motions detected 0 if not detected 1 if detected
}
return mSeq
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
  

  }
  else
  {
      // if unchecked stop interval
      console.log("stop");
      //reset everything
      morseSeq=""
      message=""
      morseSignal=""
      clearInterval(motionInterval);
  }
}

module.exports = {
  processSeq:processSeq,
  processMotion: processMotion
}