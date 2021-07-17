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
        volume: 0.75
      })
    }
  })
}

const board = document.getElementById(`soundboard`)
const pads = board.querySelectorAll(`.pad`)

const sounds = []
const clips = []
const overlays = []

pads.forEach(pad => {
  sounds[pad.id] = new Howl({
    src: `${clipsSrc}${pad.id}.mp3`,
    loop: false,
  })

  clips[pad.id] = {
    id: null,
    overlay: null,
  }

  requestAnimationFrame(rafStep)

  pad.addEventListener(`click`, e => {
    const snd = sounds[pad.id]
    const elm = pad.querySelector(`div.progress`)

    pad.classList.add(`isPlaying`)
    const id = snd.play()

    elm.dataset.clip = pad.id
    elm.dataset.soundId = id
    overlays.push(elm)

    clips[pad.id].overlay = elm
    clips[pad.id].id = id

    snd.once(`end`, () => {
      setTimeout(() => {
        pad.classList.remove(`isPlaying`)
      }, 34)
      const index = overlays.indexOf(elm)
      if (index >= 0) {
        overlays.splice(index, 1)
        delete clips[pad.id].overlay
      }
    })
  })
})

function rafStep() {
  const activeOnly = document.querySelectorAll(`.pad.isPlaying`)
  activeOnly.forEach(pad => {
    const progress = pad.querySelector(`div.progress`)
    if (progress && progress instanceof HTMLElement) {
      const seek = sounds[pad.id].seek() || 0
      const duration = sounds[pad.id].duration()
      progress.style.width = `${((seek / duration) * 100) || 0}%`
    }
  })
  requestAnimationFrame(rafStep)
}

// for (var i=0; i<self.sounds.length; i++) {
//   var id = parseInt(self.sounds[i].id, 10);
//   var offset = self._sprite[self.sounds[i].dataset.sprite][0];
//   var seek = (self.sound.seek(id) || 0) - (offset / 1000);
//   self.sounds[i].style.width = (((seek / self.sound.duration(id)) * 100) || 0) + '%';
// }

// requestAnimationFrame(self.step.bind(self));

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
  pads.forEach(pad => {
    const progress = pad.querySelector(`div.progress`)
    if (progress && progress instanceof HTMLElement) {
      progress.style.width = `0%`
    }
    pad.classList.remove(`isPlaying`)
  })
})

stopButton.addEventListener(`click`, e => {
  beatStop()
  pads.forEach(pad => {
    const progress = pad.querySelector(`div.progress`)
    if (progress && progress instanceof HTMLElement) {
      progress.style.width = `0%`
    }
    pad.classList.remove(`isPlaying`)
  })
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
