import { Howl, Howler } from 'howler'

const baseSrc = `dist/audio/`
const clipsSrc = `${baseSrc}clips/`
const beatsSrc = `${baseSrc}beats/`

const tempos = [70, 76, 84, 90, 92]
const variations = [1, 2, 3, 4]
const beats = []

for (let i = 1; i <= 4; i++) {
  beats[i] = []
  tempos.forEach(tempo => {
    beats[i][tempo] = {
      tempo,
      variation: i,
      beat: new Howl({
        src: `${beatsSrc}${tempo}bpm_beat0${i}.mp3`,
        loop: true,
        volume: 0.8
      })
    }
  })
}

const board = document.getElementById(`soundboard`)
const pads = board.querySelectorAll(`.pad`)

const clips = []

pads.forEach(pad => {
  clips[pad.id] = new Howl({
    src: `${clipsSrc}${pad.id}.mp3`,
    loop: false,
  })
  pad.addEventListener(`click`, e => {
    clips[pad.id].play()
  })
})

const playButton = document.getElementById(`beatStart`)
const stopButton = document.getElementById(`beatStop`)
const tempoButton = document.getElementById(`beatTempo`)
const variationButton = document.getElementById(`beatVariation`)

playButton.addEventListener(`click`, e => {
  const selectedTempo = document.querySelector(`[data-tempo-selected]`).dataset.tempoSelected
  const selectedVariation = document.querySelector(`[data-variation-selected]`).dataset.variationSelected
  const selectedBeat = beats[selectedVariation][selectedTempo]
  if (!selectedBeat.beat.playing()) {
    playButton.classList.add(`is-playing`)
    playButton.innerHTML = `Stop`
    Howler.stop()
    selectedBeat.beat.play()
  } else {
    beatStop()
  }
})

stopButton.addEventListener(`click`, e => {
  beatStop()
})

tempoButton.addEventListener(`click`, e => {
  const currentTempoEl = document.querySelector(`[data-tempo-selected]`)
  const currentTempo = currentTempoEl.dataset.tempoSelected
  const selectedVariation = document.querySelector(`[data-variation-selected]`).dataset.variationSelected
  const currentBeat = beats[selectedVariation][currentTempo]
  let tempoIndex = tempos.indexOf(Number(currentTempo))
  if (tempoIndex >= tempos.length - 1) {
    tempoIndex = 0
  } else {
    tempoIndex++
  }
  currentTempoEl.dataset.tempoSelected = `${tempos[tempoIndex]}`
  currentTempoEl.innerHTML = `${tempos[tempoIndex]} BPM`

  if (currentBeat.beat.playing()) {
    playButton.click()
  } else {
    currentBeat.beat.stop()
  }
})

variationButton.addEventListener(`click`, e => {
  const currentVarEl = document.querySelector(`[data-variation-selected]`)
  const currentVar = currentVarEl.dataset.variationSelected
  const selectedTempo = document.querySelector(`[data-tempo-selected]`).dataset.tempoSelected
  const currentBeat = beats[currentVar][selectedTempo]
  let varIndex = variations.indexOf(Number(currentVar))
  if (varIndex >= variations.length - 1) {
    varIndex = 0
  } else {
    varIndex++
  }
  currentVarEl.dataset.variationSelected = `${variations[varIndex]}`
  currentVarEl.innerHTML = `Beat ${variations[varIndex]}`

  if (currentBeat.beat.playing()) {
    playButton.click()
  } else {
    currentBeat.beat.stop()
  }
})

function beatStop() {
  Howler.stop()
  playButton.classList.remove(`is-playing`)
  playButton.innerHTML = `Play`
}
