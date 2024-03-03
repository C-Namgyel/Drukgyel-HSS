// Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

// App installer
let deferredPrompt;

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

if (document.getElementById("installButton") != null) {
    document.getElementById("installButton").onclick = function() {
        if (deferredPrompt) {
            // Show the installation prompt
            deferredPrompt.prompt();

            // Wait for the user's choice
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the installation prompt.');
                } else {
                    console.log('User dismissed the installation prompt.');
                }
                // Clear the deferredPrompt variable
                deferredPrompt = null;
            });
        }
    };
};

// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import { getDatabase, ref, set, get, child, remove, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getStorage, ref as stRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAjpnWMiVf0inGKOiyiXG_AqcmvfVzfq1E",
    authDomain: "drukgyel-hss-4a7f7.firebaseapp.com",
    databaseURL: "https://drukgyel-hss-4a7f7-default-rtdb.firebaseio.com/",
    projectId: "drukgyel-hss-4a7f7",
    storageBucket: "drukgyel-hss-4a7f7.appspot.com",
    messagingSenderId: "728432489451",
    appId: "1:728432489451:web:83f9979d39672748df9fae",
    measurementId: "G-RB5MMY67QV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const storage = getStorage(app);

// Firebase Functions
function getAllDatas(code) {
    get(ref(database)).then((snapshot) => {
        if (snapshot.exists()) {
            code(snapshot.val());
        } else {
            code([])
        };
    }).catch((error) => {
        console.error(error);
    });
};
function getData(path, code) {
    get(child(ref(database), path)).then((snapshot) => {
        if (snapshot.exists()) {
            code(snapshot.val());
        } else {
            code({});
        };
    }).catch((error) => {
        console.error(error);
    });
};
function writeData(path, data, code) {
    set(ref(database, path), data).then(() => {
        code();
    });
};
function deleteData(path, code) {
    remove(ref(database, path)).then(() => {
        code()
    })
}
function onDataUpdate(path, code) {
    onValue(ref(database, path), (snapshot) => {
        code(snapshot.val());
    });
}

// Handle Online and Offline Changes
window.onoffline = function() {
    let p = createPrompt();
    p[0].style.height = "auto";
    p[0].style.backgroundColor = "white";
    p[0].style.fontSize = "5vw";
    p[0].style.fontWeight = "bolder";
    p[0].innerHTML = "You went Offline!<br>Please reconnect to continue";
    p[1].hidden = true;
    window.ononline = function() {
        p[1].click();
    };
};

// Basic Functions
function createPrompt() {
    let div = document.createElement("div");
    div.style = "position: fixed; z-index: 2; width: 100%; height: 100%; left: 0%; top: 0%; background-color: rgba(0,0,0,0.5);";
    document.body.appendChild(div);
    let holder = document.createElement("div");
    holder.style = "padding: 5%; position: fixed; z-index: 2; width: 75%; height: 75%; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); border-radius: 5vw; background-color: #0989EC; box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24); text-align: center; overflow: auto; overflow-wrap:";
    div.appendChild(holder);
    let close = document.createElement("button");
    close.style.backgroundColor = "red";
    close.innerHTML = "&#10006;";
    close.style = "position: fixed; right: 5%; top: 5%; background-color: red; color: white; border: none; padding: 10px 15px; font-size: 3vw; cursor: pointer; z-index: 3; border-radius: 2vw";
    div.appendChild(close);
    close.onclick = function () {
        div.remove();
    };
    return([holder, close])
}
function titleText(holder, text) {
    let b = document.createElement("b");
    b.innerHTML = text;
    b.style = "text-align: center; display: block; font-size: 7vw";
    holder.appendChild(b);
    holder.appendChild(document.createElement("br"));
}
function textInput(holder, placeholder) {
    let inp = document.createElement("input");
    inp.placeholder = placeholder;
    inp.style = "width: 90%";
    holder.appendChild(inp);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    return(inp)
}
function dropdown(holder, placeholder, options) {
    let sel = document.createElement("select");
    sel.innerHTML = `<option value="" selected disabled hidden>${placeholder}</option>`;
    for (let o of options) {
        let elem = document.createElement("option");
        elem.innerHTML = o;
        elem.style = "color: black;"
        sel.appendChild(elem);
    }
    sel.style = "width: 90%; color: gray;";
    holder.appendChild(sel);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    sel.oninput = function() {
        sel.style.color = "black";
    }
    return(sel)
}
function textArea(holder, placeholder) {
    let tarea = document.createElement("textarea");
    tarea.placeholder = placeholder;
    tarea.style = "width: 90%; resize: none;";
    holder.appendChild(tarea);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let ch = tarea.clientHeight;
    tarea.oninput = function() {
        if (this.scrollHeight > ch) {
            this.style.height = ch;
            this.style.height = this.scrollHeight + 5;
        }
    }
    return(tarea)
}
function button(holder, text, code) {
    let btn = document.createElement("button");
    btn.innerHTML = text;
    holder.appendChild(btn);
    btn.onclick = function(event) {
        code(event)
    };
    return(btn)
}
function boldText(holder, text) {
    let b = document.createElement("b");
    b.style = "width: 90%; text-align: left; display: inline-block;";
    b.innerHTML = text;
    holder.appendChild(b);
    holder.appendChild(document.createElement("br"));
}
function dateInput(holder) {
    let date = document.createElement("input")
    date.type = "date"
    date.style = "width: 90%"
    holder.appendChild(date);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    return(date)
}
function redDot(parent, x, y) {
    let div = document.createElement("div")
    div.style = `background-color: red; position: absolute; left: ${x}; top: ${y}; border-radius: 100%; width: 3vw; height: 3vw;`;
    parent.appendChild(div)
    return(div)
}
function removeMenuRedDot() {
    if (staffProfileRedDot == undefined && announcementsRedDot == undefined && menuRedDot != undefined) {
        menuRedDot.remove();
        menuRedDot = undefined;
    }
}

