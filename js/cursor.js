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

// Ré-évaluation au resize (mobile responsive ↔ desktop). isMobile / cursorRevealDone
// sont figés au chargement : sans ça, en passant du responsive mobile au desktop, le
// curseur custom reste caché jusqu'à un refresh. On lit matchMedia en direct.
let cursorResizeTimer
window.addEventListener('resize', function() {
  clearTimeout(cursorResizeTimer)
  cursorResizeTimer = setTimeout(function() {
    if (!cursorReady) return  // le loader n'a pas encore lancé showCursor : il s'en chargera
    if (window.matchMedia('(max-width: 430px)').matches) {
      cursor.style.display = 'none'  // repassé en mobile : curseur masqué
      cursorRevealDone = true
    } else if (window.getComputedStyle(cursor).display === 'none') {
      // passé en desktop et curseur caché (via CSS .cursor{display:none} OU inline) :
      // getComputedStyle capte les deux, contrairement à cursor.style.display.
      cursorRevealDone = true
      revealCursor()                  // révélé tout de suite, sans attendre un mousemove
    }
  }, 100)
})

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
