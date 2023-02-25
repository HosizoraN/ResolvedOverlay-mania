const file = [];
let api = "";
async function getAPI() {
    try {
        const jsonData = await $.getJSON("config.json");
        jsonData.map((num) => {
            file.push(num);
        });
        api = file[0].api;
        document.getElementById("recorderName").innerHTML = file[2].recorder;
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
};
getAPI();
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let box = document.getElementById("box");
let box2 = document.getElementById("box2");
let style = document.getElementById("style");

let recorder = document.getElementById("recorder");
let recorderName = document.getElementById("recorderName");
let mapid = document.getElementById('mapid');
let mapBG = document.getElementById("mapBG");
let overlay = document.getElementById("overlay");
let h320_shadow = document.getElementById("h320_shadow");
let h300_shadow = document.getElementById("h300_shadow");
let h200_shadow = document.getElementById("h200_shadow");
let h100_shadow = document.getElementById("h100_shadow");
let h50_shadow = document.getElementById("h50_shadow");
let h0_shadow = document.getElementById("h0_shadow");

let h320 = document.getElementById("h320");
let h300 = document.getElementById("h300");
let h200 = document.getElementById("h200");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let h0 = document.getElementById("h0");
let ur = document.getElementById("ur");
let score = document.getElementById("score");
let acc = document.getElementById("acc");
let combo = document.getElementById("combo");
let username = document.getElementById("username");
let country = document.getElementById("country");
let ranks = document.getElementById("ranks");
let countryRank = document.getElementById("countryRank");
let playerPP = document.getElementById("playerPP");
socket.onopen = () => console.log("Successfully Connected");
socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = error => console.log("Socket Error: ", error);
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

let animation = {
    acc: new CountUp('acc', 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: false,
        separator: " ",
        decimal: ".",
        suffix: "%"
    }),
    score: new CountUp('score', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: "."
    }),
    combo: new CountUp('combo', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: "x"
    }),
}
let tempMapID;
let gameState;
let tempScore;
let tempAcc;
let tempCombo;
let tempUsername;
let tempUID;
let tempCountry;
let tempRanks;
let tempcountryRank;
let tempPlayerPP;
let tempSmooth;
let tempMapScores = [];
let playerPosition;
let t_title;
let t_subtitle;
let tempImg;

let t_h320;
let t_h300;
let t_h200;
let t_h100;
let t_h50;
let t_h0;
let t_ur;

let t_left;
let t_right;
let state;
let interfaceID;
let apiGetSet = false;
let tempTimeCurrent;
let colorSet = 0;
let tempTimeFull;
let tempFirstObj;
let tempTimeMP3;
let smoothOffset = 2;
let seek;
let fullTime;

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    if (data.gameplay.name && tempUsername !== data.gameplay.name) {
        tempUsername = data.gameplay.name;
        username.innerHTML = tempUsername;
        setupUser(tempUsername);
    }
    if (tempImg !== data.menu.bm.path.full) {
        tempImg = data.menu.bm.path.full;
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, '%23').replace(/%/g, '%25').replace(/\\/g, '/').replace(/'/g, '%27');
        mapBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
    }
    if (data.gameplay.score == 0) { }

    if (tempScore !== data.gameplay.score) { 
        tempTotalAvg = 0;
        tempTotalWeighted = 0;
        tempAvg = 0;
        tempScore = data.gameplay.score;
        score.innerHTML = tempScore;
        animation.score.update(score.innerHTML);
    }

    if (tempAcc !== data.gameplay.accuracy) {
        tempAcc = data.gameplay.accuracy;
        acc.innerHTML = tempAcc;
        animation.acc.update(acc.innerHTML);
    }
    if (tempCombo !== data.gameplay.combo.current) {
        tempCombo = data.gameplay.combo.current;
        if (data.gameplay.combo.current == data.gameplay.combo.max) {
            tempMaxCombo = data.gameplay.combo.max;
        }
        combo.innerHTML = tempCombo;
        animation.combo.update(combo.innerHTML);
    }
    if (fullTime !== data.menu.bm.time.mp3) {
        fullTime = data.menu.bm.time.mp3;
        onepart = 490 / fullTime;
    }
    try {
        let data = JSON.parse(event.data);
        let play = data.gameplay;
        
        if (t_h320 !== play.hits.geki){
            t_h320 = play.hits.geki;
            h320.innerHTML = t_h320;
            var s = h320_shadow.style;
            s.opacity = 1;
        }
        if (t_h300 !== play.hits[300]){
            t_h300 = play.hits[300];
            h300.innerHTML = t_h300;
            var s = h300_shadow.style;
            s.opacity = 1;
        }
        if (t_h200 !== play.hits.katu){
            t_h200 = play.hits.katu;
            h200.innerHTML = t_h200;
            var s = h200_shadow.style;
            s.opacity = 1;
        }
        if (t_h100 !== play.hits[100]){
            t_h100 = play.hits[100];
            h100.innerHTML = t_h100;
            var s = h100_shadow.style;
            s.opacity = 1;
        }
        if (t_h50 !== play.hits[50]){
            t_h50 = play.hits[50];
            h50.innerHTML = t_h50;
            var s = h50_shadow.style;
            s.opacity = 1;
        }
        if (t_h0 !== play.hits[0]){
            t_h0 = play.hits[0];
            h0.innerHTML = t_h0;
            var s = h0_shadow.style;
            s.opacity = 1;
        }
        if (h320_shadow.style.opacity > 0) {
            setTimeout(function () {
                h320_shadow.style.opacity -= .05;
            }, 80)
        }
        if (h300_shadow.style.opacity > 0) {
            setTimeout(function () {
                h300_shadow.style.opacity -= .05;
            }, 80)
        }
        if (h200_shadow.style.opacity > 0) {
            setTimeout(function () {
                h200_shadow.style.opacity -= .05;
            }, 80)
        }
        if (h100_shadow.style.opacity > 0) {
            setTimeout(function () {
                h100_shadow.style.opacity -= .05;
            }, 80)
        }
        if (h50_shadow.style.opacity > 0) {
            setTimeout(function () {
                h50_shadow.style.opacity -= .05;
            }, 80)
        }
        if (h0_shadow.style.opacity > 0) {
            setTimeout(function () {
                h0_shadow.style.opacity -= .05;
            }, 80)
        }
    
  } catch (err) { console.log(err); };
};

