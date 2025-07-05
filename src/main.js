function mock(text) {
  let capitalize = false
  return text
    .split('')
    .map((char) => {
      if (/[a-zA-Z]/g.test(char)) {
        if (['L', 'l'].includes(char)) capitalize = true
        if (['I', 'i'].includes(char)) capitalize = false
        char = capitalize ? char.toUpperCase() : char.toLowerCase()
        capitalize = !capitalize
      }
      return char
    })
    .join('')
}

function setupEmbedThumbnailStuff() {
  document
    .querySelector('meta[property="og:image"]')
    .setAttribute('content', window.location + 'mock-text-generator.png?')
  document
    .querySelector('meta[property="og:url"]')
    .setAttribute('content', window.location)
}

window.addEventListener('load', () => {
  let successDespawnTimer
  let inputElement = document.getElementById('input')
  let outputElement = document.getElementById('output')
  let copyBtn = document.getElementById('copy-btn')

  setupEmbedThumbnailStuff()

  for (let event of ['keyup', 'change', 'paste']) {
    inputElement.addEventListener(event, (ev) => {
      let val = ev.target.value
      if (event == 'paste') {
        val += ev.clipboardData.getData('text')
      }
      outputElement.value = mock(val)
      copyBtn.disabled = val.length <= 0

      if (event == 'keyup') {
        let box = document.querySelector('.output-box')
        box.classList.add('mock')
        box.style.animation = 'none'
        setTimeout(() => {
          box.style.animation = ''
        }, 10)
      }
    })
  }
  copyBtn.addEventListener('click', async (ev) => {
    ev.preventDefault()
    copyBtn.classList.remove('success')
    if (successDespawnTimer) clearTimeout(successDespawnTimer)
    try {
      await new Promise((res) => setTimeout(res, 150))
      outputElement.select()
      outputElement.setSelectionRange(0, 99999)
      await navigator.clipboard.writeText(outputElement.value)
    } catch (error) {
      console.warn('Copy failed. Trying fallback legacy method.')
      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
        return
      }
    }
    copyBtn.classList.add('success')

    successDespawnTimer = setTimeout(() => {
      copyBtn.classList.remove('success')
    }, 1500)
  })
})
