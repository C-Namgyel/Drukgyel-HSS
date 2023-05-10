//Start
if ("Drukgyel-HSS" in sessionStorage == false) {
    sessionStorage["Drukgyel-HSS"] = location.href
    location.href = ("../index.html")
}
//Setup
var navList = [
    {label: "School Profile", logo: "../assets/home.svg"},
    {label: "About School", logo: "../assets/home.svg"},
    {label: "Class Attendance", logo: "../assets/record.svg"},
    {label: "Staff Photo", logo: "../assets/book.svg"},
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