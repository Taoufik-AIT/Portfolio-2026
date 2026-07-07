const cursor = document.querySelector('.cursor')
const barV = document.querySelector('.cursor__bar--v')
const barH = document.querySelector('.cursor__bar--h')

window.setCursorState = function(isOpen) {
  const rotation = isOpen ? 'translate(-50%, -50%) rotate(45deg)' : 'translate(-50%, -50%)'
  barV.style.transform = rotation
  barH.style.transform = rotation
}

window.setCursorState(false)

var cursorVisible = false

window.addEventListener('mousemove', function(event) {
  if (!cursorVisible) { cursor.style.display = 'block'; cursorVisible = true }
  cursor.style.left = event.clientX + 'px'
  cursor.style.top = event.clientY + 'px'

  if (state.isPopupOpen) {
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
  }
})

const hoverTargets = document.querySelectorAll('.nav__logo, .nav__links a, .nav__links button, .project__cta, .about__accordion, .about__link, .carousel')

hoverTargets.forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursor.style.width = '10px'
    cursor.style.height = '10px'
    barV.style.display = 'none'
    barH.style.display = 'none'
  })
  el.addEventListener('mouseleave', function() {
    cursor.style.width = '57px'
    cursor.style.height = '20px'
    barV.style.display = 'block'
    barH.style.display = 'block'
  })
})