// Setup startup screen
function startup() {
    let urlParams = new URLSearchParams(window.location.search);
    let initialValue = urlParams.get('page');
    let par = initialValue || undefined; // Use a default value if the parameter is not presents
    let availScreens = navList.map(item => item.label);
    if (par != undefined && availScreens.includes(par)) {
        document.getElementById(par + " Btn").click();
    } else {
        if (window.location.search.lastIndexOf('?') == -1) {
            document.getElementById("School Profile Btn").click();
        };
    };
    if (localStorage.userId == undefined) {
        let users = data.users;
        function createUID() {
            let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            let uid = "";
            for (let i = 0; i < 10; i++) {
                uid += chars[Math.floor(Math.random() * (35 - 0 + 1) + 0)]
            }
            if ((users == undefined) || (uid in users == false)) {
                localStorage.userId = uid;
                writeData(`startup/users/${uid}`, "", function() {
                    if (users == undefined) {
                        users = {}
                    }
                    users[uid] = ""
                })
            } else {
                createUID()
            }
        }
        createUID()
    } else {
        let users = data.users;
        let uid = localStorage.userId
        if ((uid in users) == false || users == undefined) {
            writeData(`startup/users/${uid}`, "", function() {
                if (users == undefined) {
                    users = {}
                }
                users[uid] = ""
            })
        }
    }
}

// Global Variables
var data = {};
var dataStorage = {
    announcements: {},
    casualLeaves: {},
    inCampusLeaves: {},
    studyReports: {}
}
var menuRedDot = undefined;

// Splash Screen
var splash = false;
var loading = "loading"
if ((navigator.onLine ? "Online" : "Offline") == "Offline") {
    loading = "Failed"
}
document.getElementById("splashLogo").onanimationend = function () {
    setTimeout(function () {
        splash = true;
        if (Object.keys(data).length != 0) {
            document.getElementById("splashDiv").remove();
            loading = "Loaded";
            startup()
        } else {
            if (loading == "loading") {
                document.getElementById("splashLoad").innerHTML = "Loading Data<br>Please Wait";
            } else {
                document.getElementById("splashLoad").innerHTML = "No Internet Connection";
            }
            setTimeout(function() {
                if (loading == "loading") {
                    document.getElementById("splashLoad").innerHTML = "Unstable Network<br>Please Try Again Later";
                }
            }, 5000);
        };
    }, 500);
};
getData("startup", function (res) {
    data = res;

    // Splash
    if (splash == true) {
        document.getElementById("splashDiv").remove();
        loading = "Loaded";
    };

    // School Profile
    let schoolProfile = data.schoolProfile;
    let txt = `Principal: ${schoolProfile["Principal"]}<br>`;
    for (let x of schoolProfile["Vice Principal"].values()) {
        txt += `Vice Principal: ${x}<br>`;
    };
    txt += `Total Students: ${parseInt(schoolProfile["Boys"]) + parseInt(schoolProfile["Girls"])} [Boarders: ${schoolProfile["Boarders"]} & Day Scholars: ${schoolProfile["Day Scholars"]}] [Boys: ${schoolProfile["Boys"]} & Girls: ${schoolProfile["Girls"]}]<br>`;
    txt += `Total Staff: ${parseInt(schoolProfile["Teachers"]) + parseInt(schoolProfile["Supporting Staffs"])} [Teachers: ${schoolProfile["Teachers"]} & Supporting Staffs: ${schoolProfile["Supporting Staffs"]}]`;
    document.getElementById("schoolProfileA").innerHTML = txt;
    
    // About
    document.getElementById("aboutDiv").innerHTML = data.aboutSchool.replaceAll("\n", "<br>");

    // Attendance
    var classes = data.attendance;
    let sortedKeys = Object.keys(classes)
    .map(key => ({ key, length: key.length }))
    .sort((a, b) => a.length - b.length)
    .map(obj => obj.key);
    classes = sortedKeys.reduce((acc, key) => {
        acc[key] = classes[key];
        return acc;
    }, {});

    document.getElementById("classListHolder").innerHTML = "";
    for (let a of Object.keys(classes)) {
        let btn = document.createElement("button");
        btn.style = "margin: 2%; width: 45%; border-radius: 15px; background-color: black; color: white; font-weight: bolder; font-size: 7.5vw;";
        btn.innerHTML = a;
        document.getElementById("classListHolder").appendChild(btn);
        btn.onclick = function() {
            window.open(classes[a], "_blank")
        };
    };

    // Staff Profile
    if (data.users == undefined) {
        data.users = {};
    }
    if (Object.keys(data.users).includes(localStorage.userId)) {
        if (data.users[localStorage.userId] == "") {
            staffProfileRedDot = redDot(document.getElementById("Staff Profile Btn"), `0%`, `0%`)
            menuRedDot = redDot(document.getElementById("navBtn"), `0%`, `0%`);
            staffProfileAddRedDot = redDot(document.getElementById("staffProfileBtn"), `15%`, `15%`);
        }
    }

    // Contacts
    let contacts = data.contacts;
    if (contacts == undefined) {
        contacts = {};
    }
    for (let x of contacts) {
        let div = document.createElement("div");
        div.style = "font-size: 4vw;"
        div.innerHTML = `<b>${x.title}</b><br><a>${x.name}</a>
        <button style='float: right;' onclick='window.location.href = "tel: ${x.contact}";'>Contact</button>`;
        document.getElementById("contactsDiv").appendChild(div);
        document.getElementById("contactsDiv").appendChild(document.createElement("hr"));
    };

    startup()
});

