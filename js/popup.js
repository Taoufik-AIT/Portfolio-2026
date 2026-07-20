gsap.registerPlugin(SplitText, ScrollTrigger)

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
gsap.set(popupAbout,   { display: 'none' })

if (window.lenis) window.lenis.on('scroll', ScrollTrigger.update)

// ─── About animation state ────────────────────────────────────────────────────

let aboutSplits   = []
let aboutTriggers = []
let aboutOpenTl   = null

function openAbout() {
  if (aboutOpenTl) { aboutOpenTl.kill(); aboutOpenTl = null }
  aboutSplits.forEach(function(s) { s.split.revert() })
  aboutSplits = []
  aboutTriggers.forEach(function(t) { t.kill() })
  aboutTriggers = []

  gsap.set(popupAbout, { display: 'block', clipPath: 'inset(100% 0 0 0)' })
  if (window.lenis) window.lenis.resize()

  const portrait = popupAbout.querySelector('.about__portrait')
  const caption  = popupAbout.querySelector('.about__portrait-caption')

  // Separators: outer (direct children of inner wrapper) + accordion-level
  const innerEl   = popupAbout.querySelector('.popup-about__inner')
  const outerSeps = Array.from(innerEl.children).filter(function(el) { return el.classList.contains('separator') })
  const allSeps   = Array.from(popupAbout.querySelectorAll('.separator'))

  // Sections (About me, My approach)
  const sections = Array.from(popupAbout.querySelectorAll('.about__section')).map(function(sec) {
    return {
      label:  sec.querySelector('.about__label'),
      number: sec.querySelector('.about__number'),
      slider: sec.querySelector('.approach__slider'),
      paras:  Array.from(sec.querySelectorAll('.about__text p'))
    }
  })

  // Accordion items
  const accordionEls  = Array.from(popupAbout.querySelectorAll('.accordion__item'))
  const accordionData = accordionEls.map(function(item) {
    const sib = item.nextElementSibling
    return {
      letter: item.querySelector('.accordion__letter'),
      title:  item.querySelector('.accordion__title'),
      icon:   item.querySelector('.accordion__icon'),
      sep:    sib && sib.classList.contains('separator') ? sib : null
    }
  })

  // ─── SplitText ─────────────────────────────────────────────────────────────

  function doSplit(el) {
    if (!el) return null
    const s = SplitText.create(el, { type: 'lines', mask: 'lines' })
    aboutSplits.push({ el: el, split: s })
    return s
  }

  const captionSplit = doSplit(caption)

  sections.forEach(function(sec) {
    sec.labelSplit  = doSplit(sec.label)
    sec.numberSplit = doSplit(sec.number)
    sec.parasSplits = sec.paras.map(function(p) { return doSplit(p) })
  })

  accordionData.forEach(function(item) {
    item.letterSplit = doSplit(item.letter)
    item.titleSplit  = doSplit(item.title)
  })

  // ─── Initial states ─────────────────────────────────────────────────────────

  if (portrait) gsap.set(portrait, { opacity: 0 })
  sections.forEach(function(sec) { if (sec.slider) gsap.set(sec.slider, { opacity: 0 }) })
  aboutSplits.forEach(function(s) { gsap.set(s.split.lines, { yPercent: 100 }) })
  gsap.set(allSeps, { scaleX: 0, transformOrigin: 'left center' })
  gsap.set(Array.from(popupAbout.querySelectorAll('.accordion__icon')), { opacity: 0 })

  ScrollTrigger.refresh()

  function inVP(el) { return el && el.getBoundingClientRect().top < window.innerHeight }

  let t = 1.0

  function animSep(sep) {
    if (!sep) return
    if (inVP(sep)) {
      aboutOpenTl.to(sep, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, t)
      t += 0.12
    } else {
      aboutTriggers.push(ScrollTrigger.create({
        trigger: sep, start: 'top 90%', once: true,
        onEnter: function() { gsap.to(sep, { scaleX: 1, duration: 0.5, ease: 'power2.out' }) }
      }))
    }
  }

  // ─── Timeline ───────────────────────────────────────────────────────────────

  aboutOpenTl = gsap.timeline()
  aboutOpenTl.to(popupAbout, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power3.inOut' })

  // Portrait — fondu
  if (portrait) {
    aboutOpenTl.to(portrait, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.35)
  }
  // Caption — avec le portrait, avant tout le reste
  if (captionSplit) {
    aboutOpenTl.to(captionSplit.lines, { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.5)
  }

  // Separator before About me
  animSep(outerSeps[0])

  // Sections (About me → My approach)
  sections.forEach(function(sec, si) {

    // Label + number : apparaissent ensemble
    const allLNLines = (sec.labelSplit  ? sec.labelSplit.lines  : [])
      .concat(sec.numberSplit ? sec.numberSplit.lines : [])
    if (allLNLines.length) {
      if (inVP(sec.label || sec.number)) {
        aboutOpenTl.to(allLNLines, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, t)
        if (sec.slider) aboutOpenTl.to(sec.slider, { opacity: 1, duration: 0.9, ease: 'power2.out' }, t)
        t += 0.15
      } else {
        const ref = sec.label || sec.number
        const slider = sec.slider
        aboutTriggers.push(ScrollTrigger.create({
          trigger: ref, start: 'top 90%', once: true,
          onEnter: function() {
            gsap.to(allLNLines, { yPercent: 0, duration: 1.0, ease: 'power3.out' })
            if (slider) gsap.to(slider, { opacity: 1, duration: 0.9, ease: 'power2.out' })
          }
        }))
      }
    }

    // Text paragraphs (About me uniquement) — toutes les lignes groupées
    const allParaLines = sec.parasSplits.flatMap(function(s) { return s.lines })
    if (allParaLines.length) {
      if (inVP(sec.paras[0])) {
        aboutOpenTl.to(allParaLines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, t)
        t += allParaLines.length * 0.08
      } else {
        aboutTriggers.push(ScrollTrigger.create({
          trigger: sec.paras[0], start: 'top 90%', once: true,
          onEnter: function() { gsap.to(allParaLines, { yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08 }) }
        }))
      }
    }

    // Separator entre les deux sections (pas après My approach)
    if (si === 0) animSep(outerSeps[1])
  })

  // Accordion — un seul ScrollTrigger pour tout le bloc
  const accordionSection = popupAbout.querySelector('.about__accordion')
  if (accordionSection) {
    if (inVP(accordionSection)) {
      accordionData.forEach(function(item, i) {
        const textLines = (item.letterSplit ? item.letterSplit.lines : [])
          .concat(item.titleSplit ? item.titleSplit.lines : [])
        const d = i * 0.15
        if (textLines.length) aboutOpenTl.to(textLines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: d }, t)
        if (item.icon)        aboutOpenTl.to(item.icon,  { opacity: 1, duration: 0.4, ease: 'power2.out', delay: d }, t)
        if (item.sep)         aboutOpenTl.to(item.sep,   { scaleX: 1, duration: 0.5, ease: 'power2.out', delay: d + 0.2 }, t)
      })
    } else {
      aboutTriggers.push(ScrollTrigger.create({
        trigger: accordionSection, start: 'top 92%', once: true,
        onEnter: function() {
          accordionData.forEach(function(item, i) {
            const textLines = (item.letterSplit ? item.letterSplit.lines : [])
              .concat(item.titleSplit ? item.titleSplit.lines : [])
            const d = i * 0.15
            if (textLines.length) gsap.to(textLines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: d })
            if (item.icon)        gsap.to(item.icon,  { opacity: 1, duration: 0.4, ease: 'power2.out', delay: d })
            if (item.sep)         gsap.to(item.sep,   { scaleX: 1, duration: 0.5, ease: 'power2.out', delay: d + 0.2 })
          })
        }
      }))
    }
  }

  // Separator after accordion
  animSep(outerSeps[2])
}

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
  state.isAboutOpen = false
  window.setCursorState(false)
  accordionItems.forEach(function(item) { item.removeAttribute('open') })
  if (aboutOpenTl) { aboutOpenTl.kill(); aboutOpenTl = null }
  aboutSplits.forEach(function(s) { s.split.revert() })
  aboutSplits = []
  aboutTriggers.forEach(function(t) { t.kill() })
  aboutTriggers = []
  gsap.killTweensOf(overlay)
  gsap.to(overlay, { opacity: 0, duration: 0.7, delay: 0.4, ease: 'power2.out', onComplete: () => overlay.classList.remove('is-open') })
  gsap.to(popupAbout, {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1,
    ease: 'power3.inOut',
    onComplete: function() {
      gsap.set(popupAbout, { display: 'none' })
      if (window.lenis) window.lenis.resize()
    }
  })
}

navAbout.addEventListener('click', event => {
  event.stopPropagation()
  if (state.isAboutOpen) { closeAbout(); return }
  state.isAboutOpen = true
  window.setCursorState(true)
  gsap.killTweensOf(overlay)
  overlay.classList.add('is-open')
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
  openAbout()
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
