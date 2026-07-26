const cursor = document.querySelector('.cursor')
const barV = document.querySelector('.cursor__bar--v')
const barH = document.querySelector('.cursor__bar--h')

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

gsap.set(cursor, { xPercent: -50, yPercent: -50 })

let cursorMoved = false
let cursorReady = false
let mouseX = 0
let mouseY = 0

function revealCursor() {
  if (!cursorMoved) return
  cursor.style.display = 'block'
  gsap.set(cursor, { x: mouseX, y: mouseY })
  gsap.fromTo(cursor,
    { clipPath: 'inset(50% 50% 50% 50%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out', clearProps: 'clipPath' }
  )
}

window.showCursor = function() {
  cursorReady = true
  revealCursor()
}

window.addEventListener('mousemove', function(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.48,
    ease: 'power3.out',
    overwrite: 'auto'
  })

  if (!cursorMoved) {
    cursorMoved = true
    if (cursorReady) revealCursor()
  }

  if (!cursorReady) return

  if (state.isPopupOpen) {
    const pw = popupProject.offsetWidth
    const ph = popupProject.offsetHeight
    const margin = 20
    const gap = 10
    const cw = 10

    const rawX = event.clientX > window.innerWidth / 2 ? event.clientX - cw - pw - gap : event.clientX + cw + gap
    const x = Math.min(Math.max(margin, rawX), window.innerWidth - pw - margin)
    const y = Math.min(Math.max(margin, event.clientY - ph / 2), window.innerHeight - ph - margin)

    gsap.to(popupProject, { x: x, y: y, duration: 0.50, ease: 'power2.out', overwrite: 'auto' })
  }
})

const hoverTargets = document.querySelectorAll('.nav__logo, .nav__links a, .nav__links button, .project__cta, .about__accordion, .about__link, .carousel')

hoverTargets.forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    gsap.to(cursor, { width: 10, height: 10, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
    gsap.to([barV, barH], { opacity: 0, duration: 0.1, ease: 'power2.out', overwrite: 'auto' })
  })
  el.addEventListener('mouseleave', function() {
    gsap.to(cursor, {
      width: cursor.classList.contains('is-open') ? 20 : 57,
      height: 20,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto'
    })
    gsap.to([barV, barH], { opacity: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
  })
})