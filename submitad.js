function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
      console.log(error);
    });
}
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
    document.getElementById("favourite").style.display = "block";
  } else {
    // No user is signed in.
  }
});
var database = firebase.database();

function submitAdForm() {
  var form = document.getElementById("submitAdForm");
  var title = form.title.value;
  var description = form.description.value;
  var category = form.category.options[form.category.selectedIndex].value;
  var price = form.price.value;

  //Uploading Image To Storage

  const ref = firebase.storage().ref();
  const file = document.getElementById("addimage").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type,
  };
  const task = ref.child("ads").child(name).put(file, metadata);
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      //adding Data TO Database

      var uid = firebase.auth().currentUser.uid;
      var displayName = firebase.auth().currentUser.displayName;
      var newAd = database.ref(`ads/`).push();
      newAd.set({
        title: title,
        description: description,
        price: price,
        uid: uid,
        url: url,
        category: category,
        displayName: displayName,
        verifyed: false,
      });
    })
    .catch(console.error)
    .then(() => {
      document.getElementById("submitAdSuccessfull").style.display = "block";
      document.getElementById("submitAdSuccessfull").innerHTML =
        "Succesfully Posted";
    })
    .then(() => {
      setTimeout(function () {
        var user = firebase.auth().currentUser;
        if (user !== null) {
          window.location.href = "userprofile.html";
        }
      }, 3000);
    });
  // form.reset();
}