// Announcements Load at startup
if (localStorage.readAnnouncements == undefined) {
    localStorage.readAnnouncements = `{"${getTodayDate()}": []}`
} else {
    if (Object.keys(JSON.parse(localStorage.readAnnouncements))[0] != getTodayDate()) {
        localStorage.readAnnouncements = `{"${getTodayDate()}": []}`
    }
}

// Setup the navigation drawer;
var navList = [
    { label: "School Profile", logo: "./assets/home.svg" },
    { label: "About School", logo: "./assets/home.svg" },
    { label: "Class Attendance", logo: "./assets/attendance.svg" },
    { label: "Announcements", logo: "./assets/announcement.svg" },
    { label: "Casual Leave", logo: "./assets/sandglass.svg" },
    { label: "In Campus Leave", logo: "./assets/sandglass.svg" },
    { label: "Study Report", logo: "./assets/report.svg" },
    { label: "Staff Profile", logo: "./assets/book.svg" },
    { label: "Contacts", logo: "./assets/contacts.svg" },
    { label: "About", logo: "./assets/about.svg" }
];
for (let d = 0; d < navList.length; d++) {
    let a = document.createElement("a");
    a.style = "text-decoration: none; display: flex; align-items: center; position: relative;";
    a.value = navList[d].label;
    a.id = navList[d]["label"] + " Btn";
    let img = document.createElement("img");
    img.style = "height: 5vw";
    img.src = navList[d].logo;
    a.appendChild(img);
    a.innerHTML += "&nbsp;&nbsp;&nbsp;";
    let b = document.createElement("b");
    b.style = "color: black; font-size: 5vw;";
    b.innerHTML = navList[d].label;
    a.appendChild(b);
    document.getElementById("navSubHolder").appendChild(a);
    document.getElementById("navSubHolder").appendChild(document.createElement("br"));
    a.onclick = function () {
        let val = a.value.replace(" Btn", "")
        if (setScreen(val) == true) {
            // Load Datas and display in screen
            if (val == "Announcements") {
                loadAnnouncements()
            } else if (val == "Casual Leave") {
                loadCasualLeaves()
            } else if (val == "In Campus Leave") {
                loadInCampusLeaves()
            } else if (val == "Study Report") {
                loadStudyReports()
            } else if (val == "Staff Profile") {
                loadStaffProfiles()
            };
            document.getElementById("header").innerHTML = val;
            if (document.getElementById("navBarrier").hidden == false) {
                navClose();
            };
            window.history.pushState({}, null, window.location.search.substring(0, window.location.search.lastIndexOf('?')) + "?page=" + a.value);
        }
    };
};

// Input today's date to the filter.
for (let f of document.querySelectorAll(".filterDate")) {
    f.value = getTodayDate();
    f.onchange = function() {
        if (this.value != "") {
            document.getElementById(this.parentElement.parentElement.id + " Btn").click()
        } else {
            this.value = getTodayDate();
            document.getElementById(this.parentElement.parentElement.id + " Btn").click()
        }
    }
}

// For Space beside the plus button and function for loads
var height = 0;
height += window.screen.width * 0.15;
height += window.screen.height * 0.05;
for (let o of document.querySelectorAll(".at")) {
    o.style.height = height;
}
var at = document.createElement("div")
at.style.height = height;

function getTime(x) {
    let time = new Date(parseInt(x));
    let hours = String(time.getHours()).padStart(2, '0');
    let minutes = String(time.getMinutes()).padStart(2, '0');
    let ampm = "am"
    if (parseInt(hours) > 12) {
        hours = parseInt(hours) - 12;
        ampm = "pm"
    }
    return(`${hours}:${minutes} ${ampm}`)
}

function listLoad(data, divElem, code, oncl) {
    document.getElementById(divElem).innerHTML = "";
    document.getElementById(divElem).appendChild(at)
    if (Object.keys(data).length == 0) {
        let b = document.createElement("b")
        b.innerHTML = "No Data"
        document.getElementById(divElem).insertBefore(b, document.getElementById(divElem).firstChild);
    }
    if (Object.keys(data[Object.keys(data)[0]]).length != 0) {
        for (let y of Object.keys(data)) {
            document.getElementById(divElem).insertBefore(document.createElement("br"), document.getElementById(divElem).firstChild);
            for (let x of Object.keys(data[y])) {
                let div = document.createElement("div");
                div.style = "position: relative; width: 80%; background-color: white; border: 2px solid #ddd; border-radius: 3vw; padding: 5%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";
                document.getElementById(divElem).insertBefore(div, document.getElementById(divElem).firstChild);
                code(div, x, y)
                div.onclick = function(event) {
                    let elem = createPrompt()
                    elem[0].style.backgroundColor = "white";
                    elem[0].style.textAlign = "left";
                    oncl(elem[0], x, y, elem[1], event)
                };
            }
            let date = document.createElement("b");
            let time = new Date();
            if (y == `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`) {
                date.innerHTML = "Today"
            } else if (y == previousDate(`${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`)) {
                date.innerHTML = "Yesterday";
            } else {
                date.innerHTML = timeToWords(y);
            }
            date.style = "font-size: 7vw;"
            document.getElementById(divElem).insertBefore(document.createElement("br"), document.getElementById(divElem).firstChild);
            document.getElementById(divElem).insertBefore(date, document.getElementById(divElem).firstChild);
        };
    } else {
        let b = document.createElement("b")
        b.innerHTML = "No Data"
        document.getElementById(divElem).insertBefore(b, document.getElementById(divElem).firstChild);
    }
};

