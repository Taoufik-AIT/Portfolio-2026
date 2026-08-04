gsap.registerPlugin(SplitText, ScrollTrigger)

const popupProject = document.querySelector('.popup-project')
const popupAbout   = document.querySelector('.popup-about')
const overlay      = document.querySelector('.overlay')
const navAbout     = document.querySelector('.nav__about')

// Overlay (fond flou) — factorisé : ouverture (about, clic projet, bouton +)
// et fermeture (closePopup, closeAbout).
function openOverlay(duration) {
  gsap.killTweensOf(overlay)
  overlay.classList.add('is-open')
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: duration, ease: 'power2.out' })
}
function closeOverlay(duration) {
  gsap.killTweensOf(overlay)
  gsap.to(overlay, { opacity: 0, duration: duration, delay: 0.4, ease: 'power2.out', onComplete: () => overlay.classList.remove('is-open') })
}

// ─── Éléments ─────────────────────────────────────────────────────────────────

const cursorArrows = document.querySelectorAll('.cursor__arrow')

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
  if (window.startSlider) window.startSlider()
  if (isMobile && window.lenis) window.lenis.stop()
  gsap.killTweensOf(cursorArrows)
  gsap.set(cursorArrows, { opacity: 0 })
  gsap.to(cursorArrows, { opacity: 1, duration: 0.35, delay: 0.7, ease: 'power2.out' })

  if (aboutOpenTl) { aboutOpenTl.kill(); aboutOpenTl = null }
  aboutSplits.forEach(function(s) { s.split.revert() })
  aboutSplits = []
  aboutTriggers.forEach(function(t) { t.kill() })
  aboutTriggers = []

  gsap.set(popupAbout, { display: 'block', clipPath: 'inset(100% 0% 0% 0%)' })
  popupAbout.scrollTop = 0
  if (window.lenis) window.lenis.resize()

  // ─── SplitText (recréé à chaque ouverture) ─────────────────────────────────

  function doSplit(el) {
    if (!el) return null
    const s = SplitText.create(el, { type: 'lines', mask: 'lines' })
    aboutSplits.push({ el: el, split: s })
    return s
  }

  const captionSplit = doSplit(aboutCaption)

  aboutSections.forEach(function(sec) {
    sec.labelSplit  = doSplit(sec.label)
    sec.numberSplit = doSplit(sec.number)
    sec.parasSplits = sec.paras.map(function(p) { return doSplit(p) })
  })

  aboutAccordionData.forEach(function(item) {
    item.letterSplit = doSplit(item.letter)
    item.titleSplit  = doSplit(item.title)
  })

  const linksLabelSplit = doSplit(aboutLinksLabel)
  const linkSplits      = aboutLinkLabelEls.map(function(el) { return doSplit(el) })

  // ─── Initial states ─────────────────────────────────────────────────────────

  if (aboutPortrait) gsap.set(aboutPortrait, { opacity: 0 })
  aboutSections.forEach(function(sec) { if (sec.slider) gsap.set(sec.slider, { opacity: 0 }) })
  aboutSplits.forEach(function(s) { gsap.set(s.split.lines, { yPercent: 100 }) })
  gsap.set(aboutAllSeps, { scaleX: 0, transformOrigin: 'left center' })
  gsap.set(aboutAccordionIcons, { opacity: 0 })
  gsap.set(aboutLinkIconInners, { yPercent: 100 })

  ScrollTrigger.refresh()

  const aboutScroller = isMobile ? popupAbout : window

  function inVP(el) { return el && el.getBoundingClientRect().top < window.innerHeight }

  let t = 1.0

  function animSep(sep) {
    if (!sep) return
    if (inVP(sep)) {
      aboutOpenTl.to(sep, { scaleX: 1, duration: 0.9, ease: 'power2.out' }, t)
      t += 0.12
    } else {
      aboutTriggers.push(ScrollTrigger.create({
        trigger: sep, start: 'top 90%', once: true,
        scroller: aboutScroller,
        onEnter: function() { gsap.to(sep, { scaleX: 1, duration: 0.9, ease: 'power2.out' }) }
      }))
    }
  }

  // ─── Timeline ───────────────────────────────────────────────────────────────

  aboutOpenTl = gsap.timeline()
  aboutOpenTl.to(popupAbout, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' })

  if (aboutPortrait) {
    aboutOpenTl.to(aboutPortrait, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.35)
  }
  if (captionSplit) {
    aboutOpenTl.to(captionSplit.lines, { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.5)
  }

  animSep(aboutOuterSeps[0])

  aboutSections.forEach(function(sec, si) {

    const allLNLines = (sec.labelSplit  ? sec.labelSplit.lines  : [])
      .concat(sec.numberSplit ? sec.numberSplit.lines : [])
    if (allLNLines.length) {
      if (inVP(sec.label || sec.number)) {
        aboutOpenTl.to(allLNLines, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, t)
        if (sec.slider) aboutOpenTl.to(sec.slider, { opacity: 1, duration: 0.9, ease: 'power2.out' }, t)
        t += 0.15
      } else {
        const ref    = sec.label || sec.number
        const slider = sec.slider
        aboutTriggers.push(ScrollTrigger.create({
          trigger: ref, start: 'top 90%', once: true,
          scroller: aboutScroller,
          onEnter: function() {
            gsap.to(allLNLines, { yPercent: 0, duration: 1.0, ease: 'power3.out' })
            if (slider) gsap.to(slider, { opacity: 1, duration: 0.9, ease: 'power2.out' })
          }
        }))
      }
    }

    const allParaLines = sec.parasSplits.flatMap(function(s) { return s.lines })
    if (allParaLines.length) {
      if (inVP(sec.paras[0])) {
        aboutOpenTl.to(allParaLines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, t)
        t += allParaLines.length * 0.08
      } else {
        aboutTriggers.push(ScrollTrigger.create({
          trigger: sec.paras[0], start: 'top 90%', once: true,
          scroller: aboutScroller,
          onEnter: function() { gsap.to(allParaLines, { yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08 }) }
        }))
      }
    }

    if (si === 0) animSep(aboutOuterSeps[1])
  })

  if (aboutAccordionSection) {
    if (inVP(aboutAccordionSection)) {
      aboutAccordionData.forEach(function(item, i) {
        const textLines = (item.letterSplit ? item.letterSplit.lines : [])
          .concat(item.titleSplit ? item.titleSplit.lines : [])
        const d = i * 0.15
        if (textLines.length) aboutOpenTl.to(textLines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: d }, t)
        if (item.icon)        aboutOpenTl.to(item.icon,  { opacity: 1, duration: 0.4, ease: 'power2.out', delay: d }, t)
        if (item.sep)         aboutOpenTl.to(item.sep,   { scaleX: 1, duration: 0.9, ease: 'power2.out', delay: d + 0.2 }, t)
      })
    } else {
      aboutTriggers.push(ScrollTrigger.create({
        trigger: aboutAccordionSection, start: 'top 92%', once: true,
        scroller: aboutScroller,
        onEnter: function() {
          aboutAccordionData.forEach(function(item, i) {
            const textLines = (item.letterSplit ? item.letterSplit.lines : [])
              .concat(item.titleSplit ? item.titleSplit.lines : [])
            const d = i * 0.15
            if (textLines.length) gsap.to(textLines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: d })
            if (item.icon)        gsap.to(item.icon,  { opacity: 1, duration: 0.4, ease: 'power2.out', delay: d })
            if (item.sep)         gsap.to(item.sep,   { scaleX: 1, duration: 0.9, ease: 'power2.out', delay: d + 0.2 })
          })
        }
      }))
    }
  }

  animSep(aboutOuterSeps[2])

  if (aboutLinksSection) {
    if (inVP(aboutLinksSection)) {
      if (linksLabelSplit) aboutOpenTl.to(linksLabelSplit.lines, { yPercent: 0, duration: 0.8, ease: 'power3.out' }, t)
      linkSplits.forEach(function(split, i) {
        const lines = split ? split.lines : []
        const icon  = aboutLinkIconInners[i]
        const pos   = t + i * 0.12
        if (lines.length) aboutOpenTl.to(lines, { yPercent: 0, duration: 0.7, ease: 'power3.out' }, pos)
        if (icon) aboutOpenTl.to(icon, { yPercent: 0, duration: 0.6, ease: 'power2.out' }, pos)
      })
    } else {
      aboutTriggers.push(ScrollTrigger.create({
        trigger: aboutLinksSection, start: 'top 90%', once: true,
        scroller: aboutScroller,
        onEnter: function() {
          if (linksLabelSplit) gsap.to(linksLabelSplit.lines, { yPercent: 0, duration: 0.8, ease: 'power3.out' })
          linkSplits.forEach(function(split, i) {
            const lines = split ? split.lines : []
            const icon  = aboutLinkIconInners[i]
            const delay = i * 0.12
            if (lines.length) gsap.to(lines, { yPercent: 0, duration: 0.7, ease: 'power3.out', delay: delay })
            if (icon) gsap.to(icon, { yPercent: 0, duration: 0.6, ease: 'power2.out', delay: delay })
          })
        }
      }))
    }
  }
}

