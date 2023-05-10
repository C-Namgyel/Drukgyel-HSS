/*if ("username" in localStorage == true) {
    try {
        let user = JSON.parse(localStorage.username)
        if (user.type == "DHSS-Attendance") {
            //
        } else {
            document.location.href = "../login/login.html";
        }
    }
    catch {
        document.location.href = "../login/login.html";
    }
} else {
    document.location.href = "../login/login.html";
}
console.log(localStorage["Drukgyel-HSS-User"])
var userInfo = JSON.parse(localStorage["Drukgyel-HSS-User"])
console.log(userInfo)
document.getElementById("profilePic").style.backgroundImage = "url('"+userInfo.pic+"')"
document.getElementById("profileName").innerHTML = userInfo.username
document.getElementById("profileEmail").innerHTML = userInfo.email*/
var navList = [
    {label: "School Profile", logo: "../assets/home.svg"},
    {label: "About School", logo: "../assets/home.svg"},
    {label: "Class Attendance", logo: "../assets/record.svg"},
    {label: "School Profile", logo: "../assets/book.svg"},
    {label: "About", logo: "../assets/about.svg"},
]
for (let d = 0; d < navList.length; d++) {
    let a = document.createElement("a")
    a.target = "_self"
    a.style="text-decoration: none; display: flex; align-items: center;"
    if (location.href.split("/")[location.href.split("/").length - 2] != navList[d].label.replaceAll(" ", "+") && location.href.split("/")[location.href.split("/").length - 2] != navList[d].label.replaceAll(" ", "%20")) {
        a.href = "../"+navList[d].label+"/index.html"
    } else {
        a.href = "#"
        a.onclick = function() {
            navClose()
        }
    }
    let img = document.createElement("img")
    img.style = "height: 25px"
    img.src = navList[d].logo
    a.appendChild(img)
    a.innerHTML += "&nbsp;&nbsp;&nbsp;"
    let b = document.createElement("b")
    b.style = "color: black; font-size: 20px;"
    b.innerHTML = navList[d].label
    a.appendChild(b)
    document.getElementById("navSubHolder").appendChild(a)
    document.getElementById("navSubHolder").appendChild(document.createElement("br"))
}