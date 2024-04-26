const searchButton = document.querySelector(".searchButton")
const typeSelect = document.querySelector("select")
searchButton.addEventListener("click",getPokemon)

let pokemonArray = []
let openCards = []

function getPokemon(){
    pokemonArray = []
    let picked = document.querySelector(".picked")
    console.log(picked);
    if(picked !== null){
        picked.remove()
    }
    // not need to understand at the moment
    fetch("https://pokeapi.co/api/v2/type/" + typeSelect.value)
    .then(function(response){
    return response.json()
    })
    .then(function(data){
        let pokemonLimit = data.pokemon.slice(0,5)
        pokemonLimit.forEach(pokemon => {
            fetch(pokemon.pokemon.url)
            .then(function(response){
                return response.json()
            })
            .then(function(poke){
                pokemonArray.push(poke)
                    // not need to understand at the moment
                if(pokemonArray.length === 5){
                    pokemonArray = pokemonArray.concat(pokemonArray)
                    pokemonArray = shuffle(pokemonArray)
                    randerPokemons(pokemonArray)
                }
            })
        });
    })
}
let pokemonContainer = document.querySelector(".pokemon-container")
function randerPokemons(pokemonData){
    pokemonData.forEach(function(item){
        let card = document.createElement("div")
        card.classList.add("pokemon-card")
        card.id = item.id
        card.addEventListener("click", openCard)
        cardFront = document.createElement("div")
        cardFront.classList.add("card-front")
        let nameElement = document.createElement("h2")
        nameElement.innerText = item.name
        let imgElement = document.createElement("img")
        imgElement.src = item.sprites.front_default
        cardFront.appendChild(nameElement)
        cardFront.appendChild(imgElement)
        let cardBack = document.createElement("div")
        cardBack.classList.add("card-back")
        let cardBackImg = document.createElement("img")
        cardBackImg.src = "card-back.svg"
        cardBack.appendChild(cardBackImg)
        card.appendChild(cardFront)
        card.appendChild(cardBack)
        pokemonContainer.appendChild(card)
    })
}

function openCard(e){
    let currentCardId = e.target.closest(".pokemon-card").id
    e.target.closest(".pokemon-card").style.transform = "rotateY(180deg)"
    openCards.push(currentCardId)
    
    checkWinStatus()
}
function checkWinStatus(){
    if(openCards.length === 2){
      let isMatch = openCards[0] === openCards[1]
        openCards = []
            setTimeout(() => {
                let cards = document.querySelectorAll(".pokemon-card")
                cards.forEach(function(item){
                    item.replaceWith(item.cloneNode(true))
                    console.log(item.cloneNode());
                })
                if(isMatch === true){
                    alert ("Cards match. You won!")
                }else{
                    alert ("Not a match cards are found. Try again")
                }
                let cardFronts = document.querySelectorAll(".card-front")
                cardFronts.forEach(function(item){
                    let button = document.createElement("button")
                    button.innerText = "Details"
                    button.addEventListener("click", showDetails)
                    item.appendChild(button)
                })
            }, 600);
            setTimeout(() => {
                pokemonContainer.innerHTML = ""
                let h2 = document.createElement ("h2")
                h2.classList.add("picked")
                h2.innerText = "Picked another category"
                pokemonContainer.before(h2)
            }, 5000);
        }
}

let detailsElement = document.querySelector(".details")
function showDetails(e){
    detailsElement.classList.add("detailsActive")
    let pokemonId = e.target.closest(".pokemon-card").id
    let foundPokemon = pokemonArray.find(function(item){
        return item.id === Number(pokemonId)
    })
    let detailsContentElement = document.querySelector(".content")
    let pokemonName = document.createElement("h2")
    pokemonName.textContent = "Name of Pokemon: " + foundPokemon.name
    detailsContentElement.appendChild(pokemonName)
    let pokemonImg = document.createElement("img")
    pokemonImg.src = foundPokemon.sprites.front_default
    detailsContentElement.appendChild(pokemonImg)
    let idElement = document.createElement("p")
    idElement.textContent = "ID: " + foundPokemon.id
    detailsContentElement.appendChild(idElement)
    let pokemonHeight = document.createElement("p")
    pokemonHeight.textContent = " Pokemon height: " + foundPokemon.height
    detailsContentElement.appendChild(pokemonHeight)
    let pokemonWeight = document.createElement("p")
    pokemonWeight.textContent = "Pokemon weight: " + foundPokemon.weight
    detailsContentElement.appendChild(pokemonWeight)
    let typeOfPoke = document.createElement("p")
    typeOfPoke.innerText = "Types:"
    foundPokemon.types.forEach(element => {
        typeOfPoke.innerText = typeOfPoke.innerText + " " + element.type.name
    });
    detailsContentElement.appendChild(typeOfPoke)


}

window.addEventListener("click", function(e){
    if(e.target.classList.contains("close-button")){
        detailsElement.classList.remove("detailsActive")
    }
})

function shuffle(array){
    for(let i = array.length -1; i > 0; i--){
        let j = Math.floor(Math.random()*(i+1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    } return array
}