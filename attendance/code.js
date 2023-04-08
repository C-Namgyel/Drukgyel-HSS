/*var classes = []
var secs = ["A", "B", "C", "D", "E"]
for (let c = 12; c >= 7; c--) {
    if (c == 7 || c == 8) {
        for (let s = 0; s < 3; s++) {
            classes.push({class: c + " " + secs[s]})
        }
    } else {
        for (let s = 0; s < 5; s++) {
            classes.push({class: c + " " + secs[s]})
        }
    }
}
console.log(classes)
console.log(JSON.stringify(classes))
//Append
*/
var classes = [
    {"class":"12 A", link: "https://tinyurl.com/3pcez7rs"},
    {"class":"12 B", link: "https://tinyurl.com/t3u3yfsr"},
    {"class":"12 C", link: "https://tinyurl.com/5fdfdtyy"},
    {"class":"12 D", link: "https://tinyurl.com/24rh79b9"},
    {"class":"12 E", link: "https://tinyurl.com/4f5twbsn"},
    {"class":"11 A", link: "https://bit.ly/3EPxhs0"},
    {"class":"11 B", link: "https://bit.ly/3EIVEYc"},
    {"class":"11 C", link: "https://bit.ly/3ZDsD8H"},
    {"class":"11 D", link: "https://bit.ly/3mFJ3z5"},
    {"class":"11 E", link: "https://bit.ly/41A5Qfq"},
    {"class":"10 A", link: "https://bit.ly/3FdDcY4"},
    {"class":"10 B", link: "https://tinyurl.com/5ejfasxy"},
    {"class":"10 C", link: "https://tinyurl.com/yskx9h4c"},
    {"class":"10 D", link: "https://bit.ly/3y17fy6"},
    {"class":"10 E", link: "https://tinyurl.com/bdee495t"},
    {"class":"9 A", link: "https://tinyurl.com/yc4r6z3r"},
    {"class":"9 B", link: "https://tinyurl.com/2p93jt88"},
    {"class":"9 C", link: "https://tinyurl.com/558mdcpc"},
    {"class":"9 D", link: "https://tinyurl.com/5hcbwdy2"},
    {"class":"9 E", link: "https://bit.ly/3IOVboS"},
    {"class":"8 A", link: "https://tinyurl.com/586u3p3j"},
    {"class":"8 B", link: "https://tinyurl.com/ysft64v6"},
    {"class":"8 C", link: "https://tinyurl.com/mvns73cx"},
    {"class":"7 A", link: "https://tinyurl.com/2z2cnup9"},
    {"class":"7 B", link: "https://bit.ly/3me8SpF"},
    {"class":"7 C", link: "https://bit.ly/3J5SW0q"}
]
//Append
for (let a = 0; a < classes.length; a++) {
    document.getElementById("classListHolder").innerHTML += '<button onclick="window.open(\''+classes[a].link+'\', \'_self\')" style="margin: 2%; width: 45%; border-radius: 15px; background-color: black; color: white; font-weight: bolder; font-size: 30px;">' + classes[a].class+ '</button>'
}