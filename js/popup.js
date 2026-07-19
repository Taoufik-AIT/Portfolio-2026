gsap.registerPlugin(SplitText)

const popupProject = document.querySelector('.popup-project')
const popupAbout   = document.querySelector('.popup-about')
const overlay      = document.querySelector('.overlay')
const navAbout     = document.querySelector('.nav__about')

// ─── Éléments ─────────────────────────────────────────────────────────────────

const popupTitle = popupProject.querySelector('.popup__title')
const popupDescs = Array.from(popupProject.querySelectorAll('.popup__description'))
const separators = Array.from(popupProject.querySelectorAll('.popup__separator'))
const dts        = Array.from(popupProject.querySelectorAll('dt'))
const dds        = Array.from(popupProject.querySelectorAll('dd'))

gsap.set(popupProject, { display: 'none' })

// Overflow hidden sur dt et dd (une seule fois à l'init)
popupProject.querySelectorAll('dt, dd').forEach(el => {
  const wrapper = document.createElement('div')
  wrapper.style.overflow = 'hidden'
  el.parentNode.insertBefore(wrapper, el)
  wrapper.appendChild(el)
})


let splitInstances = []
let openTl = null

// ─── Open / Close ─────────────────────────────────────────────────────────────

function openPopup(clientX, clientY) {
  if (openTl) { openTl.kill(); openTl = null }
  gsap.killTweensOf(popupProject)

  splitInstances.forEach(s => s.revert())
  splitInstances = []

  gsap.set(popupProject,     { display: 'block', clipPath: 'inset(100% 0 0 0)' })
  gsap.set(separators, { scaleX: 0 })
  gsap.set(dts,        { y: '105%' })
  gsap.set(dds,        { y: '105%' })

  const pw     = popupProject.offsetWidth
  const ph     = popupProject.offsetHeight
  const cw     = 10
  const margin = 20
  const gap    = 10
  const rawX   = clientX > window.innerWidth / 2 ? clientX - cw - pw - gap : clientX + cw + gap
  const x      = Math.min(Math.max(margin, rawX), window.innerWidth - pw - margin)
  const y      = Math.min(Math.max(margin, clientY - ph / 2), window.innerHeight - ph - margin)
  gsap.set(popupProject, { x: x, y: y })

  // SplitText — onSplit collecte toutes les lignes (titre + 2 paragraphes)
  const allLines = []
  ;[popupTitle, ...popupDescs].forEach(el => {
    const instance = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      onSplit(self) {
        allLines.push(...self.lines)
      }
    })
    splitInstances.push(instance)
  })

  openTl = gsap.timeline()
  openTl.to(popupProject, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.inOut' })
  openTl.fromTo(allLines,
    { yPercent: 100 },
    { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 },
    '-=0.3'
  )

  // Cascade : sep → dt+dd → sep → dt+dd...
  separators.forEach((sep, i) => {
    openTl.to(sep,               { scaleX: 1, duration: 0.4, ease: 'power1.out' }, i === 0 ? '<' : '<0.12')
    if (dts[i]) {
      openTl.to([dts[i], dds[i]], { y: 0,      duration: 0.4, ease: 'power1.out' }, '<0.12')
    }
  })
}

function closePopup() {
  if (openTl) { openTl.kill(); openTl = null }
  gsap.killTweensOf(popupProject)

  gsap.delayedCall(0.5, () => window.setCursorState(false))

  gsap.killTweensOf(overlay)
  gsap.to(overlay, { opacity: 0, duration: 0.7, delay: 0.4, ease: 'power2.out', onComplete: () => overlay.classList.remove('is-open') })

  gsap.to(popupProject, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 1,
    ease: 'power3.inOut',
    onComplete() {
      splitInstances.forEach(s => s.revert())
      splitInstances = []
      gsap.set(popupProject, { display: 'none' })
    }
  })
}

// ─── About ────────────────────────────────────────────────────────────────────

function closeAbout() {
  popupAbout.classList.remove('is-open')
  gsap.killTweensOf(overlay)
  gsap.to(overlay, { opacity: 0, duration: 0.7, delay: 0.4, ease: 'power2.out', onComplete: () => overlay.classList.remove('is-open') })
  state.isAboutOpen = false
  accordionItems.forEach(function(item) { item.removeAttribute('open') })
  window.setCursorState(false)
}

navAbout.addEventListener('click', event => {
  event.stopPropagation()
  const isOpen = popupAbout.classList.toggle('is-open')
  state.isAboutOpen = isOpen
  window.setCursorState(isOpen)
  if (isOpen) {
    gsap.killTweensOf(overlay)
    overlay.classList.add('is-open')
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
  } else {
    gsap.killTweensOf(overlay)
    gsap.to(overlay, { opacity: 0, duration: 0.7, delay: 0.2, ease: 'power2.out', onComplete: () => overlay.classList.remove('is-open') })
  }
})

// ─── Accordion ────────────────────────────────────────────────────────────────

const accordionItems = Array.from(popupAbout.querySelectorAll('.accordion__item'))

// ─── Clicks globaux ───────────────────────────────────────────────────────────

document.addEventListener('click', event => {

  if (state.isAboutOpen) {
    if (event.target.closest('.about__close')) { closeAbout(); return }
    if (event.target.closest('a, summary, button, .accordion__content, .separator')) return
    closeAbout()
    return
  }

  if (state.isPopupOpen) {
    closePopup()
    state.isPopupOpen = false
    return
  }

  if (event.target.closest('.nav__logo, .carousel, .project__cta, .nav__about, .nav__chat-wrapper')) return

  state.isPopupOpen = true
  gsap.killTweensOf(overlay)
  overlay.classList.add('is-open')
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
  window.setCursorState(true)

  openPopup(event.clientX, event.clientY)
})
