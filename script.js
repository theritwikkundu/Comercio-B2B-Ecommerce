if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('./service-worker.js')
    .then(function() { console.log('Service Worker Registered'); });
}
  
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById("activeUser").style.display="block";
        document.getElementById("userProf").style.display="block";
        document.getElementById("pending").style.display="block";
        document.getElementById("inActiveUser").style.display="none";
        document.getElementById("postad").style.display="block";
        // document.getElementById("userProfile").innerHTML=firebase.auth().currentUser.displayName;
        document.getElementById("favourite").style.display="block";
    }
    else {
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
  
function adCard(data, key){
    
    if(firebase.auth().currentUser === null){
        return`
            <div class="cardstyling col-lg-4 col-sm-6 portfolio-item">
                <div class="card h-100">
                    
                    <img class="validate card-img-top" src=${data.url}  style="padding: 1rem !important"/> 
                    <div class="card-body">
                        <h3 class="card-title">${data.title}</h3>
                        <small>By ${data.displayName}</small>
                        <h4 class="category">${data.category}</h4>
                        <p class="validate card-text">${data.description}</p>
                        <h5>Rs. ${data.price}</h5>
                        <button type="button" class="btn btn-primary" onclick="signInFirst()" id="primaryBtn">Chat</button>
                        <button type="button" class="btn btn-warning" onclick="signInFirst()" id="secondaryBtn">Add To Favourites</button>
                    </div>
                </div>
            </div>
        `
    }else{
        return`
        <div class="cardstyling col-lg-4 col-sm-6 portfolio-item">
        <div class="card h-100">
            
            <img class="validate card-img-top" src=${data.url}  style="padding: 1rem !important"/>
            <div class="card-body">
            <h3 class="card-title">${data.title}</h3>
            <small>By ${data.displayName}</small>
            <h4 class="category">${data.category}</h4>
            <p class="validate card-text">${data.description}</p>
            <h5>Rs. ${data.price}</h5>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap" onclick="adChat('${key}',this)" id="primaryBtn">Chat</button>
            <button type="button" class="btn btn-warning" onclick="addToFavourites(this)" id="secondaryBtn">Add To Favourites</button>
        </div>
        </div>
        </div>
        `
    }
} 
  
var database = firebase.database();
const adsRef = database.ref("ads");

function fetchAds(){
    adsRef.on('child_added', function (data) {
        if(data.val().verifyed){
            adCard(data.val(), data.key);
            document.getElementById("row").innerHTML += adCard(data.val(), data.key);
        }
    });
}
  
//Calling Fetching Function
fetchAds();
  
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
        list[i].parentElement.parentElement.parentElement.style.display="none";
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
  
//Favourites Function
function addToFavourites(button){
    var category=button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    var description=button.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    var displayName=button.parentElement.parentElement.firstElementChild.innerHTML;
    var price=button.previousElementSibling.previousElementSibling.innerHTML;
    var title=button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    var url=button.parentElement.parentElement.firstElementChild.nextElementSibling.src;

    database.ref('favourites/' + firebase.auth().currentUser.uid).push().set({
        category : category,
        description : description,
        displayName : displayName,
        price : price,
        title : title,
        url : url
    });
}
  
function signInFirst(){
    window.location.href = "signin.html";
}
  
//Chat For Ads 
$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
})
  
var adKey ;
function adChat(key, button){
    document.getElementById(`modal-list`).innerHTML = "";
    adKey = key;
    var title = button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    document.getElementById(`exampleModalLabel`).innerHTML = title ;
    fetchMessages(key);
}

function sendMessage(){
    newMessage = document.getElementById(`recipient-messege`).value;
    database.ref('ads/' + adKey +`/messages`).push().set({
        senderName : firebase.auth().currentUser.displayName,
        message : newMessage,
        timeStamp : formatAMPM(time)
    });
    document.getElementById(`recipient-messege`).value="";
    return false;
}

function chatMessages(data, key){
    return`
        <li><b>${data.senderName} :</b> ${data.message} <small class="text-messages">${data.timeStamp}</small></li>
    `
}
  
function fetchMessages(key){
    var messagesRef = database.ref('ads/' + key +`/messages`);
    messagesRef.on('child_added', function (data) {
        chatMessages(data.val(), data.key);
        document.getElementById("modal-list").innerHTML += chatMessages(data.val(), data.key);
    });
}
  
//Time Stamp Function
function formatAMPM(date) {
    var stringDate = date.toDateString()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = stringDate + " " + hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
  
var time = new Date();