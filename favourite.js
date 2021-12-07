if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function() { console.log('Service Worker Registered'); });
}
  
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
        // document.getElementById("userProfile").innerHTML=firebase.auth().currentUser.displayName;
        document.getElementById(`suh`).innerHTML = `${firebase.auth().currentUser.displayName}'s Favourites`
        document.getElementById("userProfile").style.display="block";
        //Calling Function Of Fetching 
        fetchFavourites();

    } else {
        // No user is signed in
    } 
});
      
function signOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful
    }).catch(function(error) {
        // An error happened
        console.log(error);
    });
}
      
//fetching favourites 
var database = firebase.database();
  
  
//generateAdCard
function adCard(data,key){
return`
<div class="cardstyling col-lg-4 col-sm-6 portfolio-item">
    <div class="card h-100">
        <small>${data.displayName}</small>
        <img class="validate card-img-top" src=${data.url} style="padding: 1rem !important"/>
        <div class="card-body">
            <h3 class="card-title">${data.title}</h3>
            <h4 class="category">${data.category}</h4>
            <p class="validate card-text">${data.description}</p>
            <h5>${data.price}</h5>
            <button type="button" class="btn btn-danger" onclick="deleteFavourite('${key}',this)">Remove From Favourite</button>
        </div>
    </div>
</div>
`
}
  
//Delete Favourite
function deleteFavourite(key, button) {
    document.getElementById('row').removeChild(button.parentElement.parentElement.parentElement);
    var favouritesRef = database.ref('favourites/' + firebase.auth().currentUser.uid + `/` + key).set({});
}  
  
//search function
function searchFunction() {
    var search = document.getElementById('search');
    var filter = search.value.toUpperCase();
    var list =document.getElementsByClassName('card-title');
    for(i=0 ;i<list.length ;i++){
        if(list[i].innerText.toUpperCase().indexOf(filter) > -1){
            list[i].parentElement.parentElement.parentElement.style.display="";
        }
        else{
            var a =list[i].parentElement.parentElement.parentElement;
            a.parentElement.removeChild(a);
        }
    }
}

//CategoySelection   
function selectCategory() {
    var selectCategory = document.getElementById(`homePageCategorySelection`);
    selectCategory.options[selectCategory.selectedIndex].value;
    var categoryDivs =document.getElementsByClassName(`category`);
    for(i=0 ;i<categoryDivs.length ;i++){
        if(selectCategory.options[selectCategory.selectedIndex].value === `All Categories`){
            categoryDivs[i].parentElement.parentElement.parentElement.style.display="";
        }
        else if(selectCategory.options[selectCategory.selectedIndex].value === `${categoryDivs[i].innerHTML}`){
            categoryDivs[i].parentElement.parentElement.parentElement.style.display="";
        }
        else{
            categoryDivs[i].parentElement.parentElement.parentElement.style.display="none";
        }
    }
}
      
//fetching code
function fetchFavourites(){
    userId = firebase.auth().currentUser.uid;
    fetch(`https://ecommerce-test-a26fc-default-rtdb.firebaseio.com/favourites/${userId}.json`)
    .then(data => {
        return data.json();
    })
    .then(data2 => {
        document.getElementById(`row`).innerHTML = "";
        for(let i in data2){
            document.getElementById(`row`).innerHTML += adCard(data2[i],i);
        }
    })
}