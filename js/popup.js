const popupProject = document.querySelector('.popup-project')
const popupAbout = document.querySelector('.popup-about')
const overlay = document.querySelector('.overlay')
const navAbout = document.querySelector('.nav__about')

navAbout.addEventListener('click', function(event) {
  event.stopPropagation()
  const isOpen = popupAbout.classList.toggle('is-open')
  overlay.classList.toggle('is-open')
  state.isAboutOpen = isOpen
})

document.addEventListener('click', function(event) {

  if (state.isAboutOpen) {
    if (event.target.closest('a, summary, button, .accordion__content, .separator')) return
    popupAbout.classList.remove('is-open')
    overlay.classList.remove('is-open')
    state.isAboutOpen = false
    return
  }

  if (state.isPopupOpen) {
    popupProject.classList.remove('is-open')
    overlay.classList.remove('is-open')
    state.isPopupOpen = false
    return
  }

  // Zones interdites pour ouvrir le popup-project
  if (event.target.closest('.nav, .carousel, .project__cta')) return
  
  popupProject.style.left = event.clientX + 'px'
  popupProject.style.top = event.clientY + 'px'
  
  popupProject.classList.add('is-open')
  overlay.classList.add('is-open')
  state.isPopupOpen = true
})