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

function signIn() {
  signInSuccessfull = true;
  var form = document.getElementById("signInForm");
  var email = form.email.value;
  var password = form.password.value;
  //firebase Mehtod
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      document.getElementById("wrongInfo").style.display = "block";
      document.getElementById("wrongInfo").innerHTML = errorMessage;
      signInSuccessfull = false;
      // if(errorMessage !== ""){
      //     window.location.href = "index.html";
      // }
    })
    .then(() => {
      if (signInSuccessfull === true) {
        document.getElementById("signInSuccessfull").style.display = "block";
        document.getElementById("signInSuccessfull").innerHTML =
          "Succesfully Signed In";
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
function goToSignUp() {
  window.location.href = "signup.html";
}
// function gotoHome() {
//     var user = firebase.auth().currentUser;
//     if(user !== null){
//         window.location.href = "index.html";
//     }}