async function setupUser(name) {
    let data;
    if (api != "")
    data = await getUserDataSet(name);
    else
        data = null;
    //const avaImage = await getImage('8266808');
    if (data === null) {
        data = {
            "user_id": "baka",
            "username": `${name}`,
            "pp_rank": "0",
            "pp_raw": "0",
            "country": "__",
            "pp_country_rank": "0",
        }
    }
    tempUID = data.user_id;

    tempCountry = `${(data.country).split('').map(char => 127397 + char.charCodeAt())[0].toString(16)}-${(data.country).split('').map(char => 127397 + char.charCodeAt())[1].toString(16)}`;
    tempRanks = data.pp_rank;
    tempcountryRank = data.pp_country_rank;
    tempPlayerPP = data.pp_raw

    if (tempUID !== "baka") {
        ava.style.backgroundImage = `url('https://a.ppy.sh/${tempUID}')`;
    }
    else {
        ava.style.backgroundImage = "url('./static/baka.png')";
    }

    country.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;

    ranks.innerHTML = "#" + tempRanks;

    countryRank.innerHTML = "#" + tempcountryRank;

    playerPP.innerHTML = Math.round(tempPlayerPP) + "pp";
    async function getUserDataSet(name) {
        try {
            const data = (
                await axios.get("/get_user", {
                    baseURL: "https://osu.ppy.sh/api",
                    params: {
                        k: api,
                        u: name,
                        m: 3,
                    },
                })
            )["data"];
            return data.length !== 0 ? data[0] : null;
        } catch (error) {
            console.error(error);
        }
    };
    async function getMapDataSet(beatmapID) {
        try {
            const data = (
                await axios.get("/get_beatmaps", {
                    baseURL: "https://osu.ppy.sh/api",
                    params: {
                        k: api,
                        b: beatmapID,
                    },
                })
            )["data"];
            return data.length !== 0 ? data[0] : null;
        } catch (error) {
            console.error(error);
        }
    };
    async function postUserID(id) {
        try {
            let imageData = null;
            const dataImageAsBase64 = await axios.post('http://bangdream-wave-rsx-airblade-sh.herokuapp.com', { user_id: id }, {
                headers: {
                    'content-type': 'application/json',
                }
            }).then(response => { imageData = response.data.data });
            return imageData;
        } catch (error) {
            console.error(error);
        }
    }
    if (tempTimeCurrent !== data.menu.bm.time.current) {
        // if (tempTimeCurrent > data.menu.bm.time.current) {
        //     leaderboard.innerHTML = '';
        //     $("#ourplayer").remove();
        //     ourplayerSet = 0;
        //     leaderboardSet = 0;
        // }
        tempTimeCurrent = data.menu.bm.time.current;
        tempTimeFull = data.menu.bm.time.full;
        tempTimeMP3 = data.menu.bm.time.mp3;
        interfaceID = data.settings.showInterface;
    }
    if (tempTimeCurrent >= tempFirstObj + 5000 && tempTimeCurrent <= tempFirstObj + 11900 && gameState == 2) {
        recorder.style.transform = "translateX(600px)";
        if (tempTimeCurrent >= tempFirstObj + 5500)
            recorderName.style.transform = "translateX(600px)";
    }
    else {
        recorder.style.transform = 'none';
        recorderName.style.transform = 'none';
    }
    if (tempTimeCurrent >= tempTimeFull - 10000 && gameState === 2 && !apiGetSet)
    fetchData();
}
