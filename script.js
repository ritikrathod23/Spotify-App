console.log("Welcome to Spotify");
let songs;
let currSong = new Audio();

let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/Songs/${folder}/`)
    // console.log(a);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/Songs/${folder}/`)[1])
            // console.log(songs)
        }
    }
    return songs;


}



// displaying songs in playlist or Library
async function playingSongInPlaylist() {



}


// Displaying Cards In container
async function displaycards() {

    cardContainer = document.querySelector(".cards")
    let b = await fetch(`Songs/Songs/`)
    let response = await b.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a")
    let array = Array.from(anchor)
    for (let index = 3; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes(`Songs/Songs`)) {
            let folder = (e.href.split("/").slice(-1)[0])

            let a = await fetch(`Songs/Songs/${folder}/info.json`)
            let responses = await a.json();


            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                                                                    <img class="Cardimage" src="Songs/Songs/${folder}/cover.jpg">
                                                                    <div class = "cardinfo">
                                                                        <h3>${responses.title}</h3>
                                                                        <div>${responses.description}</div>
                                                                    </div>
                                                                </div>`
        }
    }


    // Listing Songs in Container
    let boxcards = Array.from(document.querySelectorAll(".card"));
    // console.log(cards)
    boxcards.forEach(e => {
        e.addEventListener('click', async item => {
            // console.log("Element")
            cardContainer.innerHTML = " ";
            let containerSong = document.querySelector(".songlist").getElementsByTagName("ul")[0]
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            for (const song of songs) {
                containerSong.innerHTML = containerSong.innerHTML + ` <li>
                <img  class="playlistImage imga" src="tanjiro.jpg" alt="">
                <div class="name-artist songtxt">${song.replaceAll("%20", " ")}
                </div>
                <img  width = "20px" id="likebtn" class = "like" src="like.svg">
                <img width="15px" id="playbutton" class="playbtn" src="play.svg" alt=""> 
                </li>`

            }



            // Adding event listener cover Image -> click -> show cover with songs 
            let coverImage = document.querySelector(".coverImg")
            coverImage.innerHTML = coverImage.innerHTML + ` <img src="Songs/${currFolder}/cover.jpg"" alt="">`

            //playing Songs when click songs
            let ListSongs = Array.from(document.querySelectorAll(".songlist ul li"))
            ListSongs.forEach(e => {
                e.addEventListener('click', element => {
                    playMusic(e.querySelector(".name-artist").innerHTML)
                    // console.log(e)

                    // adding song name to playbar when cick any song from playlist
                    songinfo.innerHTML = e.querySelector(".name-artist").innerHTML;

                    // adding image to playbar when cick any song from playlist
                    let playlisting = e.querySelector(".playlistImage");
                    barimage.src = playlisting.src.split("/").slice(-1);
                    //    console.log()
                })
            })



            // like button EventLister -> add songs to playlist section.

            let songUrl = document.querySelector(".playlist").getElementsByTagName("ul")[0]

            let likeButtons = Array.from(document.querySelectorAll(".like"));
            likeButtons.forEach(button => {
                button.addEventListener('click', async function (e) {
                    e.stopPropagation();
                    const songItem = e.target;

                    const imageSong = songItem.parentElement;

                    const songClone = imageSong.cloneNode(true);

                    const likeButtonClone = songClone.querySelector(".like");
                    if (likeButtonClone) {
                        likeButtonClone.remove();
                    }

                    songUrl.appendChild(songClone);

                    // playingMusic from playlist library and Adding to Playbar
                    let playlistSong = Array.from(document.querySelectorAll(".playlist ul li"))
                    console.log(playlistSong);
                    playlistSong.forEach(e => {
                        e.addEventListener('click', element => {
                            playMusic(e.querySelector(".name-artist").innerHTML);
        
                            // adding song name to playbar when cick any song from playlist
                            songinfo.innerHTML = e.querySelector(".name-artist").innerHTML;
        
                            let playlisting = e.querySelector(".playlistImage");
                               console.log(playlisting)
                            barimage.src = playlisting.src.split("/").slice(-1);
        
                        })
                    })
                })
            })

        })
    })


}


// Playing Music
const playMusic = (track, pause = false) => {
    currSong.src = `Songs/${currFolder}/` + track
    // console.log(currSong.src)
    if (!pause) {
        currSong.play();
        play.src = "pause.svg"

    }
}



async function main() {


    // Displaying Cards
    await displaycards();


    await playingSongInPlaylist();



    // playbar Events for pause button
    play.addEventListener("click", () => {

        if (currSong.paused) {
            currSong.play()
            play.src = "pause.svg"
        }
        else {
            currSong.pause()
            play.src = "play.svg"
        }
    })

    // playbar Events for next button
    next.addEventListener("click", () => {
        currSong.pause();


        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }


        // adding song name to playbar when cick next song from playlist
        replaces = songs[index + 1].replaceAll("%20", " ");
        songinfo.innerHTML = replaces


    })

    // playbar Events for previous button
    previous.addEventListener("click", () => {
        currSong.pause();
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

        // adding song name to playbar when cick previous song from playlist
        replaces = songs[index - 1].replaceAll("%20", " ");
        songinfo.innerHTML = replaces;

    })

    back.addEventListener('click', async () => {
        document.querySelector(".cards").innerHTML = " "
        document.querySelector(".songlist ul").innerHTML = " "
        document.querySelector(".coverImg").innerHTML = " ";
        displaycards();
    })





    return songs;



}
main();
