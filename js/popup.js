const popupProject = document.querySelector('.popup-project')

document.addEventListener('click', function(event) {
  if (event.target.closest('.nav, .carousel, .popup-project, .project__cta')) return

  const isOpen = popupProject.classList.toggle('is-open')
  state.isPopupOpen = isOpen
})
