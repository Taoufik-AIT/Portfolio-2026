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
    if (event.target.closest('a, summary, button, .accordion__content')) return
    popupAbout.classList.remove('is-open')
    overlay.classList.remove('is-open')
    state.isAboutOpen = false
    return
  }

  if (event.target.closest('.nav, .carousel, .popup-project, .project__cta')) return
  
  // Positionner le popup à la position du clic
  popupProject.style.left = event.clientX + 'px'
  popupProject.style.top = event.clientY + 'px'
  
  const isOpen = popupProject.classList.toggle('is-open')
  overlay.classList.toggle('is-open')
  state.isPopupOpen = isOpen
})