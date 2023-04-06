if ("username" in localStorage == true) {
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
var userInfo = JSON.parse(localStorage.username)
document.getElementById("profilePic").style.backgroundImage = "url('"+userInfo.pic+"')"
document.getElementById("profileName").innerHTML = userInfo.username
document.getElementById("profileEmail").innerHTML = userInfo.email