// Overflow hidden sur dt et dd (une seule fois à l'init)
popupProject.querySelectorAll('dt, dd').forEach(el => {
  const wrapper = document.createElement('div')
  wrapper.style.overflow = 'hidden'
  el.parentNode.insertBefore(wrapper, el)
  wrapper.appendChild(el)
})


let splitInstances    = []
let openTl            = null
let cursorResetCall   = null

// ─── Open / Close ─────────────────────────────────────────────────────────────

function openPopup(clientX, clientY) {
  if (cursorResetCall) { cursorResetCall.kill(); cursorResetCall = null }
  if (openTl) { openTl.kill(); openTl = null }
  gsap.killTweensOf(popupProject)

  splitInstances.forEach(s => s.revert())
  splitInstances = []

  gsap.set(popupProject,     { display: 'block', clipPath: 'inset(100% 0% 0% 0%)' })
  gsap.set(separators, { scaleX: 0 })
  gsap.set(dts,        { y: '105%' })
  gsap.set(dds,        { y: '105%' })

  if (isMobile) {
    gsap.set(popupProject, { x: 0, y: 0 })
  } else {
    const pw     = popupProject.offsetWidth
    const ph     = popupProject.offsetHeight
    const cw     = 10
    const margin = 20
    const gap    = 10
    const rawX   = clientX > window.innerWidth / 2 ? clientX - cw - pw - gap : clientX + cw + gap
    const x      = Math.min(Math.max(margin, rawX), window.innerWidth - pw - margin)
    const y      = Math.min(Math.max(margin, clientY - ph / 2), window.innerHeight - ph - margin)
    gsap.set(popupProject, { x: x, y: y })
  }

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
  openTl.to(popupProject, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' })
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
  if (cursorResetCall) { cursorResetCall.kill(); cursorResetCall = null }
  if (openTl) { openTl.kill(); openTl = null }
  gsap.killTweensOf(popupProject)

  cursorResetCall = gsap.delayedCall(0.5, function() {
    cursorResetCall = null
    window.setCursorState(false)
  })

  closeOverlay(0.7)

  gsap.to(popupProject, {
    clipPath: 'inset(0% 0% 100% 0%)',
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
  if (window.stopSlider) window.stopSlider()
  if (window.lenis) window.lenis.start()   // toujours restaurer Lenis (le mode a pu changer depuis l'ouverture)
  gsap.killTweensOf(cursorArrows)
  gsap.to(cursorArrows, { opacity: 0, duration: 0.2, ease: 'power2.out' })

  state.isAboutOpen = false
  navAbout.classList.remove('is-open')
  window.setCursorState(false)
  accordionItems.forEach(function(item) { item.removeAttribute('open') })
  if (aboutOpenTl) { aboutOpenTl.kill(); aboutOpenTl = null }
  aboutTriggers.forEach(function(t) { t.kill() })
  aboutTriggers = []
  closeOverlay(1.4)
  gsap.to(popupAbout, {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 1,
    ease: 'power3.inOut',
    onComplete: function() {
      if (state.isAboutOpen) return   // rouvert pendant la fermeture : openAbout a déjà tout géré
      aboutSplits.forEach(function(s) { s.split.revert() })
      aboutSplits = []
      gsap.set(popupAbout, { display: 'none' })
      if (window.lenis) window.lenis.resize()
    }
  })
}

navAbout.addEventListener('click', event => {
  event.stopPropagation()
  if (state.isLoading) return
  if (state.isAboutOpen) { closeAbout(); return }
  state.isAboutOpen = true
  navAbout.classList.add('is-open')
  window.setCursorState(true)
  openOverlay(1.2)
  openAbout()
})

// ─── Accordion ────────────────────────────────────────────────────────────────

const accordionItems = Array.from(popupAbout.querySelectorAll('.accordion__item'))

// ─── Link reveal structure (once at init) ─────────────────────────────────────

Array.from(popupAbout.querySelectorAll('.about__link')).forEach(function(link) {
  const svg  = link.querySelector('svg')
  const text = Array.from(link.childNodes)
    .filter(function(n) { return n.nodeType === Node.TEXT_NODE && n.textContent.trim() })
    .map(function(n) { return n.textContent.trim() })
    .join('')

  const labelOuter = document.createElement('span')
  labelOuter.className = 'about__link-label'
  labelOuter.style.cssText = 'display:block;'
  labelOuter.textContent = text

  const iconOuter = document.createElement('span')
  iconOuter.className = 'about__link-icon'
  iconOuter.style.cssText = 'overflow:hidden;display:flex;align-items:center;'
  const iconInner = document.createElement('span')

  while (link.firstChild) link.removeChild(link.firstChild)
  link.appendChild(labelOuter)
  link.appendChild(iconOuter)
  iconOuter.appendChild(iconInner)
  iconInner.appendChild(svg)
})

// ─── About DOM cache (références statiques, calculées une fois) ───────────────

const aboutPortrait      = popupAbout.querySelector('.about__portrait')
const aboutCaption       = popupAbout.querySelector('.about__portrait-caption')
const aboutOuterSeps     = Array.from(
  popupAbout.querySelector('.popup-about__inner').children
).filter(function(el) { return el.classList.contains('separator') })
const aboutAllSeps       = Array.from(popupAbout.querySelectorAll('.separator'))
const aboutSections      = Array.from(popupAbout.querySelectorAll('.about__section')).map(function(sec) {
  return {
    label:  sec.querySelector('.about__label'),
    number: sec.querySelector('.about__number'),
    slider: sec.querySelector('.approach__slider'),
    paras:  Array.from(sec.querySelectorAll('.about__text p'))
  }
})
const aboutLinksLabel    = popupAbout.querySelector('.about__links-label')
const aboutLinkLabelEls  = Array.from(popupAbout.querySelectorAll('.about__link-label'))
const aboutLinkIconInners = Array.from(popupAbout.querySelectorAll('.about__link-icon > span'))
const aboutAccordionData = accordionItems.map(function(item) {
  const sib = item.nextElementSibling
  return {
    letter: item.querySelector('.accordion__letter'),
    title:  item.querySelector('.accordion__title'),
    icon:   item.querySelector('.accordion__icon'),
    sep:    sib && sib.classList.contains('separator') ? sib : null
  }
})
const aboutAccordionIcons   = aboutAccordionData.map(function(item) { return item.icon }).filter(Boolean)
const aboutAccordionSection = popupAbout.querySelector('.about__accordion')
const aboutLinksSection     = popupAbout.querySelector('.about__links')

// ─── CTA Dropdown ─────────────────────────────────────────────────────────────

const ctaWrapper  = document.querySelector('.nav__chat-wrapper')
const ctaDropdown = document.querySelector('.nav__dropdown')
const ctaLinks    = Array.from(ctaDropdown.querySelectorAll('.nav__dropdown-link'))
const ctaSep      = ctaDropdown.querySelector('.nav__dropdown-separator')

gsap.set(ctaDropdown, { display: 'none' })
if (ctaSep) gsap.set(ctaSep, { scaleX: 0, transformOrigin: 'left center' })

let dropdownTl     = null
let dropdownSplits = []
let dropdownOpen   = false

function openDropdown() {
  if (dropdownOpen) return
  dropdownOpen = true
  if (dropdownTl) { dropdownTl.kill(); dropdownTl = null }
  dropdownSplits.forEach(function(s) { s.revert() })
  dropdownSplits = []

  gsap.set(ctaDropdown, { display: 'flex', clipPath: 'inset(0% 0% 100% 0%)' })
  if (ctaSep) gsap.set(ctaSep, { scaleX: 0 })

  const linkSplits = ctaLinks.map(function(link) {
    const s = SplitText.create(link, { type: 'lines', mask: 'lines' })
    dropdownSplits.push(s)
    gsap.set(s.lines, { yPercent: 100 })
    return s
  })

  dropdownTl = gsap.timeline()
    .to(ctaDropdown, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.70, ease: 'power2.out' })

  if (linkSplits[0]) dropdownTl.to(linkSplits[0].lines, { yPercent: 0, duration: 0.35, ease: 'power3.out' }, '-=0.55')
  if (ctaSep)        dropdownTl.to(ctaSep, { scaleX: 1, duration: 0.25, ease: 'power2.out' }, '<0.06')
  if (linkSplits[1]) dropdownTl.to(linkSplits[1].lines, { yPercent: 0, duration: 0.35, ease: 'power3.out' }, '<0.06')
}

function closeDropdown() {
  if (!dropdownOpen) return
  dropdownOpen = false
  if (dropdownTl) { dropdownTl.kill(); dropdownTl = null }

  dropdownTl = gsap.to(ctaDropdown, {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 0.35,
    ease: 'power2.in',
    onComplete: function() {
      dropdownTl = null
      gsap.set(ctaDropdown, { display: 'none' })
      dropdownSplits.forEach(function(s) { s.revert() })
      dropdownSplits = []
    }
  })
}

ctaWrapper.addEventListener('mouseenter', openDropdown)
ctaWrapper.addEventListener('mouseleave', closeDropdown)

// ─── Clicks globaux ───────────────────────────────────────────────────────────

document.addEventListener('click', event => {
  if (state.isLoading) return

  if (state.isAboutOpen) {
    if (isMobile) {
      if (event.target.closest('.about__close')) { closeAbout(); return }
      return
    }
    if (event.target.closest('a, summary, button, .accordion__content, .separator')) return
    closeAbout()
    return
  }

  if (state.isPopupOpen) {
    if (event.target.closest('.overlay') || event.target.closest('.popup-project__close')) {
      closePopup()
      state.isPopupOpen = false
    }
    return
  }

  if (event.target.closest('.nav__logo, .carousel, .project__cta, .nav__about, .nav__chat-wrapper, .project-open-btn')) return
  if (isMobile) return

  state.isPopupOpen = true
  openOverlay(0.5)
  window.setCursorState(true)

  openPopup(event.clientX, event.clientY)
})

const projectOpenBtn = document.querySelector('.project-open-btn')
if (projectOpenBtn) {
  projectOpenBtn.addEventListener('click', function(event) {
    event.stopPropagation()
    if (state.isLoading || state.isPopupOpen) return
    state.isPopupOpen = true
    openOverlay(0.5)
    window.setCursorState(true)
    openPopup(0, 0)
  })
}
