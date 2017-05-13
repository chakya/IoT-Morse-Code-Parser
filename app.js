// var admin = require("firebase-admin");
// var b = require('bonescript');

//Initialize all var needed for beaglebone
// var led = "P8_8";
// b.pinMode(led, 'out');
// var motion = "P8_7";
// var motionInterval=null;
// b.pinMode(motion, b.INPUT);
// // Fetch the service account key JSON file contents
// var serviceAccount = require("./serviceAccountKey.json");
// var currentCount=0;
// // var seq4='0000'
// // Initialize the app with a service account, granting admin privileges
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://assignment-2-team-94-482d5.firebaseio.com/"
// });

// // As an admin, the app has access to read and write all data, regardless of Security Rules
// var db = admin.database();
// var stateRef = db.ref("/State"); // channel name
// var motionData= db.ref("/motionData")
// // ledRef.off()

// stateRef.limitToLast(50).on('child_changed', toggle);



function toggle(data){
  var val = data.val();
  if (val.type=='led'){
  toggleLed(val.state);
  }
  else{
  toggleMotion(val.state)
  }
}


function toggleLed (state) {
  b.digitalWrite(led, state);
}
var morseSeq=''
var message=''
var gapCount=0
function streamSignal(signal){
  if (signal !=' ')
  {
    morseSeq+=signal
    gapCount=0
  }
  else { //if (signal===' ')
    gapCount+=1
    if (gapCount===3){
      //parse
      message+=morseTable[morseSeq]
      morseSeq=''
    }
    else if (gapCount===7){
      message+=' '
    }
  }
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
         
    }
// if (seq4=='LSLL'){
//   console.log('Intruder Alert!!')
//    motionData.once('value', function(Snapshot) {
//     intruderCount = parseInt(Snapshot.val().intruder);
//     intruderCount+=1
//     motionData.update({'/intruder':intruderCount});
//     seq4='0000'
  // });

// }
// else{
//   console.log('no intruder')
// }      
    }
  }
  else
  {
      // if unchecked stop interval
      console.log('stop');
      clearInterval(motionInterval);
  }

}
