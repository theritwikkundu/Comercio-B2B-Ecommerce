// var admynRef=false;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").then(function () {
    console.log("Service Worker Registered");
  });
}

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
    // console.log(user.uid);
    // User is signed in.
    document.getElementById("activeUser").style.display = "block";
    document.getElementById("inActiveUser").style.display = "none";
    document.getElementById("postad").style.display = "block";
    // document.getElementById("userProfile").innerHTML = firebase.auth().currentUser.displayName;
    document.getElementById(`suh`).innerHTML = `Pending Ads`;
    document.getElementById("userProfile").style.display = "block";

    firebase
      .database()
      .ref(`users/${user.uid}`)
      .on("value", function (snap) {
        snap.forEach(function (childNodes) {
          // admynRef = childNodes.val().admyn;
          sessionStorage.setItem("admynRef", childNodes.val().admyn);
        });
      });
    // console.log(admynRef);
    //Calling Function Of Fetching
    // fetchPending();
  } else {
    // No user is signed in
  }
});

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful
    })
    .catch(function (error) {
      // An error happened
      console.log(error);
    });
}

//fetching favourites
var database = firebase.database();

//generateAdCard
function adCard(data, key) {
  return `
<div class="cardstyling col-lg-4 col-sm-6 portfolio-item">
    <div class="card h-100">
        <p> &nbsp; &nbsp; <small>${data.displayName}</small></p>
        <img class="validate card-img-top" src=${data.url} style="padding: 1rem !important"/>
        <div class="card-body">
            <h3 class="card-title">${data.title}</h3>
            <h4 class="category">${data.category}</h4>
            <p class="validate card-text">${data.description}</p>
            <h5>&#8377; ${data.price}</h5>
            <button type="button" class="btn btn-danger" onclick="markVerified('${data.url}',this)">Mark as verified</button>
        </div>
    </div>
</div>
`;
}

//Mark verified
function markVerified(key, button) {
  // console.log(key);

  var query = database.ref("ads").orderByChild("url").equalTo(key);
  query.once("child_added", function (snapshot) {
    snapshot.ref.update({ verifyed: true });
  });
  window.alert("Product has been verified");
  window.location.reload();
  // document.getElementById('row').verifyed=1;
  // var favouritesRef = database.ref('favourites/' + firebase.auth().currentUser.uid + `/` + key).set({});
}

//search function
function searchFunction() {
  var search = document.getElementById("search");
  var filter = search.value.toUpperCase();
  var list = document.getElementsByClassName("card-title");
  for (i = 0; i < list.length; i++) {
    if (list[i].innerText.toUpperCase().indexOf(filter) > -1) {
      list[i].parentElement.parentElement.parentElement.style.display = "";
    } else {
      var a = list[i].parentElement.parentElement.parentElement;
      a.parentElement.removeChild(a);
    }
  }
}

//CategoySelection
function selectCategory() {
  var selectCategory = document.getElementById(`homePageCategorySelection`);
  selectCategory.options[selectCategory.selectedIndex].value;
  var categoryDivs = document.getElementsByClassName(`category`);
  for (i = 0; i < categoryDivs.length; i++) {
    if (
      selectCategory.options[selectCategory.selectedIndex].value ===
      `All Categories`
    ) {
      categoryDivs[i].parentElement.parentElement.parentElement.style.display =
        "";
    } else if (
      selectCategory.options[selectCategory.selectedIndex].value ===
      `${categoryDivs[i].innerHTML}`
    ) {
      categoryDivs[i].parentElement.parentElement.parentElement.style.display =
        "";
    } else {
      categoryDivs[i].parentElement.parentElement.parentElement.style.display =
        "none";
    }
  }
}
const adsRef = database.ref("ads");
// const admynRef = database.ref("users");

//fetching code
//

function fetchPending() {
  // var admynRef = Boolean(firebase.auth().currentUser.admyn);
  // console.log(typeof sessionStorage.getItem("admynRef"));
  adsRef.on("child_added", function (data) {
    if (sessionStorage.getItem("admynRef") !== "true") {
      document.getElementById("row").innerHTML += "You must be an Admin to view this page";
    }
    if (
      data.val().verifyed === false &&
      sessionStorage.getItem("admynRef") === "true"
    ) {
      adCard(data.val(), data.key);
      document.getElementById("row").innerHTML += adCard(data.val(), data.key);
    }
  });

  // userId = firebase.auth().currentUser.uid;
  // fetch(`https://ecommerce-test-a26fc-default-rtdb.firebaseio.com/favourites/${userId}.json`)
  // .then(data => {
  //     return data.json();
  // })
  // .then(data2 => {
  //     document.getElementById(`row`).innerHTML = "";
  //     for(let i in data2){
  //         document.getElementById(`row`).innerHTML += adCard(data2[i],i);
  //     }
  // })
}

fetchPending();
