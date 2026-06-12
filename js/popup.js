const popupProject = document.querySelector('.popup-project')
const popupAbout = document.querySelector('.popup-about')
const overlay = document.querySelector('.overlay')
const navAbout = document.querySelector('.nav__about')

function closeAbout() {
  popupAbout.classList.remove('is-open')
  overlay.classList.remove('is-open')
  state.isAboutOpen = false
  document.querySelectorAll('.accordion__item').forEach(d => d.removeAttribute('open'))
  window.setCursorState(false)
}

navAbout.addEventListener('click', function(event) {
  event.stopPropagation()
  const isOpen = popupAbout.classList.toggle('is-open')
  overlay.classList.toggle('is-open')
  state.isAboutOpen = isOpen
  window.setCursorState(isOpen)
})

document.addEventListener('click', function(event) {

  if (state.isAboutOpen) {
    if (event.target.closest('.about__close')) { closeAbout(); return }
    if (event.target.closest('a, summary, button, .accordion__content, .separator')) return
    closeAbout()
    return
  }

  if (state.isPopupOpen) {
    popupProject.classList.remove('is-open')
    overlay.classList.remove('is-open')
    state.isPopupOpen = false
    window.setCursorState(false)
    return
  }

  if (event.target.closest('.nav, .carousel, .project__cta')) return
  
  popupProject.classList.add('is-open')
  overlay.classList.add('is-open')
  state.isPopupOpen = true
  window.setCursorState(true)

  const pw = popupProject.offsetWidth
  const ph = popupProject.offsetHeight
  const cw = cursor.offsetWidth / 2
  const margin = 20
  const gap = 10

  const rawX = event.clientX > window.innerWidth / 2 ? event.clientX - cw - pw - gap : event.clientX + cw + gap
  const x = Math.min(Math.max(margin, rawX), window.innerWidth - pw - margin)
  const y = Math.min(Math.max(margin, event.clientY - ph / 2), window.innerHeight - ph - margin)

  popupProject.style.left = x + 'px'
  popupProject.style.top = y + 'px'
})