function signOut(){
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // console.log(user);
      // User is signed in.
      document.getElementById("activeUser").style.display="block";
      document.getElementById("inActiveUser").style.display="none";
      document.getElementById("postad").style.display="block";
      // document.getElementById("greetUser").style.display="block";
      // document.getElementById("greetUser").style.color="yellow";
      // document.getElementById("greetUser").innerHTML = `Welcome ${firebase.auth().currentUser.displayName} !`;
      // document.getElementById(`titlepage`).innerHTML = firebase.auth().currentUser.displayName;
      // document.getElementById("userProfile").innerHTML=firebase.auth().currentUser.displayName;
      document.getElementById(`suh`).innerHTML = `Ads By ${firebase.auth().currentUser.displayName}`

      //Calling Fetching Function

      fetchUserAds();

    } else {
      // No user is signed in.
    } 
  });
  
  function signOut(){
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }
  
  //Declaring Firebase Database 
  var database = firebase.database();
  var userAds = database.ref("ads/");

  //Fetching UserAds
  function fetchUserAds(){
    userAds.on('child_added', function (data) {
      var a=data.val()
      
      var uid = a.uid;
      
    if(uid===firebase.auth().currentUser.uid){
    adCard(data.val(), data.key);
    document.getElementById("row").innerHTML += adCard(data.val(), data.key);
    }
  });
    }

  //Generating AdCard

  function adCard(data, key){
   return`
    <div class="cardstyling col-lg-4 col-sm-6 portfolio-item">
      <div class="card h-100">
        <img class="validate card-img-top" src=${data.url} style="padding: 1rem !important"/>
        <div class="card-body">
        <h3 class="card-title">${data.title}</h3>
        <h4 class="category">${data.category}</h4>
        <p class="validate card-text">${data.description}</p>
        <h5>&#8377; ${data.price}</h5>
        <button type="button" class="btn btn-danger" onclick="deleteAd('${key}',this)">Delete</button>
        </div>
      </div>
    </div>
  `
    }

  //Delete Ad 

  function deleteAd(key, button) {
    
    document.getElementById('row').removeChild(button.parentElement.parentElement.parentElement);
    database.ref('ads/' +  `/` + key).set({});
    
  }  

  //search function
  function searchFunction() {
    var search = document.getElementById('search');
    var filter = search.value.toUpperCase();
    var list =document.getElementsByClassName('card-title');
    for(i=0 ;i<list.length ;i++){
      // console.log(list[i].innerText);
        if(list[i].innerText.toUpperCase().indexOf(filter) > -1){
          list[i].parentElement.parentElement.parentElement.style.display="";
        }
      else{
        var a =list[i].parentElement.parentElement.parentElement;
        a.parentElement.removeChild(a);

      }
    }
  }

//HomePageCategoySelection

function selectCategory() {
  // var categoryOnHomepage = document.getElementById(`homePageCategorySelection`);
  // categoryOnHomepage.options[categoryOnHomepage.selectedIndex].value;
  var selectCategory = document.getElementById(`homePageCategorySelection`);
  selectCategory.options[selectCategory.selectedIndex].value;
  var categoryDivs =document.getElementsByClassName(`category`);

  for(i=0 ;i<categoryDivs.length ;i++){

    
    // console.log(categoryDivs[i].innerHTML);
    if(selectCategory.options[selectCategory.selectedIndex].value === `All Categories`){
      categoryDivs[i].parentElement.parentElement.parentElement.style.display="";
    }
    else if(selectCategory.options[selectCategory.selectedIndex].value === `${categoryDivs[i].innerHTML}`){
      // console.log(categoryDivs[i].innerHTML)
      categoryDivs[i].parentElement.parentElement.parentElement.style.display="";
    }
    else{
      categoryDivs[i].parentElement.parentElement.parentElement.style.display="none";
    }
  }
}  