const cursor = document.querySelector('.cursor')

window.addEventListener('mousemove', function(event) {
  cursor.style.display = 'block'
  cursor.style.left = event.clientX + 'px'
  cursor.style.top = event.clientY + 'px'

  if (state.isPopupOpen) {
    popupProject.style.left = event.clientX + 'px'
    popupProject.style.top = event.clientY + 'px'
  }
})