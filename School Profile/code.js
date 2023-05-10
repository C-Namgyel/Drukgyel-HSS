//Nav
function navOpen() {
    document.getElementById("navBarrier").hidden = false;
    animation(document.getElementById("navDiv"), "navOpen", "0.5s")
    animation(document.getElementById("navBarrier"), "fadeIn", "0.5s")
}
function navClose() {
    animation(document.getElementById("navDiv"), "navClose", "0.5s")
    animation(document.getElementById("navBarrier"), "fadeOut", "0.5s")
    setTimeout(function() {
        document.getElementById("navBarrier").hidden = true;
    }, 500)
}
var userInfo = JSON.parse(localStorage.username)
document.getElementById("profilePic").style.backgroundImage = "url('"+userInfo.pic+"')"
document.getElementById("profileName").innerHTML = userInfo.username
document.getElementById("profileEmail").innerHTML = userInfo.email