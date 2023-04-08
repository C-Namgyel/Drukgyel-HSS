//Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
  import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
  const firebaseConfig = {
    apiKey: "AIzaSyBUSb8D9xWqda-FGEVfTeEokSMTawyCrFI",
    authDomain: "drukgyel-hss.firebaseapp.com",
    databaseURL: "https://drukgyel-hss-default-rtdb.firebaseio.com",
    projectId: "drukgyel-hss",
    storageBucket: "drukgyel-hss.appspot.com",
    messagingSenderId: "930189749346",
    appId: "1:930189749346:web:22152d4d206ecd6b4ef53b",
    measurementId: "G-D1QK09ZJEN"
  };
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase()
const storage = getStorage(app);
const storageRef = ref(storage);
//Setup
localStorage.removeItem("Drukgyel-HSS-User")
//Login
var profPic
document.getElementById("profilePicInp").oninput = function() {
    profPic = this.files[0]
    let objURL = URL.createObjectURL(profPic)
    document.getElementById("profilePic").style.backgroundImage = "url('"+objURL+"')";
}
document.getElementById("loginBtn").onclick = function() {
  if (document.getElementById("username").value.trim() != "" && document.getElementById("email").value.trim() != "" && document.getElementById("username").files != undefined) {
    let btn = document.getElementById("loginBtn")
    btn.disabled = true;
    let storageRef = ref(storage, document.getElementById("email").value + "/" + profPic.name);
    btn.innerHTML = ("Profile picture upload started")
    uploadBytes(storageRef, profPic).then((snapshot) => {
      btn.innerHTML = ("Profile Picture Uploaded<br>Creating Account")
      getDownloadURL(storageRef).then((Url) => {
          console.log(Url)
          btn.innerHTML = ("Creating Account")
          set(dbRef(database, "users/" + document.getElementById("username").value), {
              username: document.getElementById("username").value,
              email: document.getElementById("email").value,
              pic : Url
          }).then(() => {
              localStorage["Drukgyel-HSS-User"] = JSON.stringify(
                  {
                      username: document.getElementById("username").value,
                      email: document.getElementById("email").value,
                      type: "DHSS-Attendance",
                      pic: Url
                  }
              )
              setWindow("../home/home.html")
            });
        })
    });
  } else {
    alert("Please fill up all the spaces and also add a profile picture to login")
  }
}