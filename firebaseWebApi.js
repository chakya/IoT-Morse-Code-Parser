var led=document.getElementById("cmn-toggle-1");
var motion=document.getElementById("cmn-toggle-2");
var motionCount=document.getElementById('motionCount');
var longHTML=document.getElementById('longMotionHTML');
var shortHTML=document.getElementById('shortMotionHTML');
var intruderHTML=document.getElementById('intruderHTML');

function Server() {
  this.checkSetup();
  this.initFirebase();
  // this.loadMessages();
  this.ledDB();
this.motionDB();
}
    // this.switchLED();



  Server.prototype.initFirebase = function () {
    this.database = firebase.database();
    this.storage = firebase.storage();
  };


Server.prototype.motionDB = function () {
    motionState = this.database.ref('motionState');
    // Make sure we remove all previous listeners.
    motionState.off();
}

function motionSwitch(){
       if (motion.checked===true) {
         console.log('on')
        firebase.database().ref("/State").update({'/motion/state':1});
       }
      else {
        console.log('off')
        firebase.database().ref("/State").update({'/motion/state':0});
      }

     }

function reset(){
  console.log('reset')
  firebase.database().ref("/motionData").update({'/longMotion':'', '/shortMotion':'','/intruder':'','/motion':''});
}


 


  // Checks that the Firebase SDK has been correctly setup and configured.
  Server.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
      window.alert('Your Firebase Storage bucket has not been enabled.');
    }
  };


window.onload = function () {
  window.Server = new Server();
};

var motionDataRef = firebase.database().ref('/motionData');
motionDataRef.on('value', function(snapshot) {
  updateHTML(snapshot.val());
});

function updateHTML(data){
  console.log('update running')
  motionCount.innerHTML=data.motion;
  longHTML.innerHTML=data.longMotion;
  shortHTML.innerHTML=data.shortMotion;
  intruderHTML.innerHTML=data.intruder;
}