// Announcements
var announcementsRedDot = undefined;
var announcementsRedDotList = {};
function loadAnnouncements() {
    let dateToday = document.getElementById("announcementFilter").value;
    function startIt(dT) {
        let toLoad = {}
        toLoad[dT] = dataStorage.announcements[dT];
        listLoad(toLoad, "announcementDiv", function(div, x, y) {
            div.innerHTML = `<b style="font-size: 5vw; display: block;">${dataStorage.announcements[y][x].name}</b>
            <b style="font-size: 4vw;">To: ${dataStorage.announcements[y][x].to}</b>
            <a style="float: right; font-size: 4vw; color: #555;">${getTime(x)}</a>
            <hr style="width: 100%;">
            <b style="display: block; font-size: 5vw; margin-top: 10px;">${dataStorage.announcements[y][x].heading}</b><br>
            <a style="font-size: 4vw; color: blue;">Click to open full announcement</a>`;
            if (JSON.parse(localStorage.readAnnouncements)[getTodayDate()].includes(x) == false) {
                if (dataStorage.announcements[y][x].uid != localStorage.userId) {
                    let annRed = redDot(div, "90%", "10%")
                    announcementsRedDotList[x] = annRed;
                    if (menuRedDot == undefined) {
                        menuRedDot = redDot(document.getElementById("navBtn"), `0%`, `0%`);
                    }
                    if (announcementsRedDot == undefined) {
                        announcementsRedDot = redDot(document.getElementById("Announcements Btn"), `0%`, `0%`)
                    }
                }
            }
            if (dataStorage.announcements[y][x].uid == localStorage.userId && parseInt(getTimeDifference(Date.now(), parseInt(x)).split("-")[0]) < 1) {
                let delBtn = document.createElement("button");
                delBtn.id = x;
                delBtn.innerHTML = "Delete Announcement";
                div.appendChild(document.createElement("br"))
                div.appendChild(document.createElement("br"))
                div.appendChild(delBtn)
                delBtn.onclick = function() {
                    let conf = confirm("Are you sure you want to delete this announcement?")
                    if (conf == true) {
                        delBtn.disabled = true;
                        delBtn.innerHTML = "Deleting"
                        deleteData(`announcements/${y}/${x}`, function() {})
                    };
                }
            }
        }, function(e, x, y, f, event) {
            if (event.target.id != x) {
                e.innerHTML = `From ${dataStorage.announcements[y][x].name} at ${getTime(x)}<br><br>To ${dataStorage.announcements[y][x].to}<br><br>Heading:  ${dataStorage.announcements[y][x].heading}<br><br>${dataStorage.announcements[y][x].message.replaceAll("\n", "<br>")}`
                let tempJson = JSON.parse(localStorage.readAnnouncements)
                tempJson[getTodayDate()].push(x)
                localStorage.readAnnouncements = JSON.stringify(tempJson)
                if (announcementsRedDotList[x] != undefined) {
                    announcementsRedDotList[x].remove();
                    delete announcementsRedDotList[x];
                    if (Object.keys(announcementsRedDotList).length == 0) {
                        announcementsRedDot.remove();
                        announcementsRedDot = undefined;
                        removeMenuRedDot();
                    }
                }
            } else {
                f.click();
            }
        });
    }
    if (Object.keys(dataStorage.announcements).includes(dateToday)) {
        startIt(dateToday);
    } else {
        document.getElementById("announcementDiv").innerHTML = "Getting Data. Please wait."
        getData(`announcements/${dateToday}`, function(res) {
            if (Object.keys(res).length != 0) {
                dataStorage.announcements[dateToday] = res;
                startIt(dateToday);
            } else {
                dataStorage.announcements[dateToday] = {};
                document.getElementById("announcementDiv").innerHTML = "<b>No Data</b>";
            }
        })
    }
}
document.getElementById("announcementBtn").onclick = function () {
    let annElem = createPrompt();
    let holder = annElem[0];
    let closeBtn = annElem[1];
    titleText(holder, "Announcement")
    let annName = textInput(holder, "Name")
    let annTo = dropdown(holder, "Announcement for", ["Captains", "Everyone", "Students", "Teachers", "Others"])
    annTo.onchange = function() {
        if (annTo.value == "Others") {
            let to = "";
            while (to.trim() == "") {
                to = prompt("This announcement is for: ")
                if (to == null) {
                    annTo.firstChild.selected = true;
                    break;
                } else if (to.trim() != "") {
                    let elem = document.createElement("option");
                    elem.innerHTML = to;
                    elem.style = "color: black;"
                    elem.selected = true;
                    annTo.insertBefore(elem, annTo.lastChild);
                }
            }
        }
    }
    let annHeading = textInput(holder, "Heading")
    let annMessage = textArea(holder, "Announcement")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            name: annName.value.trim(),
            to: annTo.value.trim(),
            heading: annHeading.value.trim(),
            message: annMessage.value.trim()
        };
        if (data.name != "" && data.to != "" && data.heading != "" && data.message != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`announcements/${date}/${ts}`, data, function() {
                // let tempJson = JSON.parse(localStorage.readAnnouncements)
                // tempJson[getTodayDate()].push(""+ts)
                // localStorage.readAnnouncements = JSON.stringify(tempJson)
                closeBtn.click();
                if (dataStorage.announcements[date] == undefined) {
                    dataStorage.announcements[date] = {};
                }
                dataStorage.announcements[date][ts] = data;
            });
        } else {
            alert("Please fill up all the information");
        };
    })
};

