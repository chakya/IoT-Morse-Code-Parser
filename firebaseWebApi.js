var motion=document.getElementById("cmn-toggle-2");
var mSeq=document.getElementById('mSeq');
var mState=document.getElementById('mState');
var messageHTML=document.getElementById('message');

function Server() {
  this.checkSetup();
  this.initFirebase();
  // this.loadMessages();
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
  firebase.database().ref("/motion").update({'/motionSeq':'', '/motionType':''});
  firebase.database().ref("/message").update({'/message':''});
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

var motionRef = firebase.database().ref('/motion');
motionRef.on('value', function(snapshot) {
  updateHTML(snapshot.val());
});

var messageRef = firebase.database().ref('/message');
messageRef.on('value', function(snapshot) {
  messageHTML.innerHTML=snapshot.val().message;
});

function updateHTML(data){
  console.log('update running')
  mState.innerHTML=data.motionType;
  mSeq.innerHTML=data.motionSeq;
}





