//Functions
function getScreen() {
    for (let s = 0; s < document.querySelectorAll(".scrn").length; s++) {
        if (document.querySelectorAll(".scrn")[s].hidden == false) {
            return(document.querySelectorAll(".scrn")[s])
        }
    }
}
function animation(elem, name, duration) {
    elem.style.animationName = name;
    elem.style.animationDuration = duration;
    elem.style.animationFillMode = "forwards"
    elem.style.animationTimingFunction = "calc()"
}
function setScreen(id) {
    let cur = getScreen()
    for (let s = 0; s < document.querySelectorAll(".scrn").length; s++) {
        if (document.querySelectorAll(".scrn")[s].id == id) {
            cur.style.zIndex = 1;
            document.querySelectorAll(".scrn")[s].zIndex = 0;
            document.querySelectorAll(".scrn")[s].hidden = false;
            animation(cur, "scrnClose", "0.5s")
            setTimeout(function() {
                cur.hidden = true;
            }, 750)
        }
    }
}
function setWindow(dir) {
    setTimeout(function() {
        window.open(dir, "_self")
    }, 0)
}
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function fetchimage(dataImage) {
    return("data:image/png;base64," + dataImage)
}
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