// Casual Leave
function loadCasualLeaves() {
    let dateToday = document.getElementById("casualLeaveFilter").value;
    function startIt(dT) {
        let toLoad = {}
        toLoad[dT] = dataStorage.casualLeaves[dT];
        listLoad(toLoad, "casualLeaveDiv", function(div, x, y) {
            div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${getTime(x)}</a>
            <b style="font-size: 5vw; display: block;">${dataStorage.casualLeaves[y][x].name}</b>
            <b style="font-size: 4vw;">Reason: ${dataStorage.casualLeaves[y][x].reason}</b>
            <b style="display: block; font-size: 4vw; margin-top: 10px; color: #3A3B3C;">${dataStorage.casualLeaves[y][x].type}</b><br>
            <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
            if (dataStorage.casualLeaves[y][x].uid == localStorage.userId && parseInt(getTimeDifference(Date.now(), parseInt(x)).split("-")[0]) < 1) {
                let delBtn = document.createElement("button");
                delBtn.id = x;
                delBtn.innerHTML = "Cancel Leave";
                div.appendChild(document.createElement("br"))
                div.appendChild(document.createElement("br"))
                div.appendChild(delBtn)
                delBtn.onclick = function() {
                    let conf = confirm("Are you sure you want to cancel your leave?")
                    if (conf == true) {
                        delBtn.disabled = true;
                        delBtn.innerHTML = "Canceling"
                        deleteData(`casualLeaves/${y}/${x}`, function() {})
                    };
                }
            }
        }, function(e, x, y, f, event) {
            if (event.target.id != x) {
                e.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                Name: ${dataStorage.casualLeaves[y][x].name}<hr>
                Type of Leave: ${dataStorage.casualLeaves[y][x].type}<hr>
                Duration: ${dataStorage.casualLeaves[y][x].duration}<hr>
                Start Date:  ${dataStorage.casualLeaves[y][x].startDate}<hr>
                End Date: ${dataStorage.casualLeaves[y][x].endDate}<hr>
                Reason: ${dataStorage.casualLeaves[y][x].reason}`
            } else {
                f.click()
            }
        });
    };
    if (Object.keys(dataStorage.casualLeaves).includes(dateToday)) {
        startIt(dateToday);
    } else {
        document.getElementById("casualLeaveDiv").innerHTML = "Getting Data. Please wait."
        getData(`casualLeaves/${dateToday}`, function(res) {
            if (Object.keys(res).length != 0) {
                dataStorage.casualLeaves[dateToday] = res;
                startIt(dateToday);
            } else {
                dataStorage.casualLeaves[dateToday] = {};
                document.getElementById("casualLeaveDiv").innerHTML = "<b>No Data</b>";
            };
        })
    }
}
document.getElementById("casualLeaveBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "Casual Leave");
    let clName = textInput(holder, "Name");
    let clType = dropdown(holder, "Leave Type", ["Casual Leave", "Medical Leave", "Maternity Leave", "Paternity Leave", "Earned Leave", "Extra Ordinary Leave", "Medical Escort Leave", "Bereavement Leave"]);
    let clDuration = dropdown(holder, "Duration", ["Half Day", "One Day", "Two Days", "Three Days", "Four Days", "Five Days", "Six Days", "Seven Days", "Eight Days", "Nine Days", "Ten Days"]);
    boldText(holder, "Start Date")
    let clStart = dateInput(holder)
    boldText(holder, "End Date")
    let clEnd = dateInput(holder)
    let clReason = textInput(holder, "Reason")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            name: clName.value.trim(),
            type: clType.value,
            duration: clDuration.value,
            startDate: clStart.value,
            endDate: clEnd.value,
            reason: clReason.value.trim()
        };
        if (data.name != "" && data.type != "" && data.duration != "" && data.startDate != "" && data.endDate != "" && data.reason != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`casualLeaves/${date}/${ts}`, data, function() {
                closeBtn.click();
                dataStorage.casualLeaves[date] = {}
                dataStorage.casualLeaves[date][ts] = data;
            });
        } else {
            alert("Please fill up all the information");
        };
    })
};

// In Campus Leave
function loadInCampusLeaves() {
    let dateToday = document.getElementById("campusLeaveFilter").value;
    function startIt(dT) {
        let toLoad = {}
        toLoad[dT] = dataStorage.inCampusLeaves[dT];
        listLoad(toLoad, "campusLeaveDiv", function(div, x, y) {
            div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${dataStorage.inCampusLeaves[y][x].date} ${dataStorage.inCampusLeaves[y][x].time}</a>
            <b style="font-size: 5vw; display: block;">${dataStorage.inCampusLeaves[y][x].name}</b>
            <b style="font-size: 4vw;">Purpose: ${dataStorage.inCampusLeaves[y][x].purpose}</b>
            <b style="display: block; font-size: 4vw; margin-top: 10px; color: #3A3B3C;">${dataStorage.inCampusLeaves[y][x].period}</b><br>
            <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
            if (dataStorage.inCampusLeaves[y][x].uid == localStorage.userId && parseInt(getTimeDifference(Date.now(), parseInt(x)).split("-")[0]) < 1) {
                let delBtn = document.createElement("button");
                delBtn.id = x;
                delBtn.innerHTML = "Cancel Leave";
                div.appendChild(document.createElement("br"))
                div.appendChild(document.createElement("br"))
                div.appendChild(delBtn)
                delBtn.onclick = function() {
                    let conf = confirm("Are you sure you want to cancel your leave?")
                    if (conf == true) {
                        delBtn.disabled = true;
                        delBtn.innerHTML = "Canceling"
                        deleteData(`inCampusLeaves/${y}/${x}`, function() {})
                        .catch((error) => {
                            console.error("Error deleting data: ", error);
                        });
                    };
                }
            }
        }, function(e, x, y, f, event) {
            if (event.target.id != x) {
                e.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                Name: ${dataStorage.inCampusLeaves[y][x].name}<hr>
                Date and Time: ${dataStorage.inCampusLeaves[y][x].date} ${dataStorage.inCampusLeaves[y][x].time}<hr>
                Purpose: ${dataStorage.inCampusLeaves[y][x].purpose}<hr>
                Period [From - To]:  ${dataStorage.inCampusLeaves[y][x].period}`
            
            } else {
                f.click()
            }
        });
    }
    if (Object.keys(dataStorage.inCampusLeaves).includes(dateToday)) {
        startIt(dateToday);
    } else {
        document.getElementById("campusLeaveDiv").innerHTML = "Getting Data. Please wait."
        getData(`inCampusLeaves/${dateToday}`, function(res) {
            if (Object.keys(res).length != 0) {
                dataStorage.inCampusLeaves[dateToday] = res;
                startIt(dateToday);
            } else {
                dataStorage.inCampusLeaves[dateToday] = {};
                document.getElementById("campusLeaveDiv").innerHTML = "<b>No Data</b>";
            };
        })
    }
}
document.getElementById("campusLeaveBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "In Campus Leave")
    let clName = textInput(holder, "Name")
    boldText(holder, "Date and Time")
    let clDate = document.createElement("input")
    clDate.type = "date"
    clDate.style = "width: 45%"
    holder.appendChild(clDate);
    let clTime = document.createElement("input")
    clTime.type = "time"
    clTime.style = "width: 45%"
    holder.appendChild(clTime);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let clPurpose = textInput(holder, "Purpose")
    let clPeriod = textInput(holder, "Period [From - To]")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            name: clName.value.trim(),
            date: clDate.value,
            time: clTime.value,
            purpose: clPurpose.value.trim(),
            period: clPeriod.value.trim()
        };
        if (data.name != "" && data.date != "" && data.time != "" && data.purpose != "" && data.period != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`inCampusLeaves/${date}/${ts}`, data, function() {
                closeBtn.click();
                dataStorage.inCampusLeaves[date] = {}
                dataStorage.inCampusLeaves[date][ts] = data;
            });
        } else {
            alert("Please fill up all the information");
        };
    });
};

