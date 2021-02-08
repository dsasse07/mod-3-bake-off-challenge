// your code here!
console.log("🥧")

const bakesContainer = document.querySelector("#bakes-container")
const detailsContainer = document.querySelector("#detail")
const img = detailsContainer.querySelector("img")
const bakeName = detailsContainer.querySelector("h1")
const bakeDescription = detailsContainer.querySelector(".description")
const scoreForm = detailsContainer.querySelector("#score-form")
const newBakeForm = document.querySelector("#new-bake-form")
const score = scoreForm.querySelector("[type='number']")
const judgeButton = document.querySelector("#judge-bake-button")
const url = "http://localhost:3000/bakes"

const fetchBakes = _ => {
  fetch(url)
  .then( r => r.json() )
  .then( bakes => {
    for (bake of bakes) {
      renderBake(bake)
    }
  })
}

const renderBake = bake => {
  let li = document.createElement("li")
  li.dataset.id = bake.id
  li.classList.add("item", "bake")
  li.textContent = bake.name
  bakesContainer.append(li)
}

const showBake = id => {
  fetch(url+`/${id}`)
  .then( r => r.json() )
  .then( bake => {
    img.src = bake.image_url
    img.alt = bake.name
    bakeName.textContent = bake.name
    bakeDescription.textContent = bake.description 
    score.value = bake.score
    scoreForm.dataset.id = bake.id
  })
}

const makeBake = e => {
  e.preventDefault()
  let formData = {
    "name": e.target[0].value,
    "description": e.target[1].value,
    "image_url": e.target[2].value,
    "score": 0
  }

  config = {
    "method":"POST",
    "headers": {
      "Content-type":"application/json"
      },
    body: JSON.stringify(formData)
  }
  console.log(JSON.stringify(formData))
  fetch(url, config)
  .then( r => r.json() )
  .then( bake => renderBake(bake) )

  e.target.reset()
}

const scoreBake = e => {
  e.preventDefault()
  let formData = {score: e.target[0].value }

  config = {
    method:"POST",
    headers: {
      "Content-type":"application/json",
      "Authorization": "Bearer 699a9ff1-88ca-4d77-a26e-e4bc31cfc261"
    },
    body: JSON.stringify(formData)
  }

  fetch(url+`/${e.target.dataset.id}/ratings`, config)
  .then( r => r.json() )
  .then( data => console.log(data))
}

const announceWinner = _ => {

  fetch(url+'/winner')
  .then( r => r.json() )
  .then( winner => {
    bakesContainer.querySelector(`[data-id='${winner.id}']`).classList.toggle("winner")
  })
}


const handleClicks = e => {

  switch (true) {
    case (e.target.classList.contains("bake") ):
      showBake(e.target.dataset.id)
      break
    case (e.target.id === "judge-bake-button"):
      announceWinner()
      break
  }
}

bakesContainer.addEventListener('click', handleClicks)
newBakeForm.addEventListener('submit', makeBake)
scoreForm.addEventListener('submit', scoreBake)
judgeButton.addEventListener('click', handleClicks)
fetchBakes()
showBake(1)