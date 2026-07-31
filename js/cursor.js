// cursor, barV, barH, cursorMoved, mouseX, mouseY, revealCursor(), initHoverTargets()
// sont fournis par cursor-core.js chargé avant ce fichier

window.setCursorState = function(isOpen) {
  cursor.classList.toggle('is-open', isOpen)
  gsap.to(cursor, {
    width:    isOpen ? 20 : 57,
    height:   20,
    duration: 0.4,
    ease:     'power3.out',
    overwrite: 'auto'
  })
  if (isOpen) {
    gsap.to([barV, barH], { opacity: 1, duration: 0.15, ease: 'power2.out', overwrite: 'auto' })
  }
}

window.setCursorState(false)

let cursorReady      = false
let cursorRevealDone = false

window.showCursor = function() {
  cursorReady = true
  if (window.matchMedia('(max-width: 430px)').matches) {
    cursorRevealDone = true
    return
  }
  if (cursorMoved && !cursorRevealDone) {
    cursorRevealDone = true
    revealCursor()
  }
}

// Révélation si la souris a bougé avant showCursor + positionnement popup
window.addEventListener('mousemove', function(event) {
  if (cursorReady && !cursorRevealDone) {
    cursorRevealDone = true
    revealCursor()
  }

  if (!cursorReady) return
  if (isMobile) return

  if (state.isPopupOpen) {
    const pw     = popupProject.offsetWidth
    const ph     = popupProject.offsetHeight
    const margin = 20
    const gap    = 10
    const cw     = 10

    const rawX = event.clientX > window.innerWidth / 2
      ? event.clientX - cw - pw - gap
      : event.clientX + cw + gap
    const x = Math.min(Math.max(margin, rawX), window.innerWidth - pw - margin)
    const y = Math.min(Math.max(margin, event.clientY - ph / 2), window.innerHeight - ph - margin)

    gsap.to(popupProject, { x, y, duration: 0.50, ease: 'power2.out', overwrite: 'auto' })
  }
})

initHoverTargets(
  '.nav__logo, .nav__links a, .nav__links button, .project__cta, .about__accordion, .about__link, .carousel',
  { getRestoreWidth: function() { return cursor.classList.contains('is-open') ? 20 : 57 } }
)