// Study Report
function loadStudyReports() {
    let dateToday = document.getElementById("studyReportFilter").value;
    function startIt(dT) {
        let toLoad = {}
        toLoad[dT] = dataStorage.studyReports[dT];
        listLoad(toLoad, "studyReportDiv", function(div, x, y) {
            div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${getTime(x)}</a>
            <b style="font-size: 5vw; display: block;">${dataStorage.studyReports[y][x].teacher}</b>
            <b style="font-size: 4vw; color: #3A3B3C;">${dataStorage.studyReports[y][x].study}</b>
            <b style="display: block; font-size: 4vw; margin-top: 10px;">${dataStorage.studyReports[y][x].absentee.replaceAll("\n", "<br>")}</b><br>
            <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
            if (dataStorage.studyReports[y][x].uid == localStorage.userId && parseInt(getTimeDifference(Date.now(), parseInt(x)).split("-")[0]) < 1) {
                let delBtn = document.createElement("button");
                delBtn.id = x;
                delBtn.innerHTML = "Delete Report";
                div.appendChild(document.createElement("br"))
                div.appendChild(document.createElement("br"))
                div.appendChild(delBtn)
                delBtn.onclick = function() {
                    let conf = confirm("Are you sure you want to delete this report?")
                    if (conf == true) {
                        delBtn.disabled = true;
                        delBtn.innerHTML = "Deleting"
                        deleteData(`studyReports/${y}/${x}`, function() {})
                    };
                }
            }
        }, function(e, x, y, f, event) {
            if (event.target.id != x) {
                e.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                ToD: ${dataStorage.studyReports[y][x].teacher}<hr>
                Study: ${dataStorage.studyReports[y][x].study}<hr>
                Date: ${dataStorage.studyReports[y][x].date}<hr>
                Absentee:<br>${dataStorage.studyReports[y][x].absentee.replaceAll("\n", "<br>")}`
            } else {
                f.click()
            }
        });
    };
    if (Object.keys(dataStorage.studyReports).includes(dateToday)) {
        startIt(dateToday);
    } else {
        document.getElementById("studyReportDiv").innerHTML = "Getting Data. Please wait."
        getData(`studyReports/${dateToday}`, function(res) {
            if (Object.keys(res).length != 0) {
                dataStorage.studyReports[dateToday] = res;
                startIt(dateToday);
            } else {
                dataStorage.studyReports[dateToday] = {};
                document.getElementById("studyReportDiv").innerHTML = "<b>No Data</b>";
            }
        })
    }
}
document.getElementById("studyReportBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "Study Report");
    let srTeacher = textInput(holder, "Teacher (ToD)");
    boldText(holder, "Date");
    let srDate = dateInput(holder);
    let srStudy = dropdown(holder, "Study", ["Morning Study", "Evening Study", "Night Study"]);
    let srAbsentees = textArea(holder, "Absentees [Name,Class,Sec,Bdr/DS,Reason]")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            teacher: srTeacher.value.trim(),
            date: srDate.value,
            study: srStudy.value,
            absentee: srAbsentees.value.trim()
        };
        if (data.teacher != "" && data.date != "" && data.study != "" && data.absentee != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`studyReports/${date}/${ts}`, data, function() {
                closeBtn.click();
                dataStorage.studyReports[date] = {}
                dataStorage.studyReports[date][ts] = data;
            });
        } else {
            alert("Please fill up all the information");
        };
    });
};

// Staff Profile
var staffProfileRedDot = undefined;
var staffProfileAddRedDot = [];
function loadStaffProfiles() {
    document.getElementById("staffProfileDiv").innerHTML = "";
    document.getElementById("staffProfileDiv").appendChild(at)
    let users = data.users;
    if (users == undefined) {
        users = {}
        data.users = {};
    }
    for (let o of Object.keys(users)) {
        if (users[o] == "") {
            delete users[o];
        }
    }
    sortObject(users, "name", true)
    if (Object.keys(users).length == 0) {
        let b = document.createElement("b")
        b.innerHTML = "No Data";
        document.getElementById("staffProfileDiv").insertBefore(b, document.getElementById("staffProfileDiv").firstChild);
    } else {
        for (let s of Object.keys(users)) {
            if (users[s] != "") {
                let div = document.createElement("div");
                div.style = "width: 80%; background-color: white; border: 2px solid #ddd; border-radius: 3vw; padding: 5%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";
                document.getElementById("staffProfileDiv").insertBefore(div, document.getElementById("staffProfileDiv").firstChild);
                div.innerHTML = `<b style="font-size: 5vw; display: block;">${users[s].name}</b>
                <b style="font-size: 4vw;">Class Teacher of ${users[s].classTeacher}</b>
                <b style="display: block; font-size: 4vw; color: #3A3B3C;">${users[s].subject}</b><br>
                <a style="font-size: 4vw; color: blue;">Click to open more details</a>`;
                div.onclick = function(ev) {
                    let elem = createPrompt()
                    elem[0].style.backgroundColor = "white";
                    elem[0].style.textAlign = "left";
                    let con = `<div onclick="window.open('${users[s].profilePicture}', '_blank');" style="position: relative; left: 50%; transform: translateX(-50%); width: 30%; aspect-ratio: 1/1; border-radius: 100%; overflow: hidden; background-image: url('${users[s].profilePicture}'); background-position: center; background-repeat: no-repeat; background-size: cover;"></div><br>
                    <b style="width: 100%; text-align: center; left: 0%; position: relative; display: inline-block;">${users[s].name}</b><br><br>
                    Class Teacher of&nbsp;${users[s].classTeacher}<hr>
                    Subject: ${users[s].subject}<hr>
                    Currently Teaching Classes: ${users[s].classes}<hr>
                    Phone Number: <a href='tel: ${users[s].phoneNumber}'>${users[s].phoneNumber}</a><hr>
                    Email: <a href='mailto:${users[s].email}'>${users[s].email}</a>`
                    elem[0].innerHTML = con;
                    if (ev.target.id == s) {
                        elem[1].click();
                    }
                };
                if (s == localStorage.userId) {
                    let delBtn = document.createElement("button");
                    delBtn.id = s;
                    delBtn.innerHTML = "Delete Profile";
                    div.appendChild(document.createElement("br"))
                    div.appendChild(document.createElement("br"))
                    div.appendChild(delBtn)
                    delBtn.onclick = function() {
                        let conf = confirm("Are you sure you want to delete your profile?")
                        if (conf == true) {
                            delBtn.disabled = true;
                            delBtn.innerHTML = "Deleting"
                            deleteObject(stRef(storage, `staffProfile/${localStorage.userId}/Profile Picture`)).then(() => {
                                writeData(`startup/users/${localStorage.userId}`, "", function() {
                                    data.users[localStorage.userId] = "";
                                    loadStaffProfiles()
                                })
                            });
                        };
                    }
                }
            }
        }
    }
}
document.getElementById("staffProfileBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "Your Profile")
    let spName = textInput(holder, "Name");
    boldText(holder, "Profile Picture")
    let spFile = undefined;
    let spPreview = document.createElement("div");
    spPreview.style = "position: relative; left: 50%; transform: translateX(-50%); height: 20vw; aspect-ratio: 1/1; overflow: hidden; border-radius: 100%; background-image: url(''); background-position: center; background-repeat: no-repeat; background-size: cover;";
    spPreview.hidden = true;
    holder.appendChild(spPreview);
    let spInp = document.createElement("input");
    spInp.type = "file";
    spInp.accept = "image/*"
    spInp.style = "display: none;";
    let spInpBtn = document.createElement("button");
    spInpBtn.innerHTML = "Choose an Image";
    spInpBtn.style = "width: 90%;"
    spInpBtn.appendChild(spInp);
    holder.appendChild(spInpBtn);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    spInpBtn.onclick = function() {
        spInp.click();
    }
    spInp.oninput = function() {
        if (spInp.files[0] != undefined) {
            spInpBtn.disabled = true;
            spInpBtn.innerHTML = `Compressing Image<br>Please wait`;
            let spDiv = document.createElement("div");
            spDiv.style = "position: fixed; left: -500px; width: 480px; height: 480px; overflow: hidden; background-image: url(''); background-position: center; background-repeat: no-repeat; background-size: cover;"
            document.body.appendChild(spDiv);
            spDiv.style.backgroundImage = `url('${URL.createObjectURL(spInp.files[0])}')`
            html2canvas(spDiv, {
                scale: 1,
            }).then(canvas => {
                spPreview.hidden = false;
                const imgData = canvas.toDataURL('image/png');
                let convFile = dataURLtoFile(imgData, spInp.files[0].name)
                spFile = convFile;
                spPreview.style.backgroundImage = `url('${URL.createObjectURL(convFile)}')`;
                spInpBtn.disabled = false;
                spInpBtn.innerHTML = `${spInp.files[0].name} - ${(convFile.size/1024).toFixed(2)} KB<br>Click to change`;
            });
        }
    }
    let spSubject = textInput(holder, "Subject");
    let spClassTeacher = textInput(holder, "Class Teacher");
    let spClasses = textInput(holder, "Currently Teaching Classes");
    let spPhone = textInput(holder, "Phone Number");
    spPhone.type = "number";
    let spEmail = textInput(holder, "Email");
    spEmail.type = "email";
    let uploadBtn = button(holder, "Upload", function() {
        let tempData = {
            name: spName.value.trim(),
            subject: spSubject.value.trim(),
            classTeacher: spClassTeacher.value.trim(),
            classes: spClasses.value.trim(),
            phoneNumber: spPhone.value.trim(),
            email: spEmail.value.trim()
        };
        if (tempData.name != "" && tempData.subject != "" && tempData.classTeacher != "" && tempData.classes != "" && tempData.phoneNumber != "" && tempData.email != "") {
            if (spFile != undefined) {
                uploadBtn.disabled = true;
                uploadBtn.innerHTML = "Uploading Profile Picture"
                let storageRef = stRef(storage, `staffProfile/${localStorage.userId}/Profile Picture`)
                let task = uploadBytesResumable(storageRef, spFile);
                task.on('state_changed', (snapshot) => {
                    let progress = `${(snapshot.bytesTransferred / 1024).toFixed(2)} KB / ${(snapshot.totalBytes / 1024).toFixed(2)} KB`;
                    uploadBtn.innerHTML = ("Uploading Profile Picture<br>"+progress)
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                }, () => {
                    uploadBtn.innerHTML = ("Profile Picture Uploaded<br>Uploading Data")
                    getDownloadURL(storageRef).then((Url) => {
                        tempData.profilePicture = Url;
                        let ts = Date.now();
                        writeData(`startup/users/${localStorage.userId}`, tempData, function() {
                            closeBtn.click();
                            data.users[localStorage.userId] = tempData;
                            loadStaffProfiles()
                            staffProfileAddRedDot.remove()
                            staffProfileAddRedDot = undefined;
                            staffProfileRedDot.remove();
                            staffProfileRedDot = undefined;
                            removeMenuRedDot()
                        });
                    })
                });
            } else {
                alert("Please upload a profile picture");
            };
        } else {
            alert("Please fill up all the information");
        };
    });
};

// Handle Database Updates
onDataUpdate(`announcements/${getTodayDate()}`, function(res) {
    if (res != undefined && res != null) {
        dataStorage.announcements[getTodayDate()] = res;
    } else {
        dataStorage.announcements = {}
        localStorage.readAnnouncements = `{"${getTodayDate()}": []}`
        for (let g of Object.keys(announcementsRedDotList)) {
            announcementsRedDotList[g].remove()
            delete announcementsRedDotList[g]
        }
        if (announcementsRedDot != undefined) {
            announcementsRedDot.remove();
            announcementsRedDot = undefined;
        }
        removeMenuRedDot();
    }
    if (getScreen() != null && getScreen().id == "Announcements") {
        loadAnnouncements()
    } else {
        if (res != undefined && res != null) {
            if (menuRedDot == undefined) {
                menuRedDot = redDot(document.getElementById("navBtn"), `0%`, `0%`);
            }
            if (announcementsRedDot == undefined) {
                announcementsRedDot = redDot(document.getElementById("Announcements Btn"), `0%`, `0%`)
            }
        }
    }
})
onDataUpdate(`casualLeaves/${getTodayDate()}`, function(res) {
    if (res != undefined && res != null) {
        dataStorage.casualLeaves[getTodayDate()] = res;
    } else {
        dataStorage.casualLeaves = {}
    }
    if (getScreen() != null && getScreen().id == "Casual Leave") {
        loadCasualLeaves()
    }
})
onDataUpdate(`inCampusLeaves/${getTodayDate()}`, function(res) {
    if (res != undefined && res != null) {
        dataStorage.inCampusLeaves[getTodayDate()] = res;
    } else {
        dataStorage.inCampusLeaves = {}
    }
    if (getScreen() != null && getScreen().id == "In Campus Leave") {
        loadInCampusLeaves()
    }
})
onDataUpdate(`studyReports/${getTodayDate()}`, function(res) {
    if (res != undefined && res != null) {
        dataStorage.studyReports[getTodayDate()] = res;
    } else {
        dataStorage.studyReports = {}
    }
    if (getScreen() != null && getScreen().id == "Study Report") {
        loadStudyReports()
    }
})