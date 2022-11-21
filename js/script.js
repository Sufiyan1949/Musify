const homeData = new Array();
let playList = new Array();
let searchSongData = new Array();
const uid = sessionStorage.getItem("uid");
const uEmail = sessionStorage.getItem("email");



/* Session uid & email */
console.log("uid: " + uid + ", Email: " + uEmail);
document.body.onload = () => {
    route('shimmer');
    loadData();
}

document.querySelectorAll('.playPauseBtn').forEach((btn) => {
    btn.addEventListener('click', function () {
        togglePPIcon(this.querySelector("Img").id);
    });
});

document.querySelectorAll('.navItem, .navItem2').forEach((btn) => {
    btn.addEventListener('click', function () {
        if (uid != null || this.id == "search" || this.id == "home") {
            var current = document.getElementsByClassName("sideBarActive");
            current[0].className = current[0].className.replace(" sideBarActive", "");
            this.className += " sideBarActive";
            route(this.id);
        } else location.href = "signin.html";
    });
});

document.getElementById("SvgMenu").onclick = () => {
    var x = document.getElementById("navMenuLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}


function random_bg_color() {
    let red = Math.floor(Math.random() * 176) + 10
    let green = Math.floor(Math.random() * 176) + 10;
    let blue = Math.floor(Math.random() * 176) + 10;
    let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";
    return bgColor;
}

function togglePPIcon(id) {
    var img = document.getElementById(id).src;
    if (img.indexOf('assets/ic_play.svg') != -1)
        document.getElementById(id).src = 'assets/ic_pause.svg';
    else
        document.getElementById(id).src = 'assets/ic_play.svg';

}

function route(id, i = null) {
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhttp.onload = function () {
        if (id != 'search')
            document.querySelector('.searchbar').style = "display: none;";

        if (id == 'search') {
            document.querySelector('.searchbar').style = "display: flex;";
            document.querySelectorAll('.catCard').forEach((card) => {
                card.style.backgroundColor = random_bg_color();
            });


        }

        if (id == 'library') {
            document.querySelectorAll(".musiclistbutton")[0].addEventListener('click', () => {
                document.querySelector(".availListCtnr").style = "display: block;";
                document.querySelector(".noListCtnr").style = "display: none;";
            });
        }
        if (id == 'home') {
            var cards = document.querySelectorAll(".spotify-playlist > .list .item");
            homeData.forEach((item, idx) => {
                const e = cards[idx].querySelector("h4");
                e.textContent = item.title;
                e.id = item.id;
                cards[idx].querySelector("p").textContent = item.subtitle;
                cards[idx].querySelector("img").src = item.img;
                cards[idx].addEventListener("click", function () {
                    route('playlist', { id: item.id, title: item.title, subtitle: item.subtitle, img: item.img });
                });
            });
        }
        if (id == 'playlist' && i != null) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://musify.42web.io/Api's/getPlaylistSongs.php?id=" + i.id, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("id=" + i.id);
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.responseText);
                    if (playList.length != 0) playList = new Array();
                    obj.forEach(element => {
                        let imgp = element.simgpath.replace("./", "/");
                        playList.push({
                            id: element.sid,
                            title: element.sname,
                            path: element.spath,
                            simgpath: "https://musify.42web.io" + imgp,
                            artist: element.sartist,
                            duration: element.sduration,
                            cid: element.cid,
                            sadded: element.psong_added
                        });
                    });
                }
            };
            xhttp.onload = function () {
                document.querySelector(".tophead>.ctnr .title").textContent = i.title;
                document.querySelector(".tophead>.ctnr .subtitle").textContent = i.subtitle;
                document.querySelector(".tophead").style = "background-image:url(" + i.img + ")";
                const slist = document.querySelector('.tableList').getElementsByTagName('tbody')[0];
                playList.forEach((e, i) => {
                    let row = slist.insertRow();
                    let cell1 = row.insertCell(0);
                    let cell3 = row.insertCell(1);
                    let cell4 = row.insertCell(2);

                    cell1.innerHTML = "<div class='title'>\n" +
                        "                            <p class='number'> " + (i + 1) + " </p><img src='" + e.simgpath + "' alt='cover'\n" +
                        "                                class='img'>\n" +
                        "                            <div class='songdetails'>\n" +
                        "                                <p class='songname' value='" + i + "' >" + e.title + "</p>\n" +
                        "                                <p class='artistname'>" + e.artist + "</p>\n" +
                        "                            </div>\n" +
                        "                        </div>";

                    cell3.innerHTML = "<div>\n" +
                        "                            <p class='dateadded'>" + e.sadded + "</p>\n" +
                        "                        </div>";
                    cell4.innerHTML = "<div>\n" +
                        "                            <p class='time'>" + e.duration.replace("00:", "") + "</p>\n" +
                        "                        </div>";
                });

            }
        }
    }
    xhttp.open("GET", "pages/" + id + ".txt", true);
    xhttp.send();
}

function loadPlaylist(id) {


}

function loadData() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://musify.42web.io/Api's/getPlaylistForHome.php?id=18", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            obj.forEach(element => {
                let imgp = element.pimg_path.replace(".", "");
                homeData.push({
                    id: element.pid,
                    title: element.ptitle,
                    subtitle: element.psubtitle,
                    img: "https://musify.42web.io" + imgp
                });
            });
        }
    };
    xhttp.onload = function () {
        setTimeout("route('home')", 1000);
        //route("home");
    }

}

function getSongs(s) {
    const catCtnr = document.querySelector('.categoryCtnr');
    const parCtnr = document.querySelector('.parentCtnr');
    if (s.length != 0) {
        parCtnr.style = 'display: flex';
        catCtnr.style = 'display: none';
    }
    else {
        catCtnr.style = 'display: block';
        parCtnr.style = 'display: none';
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://musify.42web.io/Api's/search.php?sname=" + s, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("sname=" + s);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            const sDiv = document.querySelector('.songCtnr');
            sDiv.innerHTML = '<h2>Songs</h2>';
            obj.forEach(element => {
                let imgp = "https://musify.42web.io" + element.simgpath.replace(".", "");
                searchSongData.push({
                    sId: element.sid,
                    sName: element.sname,
                    sArtist: element.sartist,
                    sDuration: element.sduration,
                    sPath: element.spath,
                    sImg: imgp
                });
                var ele = document.createElement("div");
                ele.innerHTML = "<div class='songItem'>" +
                    "<div class='imgCtnr'>" +
                    "<img src='" + imgp + "'>" +
                    "</div>" +
                    "<div class='textCtnr'>" +
                    "<div class='left'>" +
                    "<h3>" + element.sname + "</h3>" +
                    "<p>" + element.sartist + "</p>" +
                    "</div>" +
                    "<div class='right'>" +
                    "<h4>" + element.sduration.replace("00:", "") + "</h4>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                sDiv.appendChild(ele);
            });
        }
    };
    xhttp.onload = function () {
    }

}

/* let audio = new Audio("http://21273.live.streamtheworld.com/LOS40_DANCE.mp3");

let volume = document.querySelector("#volume");
volume.addEventListener("change", function(e) {
audio.volume = e.currentTarget.value / 100;
}) */