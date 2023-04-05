//Login
var profPic
document.getElementById("profilePicInp").oninput = function() {
    if (this.files[0].size / 1024 < 5120) {
        let fReader = new FileReader();
        fReader.onload = function() {
            profPic = fReader.result
            document.getElementById("profilePic").style.backgroundImage = "url('"+profPic+"')"
        };
        let file = this.files[0]
        fReader.readAsDataURL(file);
    } else {
        alert("Image size too big!\nNote that this limit is only while it is being developed and will be removed when the app completed")
    }
}
document.getElementById("loginBtn").onclick = function() {
    localStorage.username = JSON.stringify(
        {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            pic: profPic,
            type: "DHSS-Attendance"
        }
    )
    setWindow("../home/home.html")
}