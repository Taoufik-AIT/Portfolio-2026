const cursor = document.querySelector('.cursor')
const barV = document.querySelector('.cursor__bar--v')

window.addEventListener('mousemove', function(event) {
  cursor.style.display = 'block'
  cursor.style.left = event.clientX + 'px'
  cursor.style.top = event.clientY + 'px'

  if (state.isPopupOpen || state.isAboutOpen) {
    const pw = popupProject.offsetWidth
    const ph = popupProject.offsetHeight
    const margin = 20
    const gap = 10
    const cw = cursor.offsetWidth / 2

    const rawX = event.clientX > window.innerWidth / 2 ? event.clientX - cw - pw - gap : event.clientX + cw + gap
    const x = Math.min(Math.max(margin, rawX), window.innerWidth - pw - margin)
    const y = Math.min(Math.max(margin, event.clientY - ph / 2), window.innerHeight - ph - margin)

    popupProject.style.left = x + 'px'
    popupProject.style.top = y + 'px'
    barV.style.display = 'none'
  } else {
    barV.style.display = 'block'
  }
})