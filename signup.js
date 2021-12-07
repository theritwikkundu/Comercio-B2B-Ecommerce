firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // console.log(user);
    // User is signed in.
    document.getElementById("activeUser").style.display = "block";
    document.getElementById("inActiveUser").style.display = "none";
    document.getElementById("postad").style.display = "block";
    // document.getElementById("userProfile").innerHTML = firebase.auth().currentUser.displayName;
    //   document.getElementById("greetUser").style.display="block";
    //   document.getElementById("greetUser").innerHTML = `Welcome ${firebase.auth().currentUser.displayName} !`;
    //   document.getElementById("greetUser").style.color="yellow";
  } else {
    // No user is signed in.
  }
});
//Data Base Reference
var database = firebase.database();
function signUp() {
  var successful = true;
  var form = document.getElementById("signUpForm");
  var userName = form.userName.value;
  var email = form.email.value;
  var password = form.password.value;
  //firebase Mehtod
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      successful = false;
      document.getElementById("alreadyAccount").style.display = "block";
      document.getElementById("alreadyAccount").innerHTML = errorMessage;
    })
    .then(() => {
      //adding Data TO Database
      var uid = firebase.auth().currentUser.uid;
      var newUserRef = database.ref(`users/${uid}`).push();
      newUserRef.set({
        userName: userName,
        email: email,
        password: password,
        uid: uid,
        admyn: false,
      });
    })
    .then(() => {
      var user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: userName,
        })
        .then(function () {
          // Update successful.
        })
        .catch(function (error) {
          // An error happened.
        });
    })
    .then(() => {
      if (successful === true) {
        document.getElementById("accountRegistered").style.display = "block";
        document.getElementById("accountRegistered").innerHTML =
          "Succesfully Signed Up";
      }
    })
    .then(() => {
      setTimeout(function () {
        var user = firebase.auth().currentUser;
        if (user !== null) {
          window.location.href = "index.html";
        }
      }, 3000);
    });
}
//sign in button
function goToSignIn() {
  window.location.href = "signin.html";
}
