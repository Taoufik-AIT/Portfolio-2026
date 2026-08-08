// ─── Cursor core — partagé entre index.html et 404.html ──────────────────────
// Fournit : cursor, barV, barH, cursorMoved, mouseX, mouseY
//           revealCursor(), initHoverTargets()

const cursor = document.querySelector('.cursor')
const barV   = document.querySelector('.cursor__bar--v')
const barH   = document.querySelector('.cursor__bar--h')

// Décale l'origine du curseur sur son propre centre (pas le coin haut-gauche),
// pour que x/y positionnent le centre visuel du curseur sur la souris
gsap.set(cursor, { xPercent: -50, yPercent: -50 })

let cursorMoved = false
let mouseX = 0
let mouseY = 0

window.addEventListener('mousemove', function(event) {
  mouseX      = event.clientX
  mouseY      = event.clientY
  cursorMoved = true
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.48, ease: 'power3.out', overwrite: 'auto' })
})

function revealCursor() {
  cursor.style.display = 'block'
  gsap.set(cursor, { x: mouseX, y: mouseY })
  gsap.fromTo(cursor,
    { clipPath: 'inset(50% 50% 50% 50%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out', clearProps: 'clipPath' }
  )
}

// getRestoreWidth optionnel — permet à cursor.js de tenir compte de is-open
function initHoverTargets(selector, opts) {
  const getRestoreWidth = (opts && opts.getRestoreWidth)
    ? opts.getRestoreWidth
    : function() { return 57 }

  document.querySelectorAll(selector).forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      gsap.to(cursor, { width: 10, height: 10, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
      gsap.to([barV, barH], { opacity: 0, duration: 0.1, ease: 'power2.out', overwrite: 'auto' })
    })
    el.addEventListener('mouseleave', function() {
      gsap.to(cursor, { width: getRestoreWidth(), height: 20, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
      gsap.to([barV, barH], { opacity: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
    })
  })
}
