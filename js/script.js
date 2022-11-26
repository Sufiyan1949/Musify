const host = "http://localhost/Musify/";
const path = "Api's/";
const homeData = new Array();
let playList = new Array();
let searchSongData = new Array();
let track_index = 0;
const uid = sessionStorage.getItem("uid");
const uEmail = sessionStorage.getItem("email");

/* Session uid & email */
console.log("uid: " + uid + ", Email: " + uEmail);
document.body.onload = () => {
    route('shimmer');
    loadData();
}

/*document.querySelectorAll('.playPauseBtn').forEach((btn) => {
    btn.addEventListener('click', function () {
        togglePPIcon(this.querySelector("Img").id);
    });
});*/

document.querySelectorAll('.navItem, .navItem2').forEach((btn) => {
    btn.addEventListener('click', function () {
        if (uid != null || this.id === "search" || this.id === "home") {
            const current = document.getElementsByClassName("sideBarActive");
            current[0].className = current[0].className.replace(" sideBarActive", "");
            this.className += " sideBarActive";
            route(this.id);
        } else location.href = "signin.html";
    });
});

document.getElementById("SvgMenu").onclick = () => {
    const x = document.getElementById("navMenuLinks");
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
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

function togglePPIcon(id) {
    const img = document.getElementById(id).src;
    if (img.indexOf('assets/ic_play.svg') != -1)
        document.getElementById(id).src = 'assets/ic_pause.svg';
    else
        document.getElementById(id).src = 'assets/ic_play.svg';

}

function route(id, i = null) {
    const xhttp = new XMLHttpRequest();
    //const sbr = document.querySelector('.searchbar > input');

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhttp.onload = function () {
        if (id === 'search') {
            document.querySelector('.searchbar').style = "display: flex;";
            document.querySelectorAll('.catCard').forEach((card) => {
                card.style.backgroundColor = random_bg_color();
            });
        } else document.querySelector('.searchbar').style = "display: none;";

        if (id === 'library') {
            document.querySelectorAll(".musiclistbutton")[0].addEventListener('click', () => {
                document.querySelector(".availListCtnr").style = "display: block;";
                document.querySelector(".noListCtnr").style = "display: none;";
            });
        }
        if (id === 'home') {
            const cards = document.querySelectorAll(".spotify-playlist > .list .item");
            homeData.forEach((item, idx) => {
                const e = cards[idx].querySelector("h4");
                e.textContent = item.title;
                e.id = item.id;
                cards[idx].querySelector("p").textContent = item.subtitle;
                cards[idx].querySelector("img").src = item.img;
                cards[idx].addEventListener("click", function () {
                    route('playlist', {id: item.id, title: item.title, subtitle: item.subtitle, img: item.img});
                });
            });
        }
        if (id === 'playlist' && i != null) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", host + path + "getPlaylistSongs.php?id=" + i.id, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("id=" + i.id);
            xhttp.onreadystatechange = function () {
                console.log(this.responseText);
                if (this.readyState == 4 && this.status == 200) {
                    /*const obj = JSON.parse(this.responseText);
                    if (playList.length !== 0) playList = [];
                    obj.forEach(element => {
                        playList.push({
                            id: element.sid,
                            title: element.sname,
                            path: element.spath,
                            sImgPath: host + element.simgpath.replace("./", "/"),
                            artist: element.sartist,
                            duration: element.sduration,
                            cid: element.cid,
                            sadded: element.psong_added
                        });
                    });*/
                }
            };
            /*xhttp.onload = function () {
                document.querySelector(".tophead>.ctnr .title").textContent = i.title;
                document.querySelector(".tophead>.ctnr .subtitle").textContent = i.subtitle;
                document.querySelector(".parent>.tophead").style.backgroundImage = "url(" + i.img + ")";
                const sList = document.querySelector('.tableList').getElementsByTagName('tbody')[0];
                playList.forEach((e, i) => {
                    let row = sList.insertRow();
                    row.addEventListener("click", function () {
                        track_index = i;
                        loadTrack(i)
                    });
                    let cell1 = row.insertCell(0);
                    let cell3 = row.insertCell(1);
                    let cell4 = row.insertCell(2);

                    cell1.innerHTML = "<div class='title'>\n" +
                        "                            <p class='number'> " + (i + 1) + " </p><img src='" + e.sImgPath + "' alt='cover'\n" +
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

            }*/
        }
    }
    xhttp.open("GET", "pages/" + id + ".txt", true);
    xhttp.send();
}

function loadPlaylist(id) {


}

function loadData() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", host + path + "getPlaylistForHome.php?id=18", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            const obj = JSON.parse(this.responseText);
            obj.forEach(element => {
                homeData.push({
                    id: element.pid,
                    title: element.ptitle,
                    subtitle: element.psubtitle,
                    img: host + element.pimg_path.replace(".", "")
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
    } else {
        catCtnr.style = 'display: block';
        parCtnr.style = 'display: none';
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", host + path + "search.php?sname=" + s, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("sname=" + s);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            const sDiv = document.querySelector('.songCtnr');
            sDiv.innerHTML = '<h2>Songs</h2>';
            obj.forEach(element => {
                let imgPath = host + element.simgpath.replace("./", "/");
                searchSongData.push({
                    sId: element.sid,
                    sName: element.sname,
                    sArtist: element.sartist,
                    sDuration: element.sduration,
                    sPath: element.spath,
                    sImg: imgPath
                });
                const ele = document.createElement("div");
                ele.innerHTML = "<div class='songItem'>" +
                    "<div class='imgCtnr'>" +
                    "<img src='" + imgPath + "'>" +
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