window.lenis = new Lenis({ autoRaf: true })
const popupInner = document.querySelector('.popup-about__inner')
const ro = new ResizeObserver(() => { window.lenis.resize() })
ro.observe(popupInner)

// ─── Projets ──────────────────────────────────────────────────────────────────

const projects = [
  {
    name: 'Get Your Way',
    url: 'https://getyourway.be',
    year: 2024,
    type: 'Design & Development',
    client: 'Get Your Way',
    sector: 'Tech',
    role: 'Product Designer',
    scope: 'UX / UI / Frontend',
    description1: 'I designed and developed a modern e-commerce experience focused on making product discovery and purchasing simple, fast, and visually engaging. The goal was to create a digital storefront where users can easily explore products, understand their value, and complete purchases with minimal friction.',
    description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
  },
  
  {
    name: 'Adel&Adele',
    url: 'https://adel-adele.fr',
    year: 2025,
    type: 'Design',
    client: 'Adel & Adele',
    sector: 'Tech',
    role: 'frontend dev & motion',
    scope: 'UX / UI / Frontend',
    description1: 'I designed and developed a modern e-commerce experience focused on making product discovery and purchasing simple, fast, and visually engaging. The goal was to create a digital storefront where users can easily explore products, understand their value, and complete purchases with minimal friction.',
    description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
  },
  {
    name: 'Dimagin-Studio',
    url: 'https://dimagin-studio.fr',
    year: 2023,
    type: 'Design & Development',
    client: 'Dimagin-Studio',
    sector: 'Tech',
    role: 'web engineer & motion',
    scope: 'UX / UI / Frontend',
    description1: 'I designed and developed a modern e-commerce experience focused on making product discovery and purchasing simple, fast, and visually engaging. The goal was to create a digital storefront where users can easily explore products, understand their value, and complete purchases with minimal friction.',
    description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
  },
  {
    name: 'Studio Fictif',
    url: 'https://studiofictif.fr',
    year: 2026,
    type: 'Branding & Motion',
    client: 'Studio Fictif',
    sector: 'Creative',
    role: 'Art Director',
    scope: 'Motion / Web',
    description1: 'A fictitious creative studio project exploring brand identity and motion design. The goal was to build a cohesive visual language that spans digital and print, with a strong typographic system and animated brand elements.',
    description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
  },
]

const state = {
  activeIndex: 0,
  isPopupOpen: false,
  isAboutOpen: false,
  isLoading: true,
}

let prevActiveProject = null

// ─── DOM ──────────────────────────────────────────────────────────────────────

const projectName         = document.querySelector('.project__name')
const projectType         = document.querySelector('.project__type')
const projectYear         = document.querySelector('.project__year')
const projectClient       = document.querySelector('.popup__client')
const projectSector       = document.querySelector('.popup__sector')
const projectRole         = document.querySelector('.popup__role')
const projectScope        = document.querySelector('.popup__scope')
const popupYear           = document.querySelector('.popup__year')
const projectDescription1 = document.querySelector('.popup__description:first-of-type')
const projectDescription2 = document.querySelector('.popup__description:last-of-type')
const previewImgs  = Array.from(document.querySelectorAll('.preview__img'))
let   activeImgIdx       = 0
let   transitionToken    = 0
let   clipTransitionLock = false
const projectCta      = document.querySelector('.project__cta')

gsap.set(previewImgs[0], { zIndex: 1 })
gsap.set(previewImgs[1], { zIndex: 0 })



;[projectName, projectType, projectYear].forEach(function(el) {
  const w = document.createElement('div')
  w.style.overflow = 'hidden'
  el.parentNode.insertBefore(w, el)
  w.appendChild(el)
})

const mqMobile       = window.matchMedia('(max-width: 430px)')
let   isMobile       = mqMobile.matches
let   lerpFactor     = isMobile ? 0.15 : 0.04

// Flag scopé au curseur mouse-follow + déclenchement du popup projet — distinct
// de isMobile (qui pilote Lenis/ScrollTrigger et ne doit pas être élargi).
function isCursorTouch() {
  return window.matchMedia('(max-width: 1024px)').matches
}

// Vrai quand .popup-about est en layout plein-écran à scroll interne
// (mobile + tablette) plutôt qu'en position absolute suivant le scroll de la page.
function isAboutInternalScroll() {
  return window.matchMedia('(max-width: 1024px) and (orientation: portrait)').matches
}

mqMobile.addEventListener('change', function(e) {
  isMobile   = e.matches
  lerpFactor = isMobile ? 0.15 : 0.04
  // About ouvert au moment du basculement : l'état Lenis doit suivre le layout
  // (mobile = scroll interne → Lenis stoppé ; desktop = scroll de page → Lenis actif).
  if (state.isAboutOpen && window.lenis) {
    if (isMobile) window.lenis.stop()
    else { window.lenis.start(); window.lenis.resize() }
  }
})
let scrollDir        = 1
let projectInfoReady = false

function updateProjectInfo() {
  const p = projects[state.activeIndex]

  projectClient.textContent       = p.client
  projectSector.textContent       = p.sector
  projectRole.textContent         = p.role
  projectScope.textContent        = p.scope
  popupYear.textContent           = p.year
  projectDescription1.textContent = p.description1
  projectDescription2.textContent = p.description2
  projectCta.href                 = p.url

  if (!projectInfoReady) {
    projectName.textContent = p.name
    projectType.textContent = p.type
    projectYear.textContent = p.year
    projectInfoReady = true
    requestAnimationFrame(function() { projectType.classList.add('sep-visible') })
    return
  }

  const outY = scrollDir === 1 ? '-105%' : '105%'
  const inY  = scrollDir === 1 ?  '105%' : '-105%'

  projectType.classList.remove('sep-visible')
  gsap.killTweensOf([projectName, projectType, projectYear])
  gsap.timeline()
    .to([projectName, projectType, projectYear], { y: outY, duration: 0.28, ease: 'power2.in' })
    .call(function() {
      projectName.textContent = p.name
      projectType.textContent = p.type
      projectYear.textContent = p.year
    })
    .set([projectName, projectType, projectYear], { y: inY })
    .to([projectName, projectType, projectYear], { y: 0, duration: 0.38, ease: 'power2.out', stagger: 0.06 })
    .call(function() { projectType.classList.add('sep-visible') })
}

updateProjectInfo()

// ─── Carousel infini ──────────────────────────────────────────────────────────

const carouselEl    = document.querySelector('.carousel')
const carouselTrack = document.querySelector('.carousel__track')

// Cloner le contenu 3× pour le loop infini
const originalHTML = carouselTrack.innerHTML
carouselTrack.innerHTML = originalHTML + originalHTML + originalHTML

// Séparateurs réels — remplacent les ::after pour que GSAP puisse les animer
document.querySelectorAll('.carousel__group').forEach(function(group) {
  const sep = document.createElement('div')
  sep.className = 'carousel__separator'
  group.after(sep)
})

const allImgs     = Array.from(document.querySelectorAll('.carousel__img'))
const imgsPerCopy = allImgs.length / 3

const imgProjectMap = new Map()
allImgs.forEach(function(img) {
  const group = img.closest('.carousel__group')
  imgProjectMap.set(img, parseInt(group.dataset.project || 0))
})

// Centres naturels avant tout transform
const natCenters = allImgs.map(function(img) {
  const r = img.getBoundingClientRect()
  return r.left + r.width / 2
})


let needleX        = window.innerWidth / 2
const copyWidth    = natCenters[imgsPerCopy] - natCenters[0]
const TICK_SPACING = 5.5

// Seuils de boucle : milieu du gap entre la dernière image d'une copie
// et la première de la suivante. Téléporter depuis midLeft → on atterrit
// exactement à midRight (et vice-versa) → pas d'oscillation possible.
const midRight = (natCenters[imgsPerCopy - 1]     + natCenters[imgsPerCopy])     / 2
const midLeft  = (natCenters[2 * imgsPerCopy - 1] + natCenters[2 * imgsPerCopy]) / 2

let targetX  = needleX - Math.round(natCenters[imgsPerCopy] / TICK_SPACING) * TICK_SPACING
let currentX = targetX
let lastImgIdx = -1

gsap.set(carouselTrack, { x: currentX })
gsap.set(allImgs, { filter: 'brightness(0.4)' })
syncCarousel()
updateImageContrast(state.activeIndex)

function loopCheck() {
  while (needleX - currentX > midLeft) {
    currentX      += copyWidth
    targetX       += copyWidth
    if (carouselDragging) carouselStartX += copyWidth
  }
  while (needleX - currentX < midRight) {
    currentX      -= copyWidth
    targetX       -= copyWidth
    if (carouselDragging) carouselStartX -= copyWidth
  }
}

// Ticker GSAP : lerp fluide + correction de boucle + rendu
gsap.ticker.lagSmoothing(0)

gsap.ticker.add(function() {
  const prevX = currentX
  currentX += (targetX - currentX) * lerpFactor
  const lerpDelta = currentX - prevX
  loopCheck()

  if (Math.abs(lerpDelta) > 0.01) {
    scrollDir = lerpDelta < 0 ? 1 : -1
    gsap.set(carouselTrack, { x: currentX })
    if (!state.isPopupOpen && !state.isAboutOpen) syncCarousel()
    moveTicks()
  }
})

function decodeOrLoad(img) {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve()
  if (typeof img.decode === 'function') return img.decode()
  return new Promise(function(resolve) {
    img.onload  = resolve
    img.onerror = resolve
  })
}

function syncCarousel() {
  if (clipTransitionLock) return

  const target = needleX - currentX
  let best = 0, bestDist = Infinity

  for (let i = imgsPerCopy; i < 2 * imgsPerCopy; i++) {
    const dist = Math.abs(natCenters[i] - target)
    if (dist < bestDist) { bestDist = dist; best = i - imgsPerCopy }
  }

  if (best === lastImgIdx) return
  lastImgIdx = best

  const pIndex = imgProjectMap.get(allImgs[best])

  if (pIndex !== state.activeIndex) {
    const nextIdx   = 1 - activeImgIdx
    const nextImg   = previewImgs[nextIdx]
    const currImg   = previewImgs[activeImgIdx]
    const clipStart = scrollDir === 1 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'
    const xStart    = scrollDir === 1 ? 25 : -25

    transitionToken++
    const myToken = transitionToken
    clipTransitionLock = true
    let lockTimer = setTimeout(function() { lockTimer = null; clipTransitionLock = false }, 1200)

    gsap.killTweensOf([nextImg, currImg])
    nextImg.src = allImgs[best].src
    gsap.set(nextImg, { zIndex: 2, opacity: 1, scale: 1, x: xStart, clipPath: clipStart })
    gsap.set(currImg, { zIndex: 1, opacity: 1, scale: 1, x: 0,      clipPath: 'inset(0% 0% 0% 0%)' })

    activeImgIdx      = nextIdx
    state.activeIndex = pIndex
    updateProjectInfo()
    updateImageContrast(pIndex)

    function reveal() {
      if (myToken !== transitionToken) {
        if (lockTimer) { clearTimeout(lockTimer); lockTimer = null }
        clipTransitionLock = false
        return
      }
      const xCurrEnd = scrollDir === 1 ? -20 : 20
      gsap.to(nextImg, {
        clipPath: 'inset(0% 0% 0% 0%)',
        x: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: function() {
          if (lockTimer) { clearTimeout(lockTimer); lockTimer = null }
          clipTransitionLock = false
          syncCarousel()
        }
      })
      gsap.to(currImg, { x: xCurrEnd, duration: 0.5, ease: 'power2.out' })
    }
    decodeOrLoad(nextImg).then(reveal, reveal)

  } else {
    const nextIdx = 1 - activeImgIdx
    const nextImg = previewImgs[nextIdx]
    const currImg = previewImgs[activeImgIdx]

    transitionToken++
    const myToken = transitionToken

    gsap.killTweensOf([nextImg, currImg])
    gsap.set(nextImg, { zIndex: 2, scale: 1.1, opacity: 0, x: 0, clipPath: 'inset(0% 0% 0% 0%)' })
    gsap.set(currImg, { zIndex: 1, scale: 1,   opacity: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)' })

    nextImg.src  = allImgs[best].src

    function revealSame() {
      if (myToken !== transitionToken) return
      activeImgIdx = nextIdx
      gsap.timeline()
        .to(nextImg, { scale: 1,    opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .to(currImg, { scale: 1.04,             duration: 0.9, ease: 'power2.out' }, 0)
        .to(currImg, { opacity: 0,              duration: 0.5, ease: 'power2.in', delay: 0.3 }, 0)
    }
    decodeOrLoad(nextImg).then(revealSame, revealSame)
  }
}

function updateImageContrast(activeProject) {
  if (activeProject === prevActiveProject) return

  allImgs.forEach(function(img) {
    const imgProject    = imgProjectMap.get(img)
    const shouldBeActive = imgProject === activeProject
    const wasActive      = imgProject === prevActiveProject
    if (shouldBeActive === wasActive) return
    gsap.to(img, {
      filter: shouldBeActive ? 'brightness(1)' : 'brightness(0.4)',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  })

  prevActiveProject = activeProject
}

// ─── Wheel ────────────────────────────────────────────────────────────────────

window.addEventListener('wheel', function(event) {
  if (event.ctrlKey) event.preventDefault()
}, { passive: false })

document.addEventListener('gesturestart', function(event) {
  event.preventDefault()
})

window.addEventListener('wheel', function(event) {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) event.preventDefault()
  if (state.isLoading || state.isPopupOpen || state.isAboutOpen) return
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  targetX -= delta * 1.8
}, { passive: false })

// ─── Drag carousel ────────────────────────────────────────────────────────────

let carouselDragging   = false
let carouselDragStart  = 0
let carouselDragStartY = 0
let carouselStartX     = 0
let carouselMoved      = false

carouselEl.addEventListener('mousedown', function(event) {
  if (state.isLoading) return
  targetX           = currentX
  carouselDragging  = true
  carouselMoved     = false
  carouselDragStart = event.clientX
  carouselStartX    = currentX
})

window.addEventListener('mousemove', function(event) {
  if (!carouselDragging) return
  const delta = event.clientX - carouselDragStart
  if (Math.abs(delta) > 3) carouselMoved = true
  targetX = carouselStartX + delta
})

window.addEventListener('mouseup', function() {
  if (!carouselDragging) return
  carouselDragging = false
})

let pullStartY = 0

document.addEventListener('touchstart', function(event) {
  pullStartY = event.touches[0].clientY
  if (event.target.closest('.popup-about')) return
  if (event.target.closest('.cursor')) return
  if (event.target.closest('.popup-project__close')) return
  if (state.isLoading) return
  targetX            = currentX
  carouselDragging   = true
  carouselMoved      = false
  carouselDragStart  = event.touches[0].clientX
  carouselDragStartY = event.touches[0].clientY
  carouselStartX     = currentX
}, { passive: true })

document.addEventListener('touchmove', function(event) {
  if (state.isAboutOpen) return
  if (window.scrollY === 0 && event.touches[0].clientY > pullStartY) event.preventDefault()
}, { passive: false })

window.addEventListener('touchmove', function(event) {
  if (!carouselDragging) return
  if (state.isPopupOpen || state.isAboutOpen) return
  event.preventDefault()
  const dx    = event.touches[0].clientX - carouselDragStart
  const dy    = event.touches[0].clientY - carouselDragStartY
  const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy
  if (Math.abs(delta) > 3) carouselMoved = true
  targetX = carouselStartX + delta
}, { passive: false })

window.addEventListener('touchend', function() {
  if (!carouselDragging) return
  carouselDragging = false
})

window.addEventListener('touchcancel', function() {
  carouselDragging = false
})

// ─── Clic image → centrer sous l'aiguille ────────────────────────────────────

allImgs.forEach(function(img, i) {
  img.addEventListener('click', function() {
    if (carouselMoved) return

    const localIdx = i % imgsPerCopy

    // Les 3 copies du même item
    const candidates = [
      needleX - natCenters[localIdx],                        // copie 1
      needleX - natCenters[imgsPerCopy + localIdx],          // copie 2
      needleX - natCenters[2 * imgsPerCopy + localIdx],      // copie 3
    ]

    // Choisir le targetX le plus proche de currentX
    let best = candidates[0]
    let bestDist = Math.abs(candidates[0] - currentX)

    for (let c = 1; c < candidates.length; c++) {
      const dist = Math.abs(candidates[c] - currentX)
      if (dist < bestDist) {
        bestDist = dist
        best = candidates[c]
      }
    }

    targetX = best
  })
})


// ─── Ticks du ruler ───────────────────────────────────────────────────────────

const line       = document.querySelector('.carousel__line')
const TICK_COUNT = Math.ceil((window.innerWidth - (needleX - midLeft)) / TICK_SPACING) + 10

const allTicks = []
for (let i = 0; i < TICK_COUNT; i++) {
  const tick = document.createElement('span')
  tick.classList.add('carousel__tick')
  line.appendChild(tick)
  allTicks.push(tick)
}

const MAX_WAVE  = 20  // ← longueur de la vague (ticks visibles max en simultané)
const waveQueue = []  // ticks actifs, du plus ancien au plus récent
let lastCi = -1

function returnTick(tick) {
  tick._ret   = true
  tick._tween = gsap.to(tick, {
    keyframes: [
      { scaleY: 0.375, backgroundColor: '#C4C4C4', duration: 0.2, ease: 'power2.out' },
      { backgroundColor: '#191919', duration: 0.05, ease: 'none' }
    ],
    overwrite: 'auto',
    onComplete() {
      tick._ret   = false
      tick._tween = null
      const i = waveQueue.indexOf(tick)
      if (i !== -1) waveQueue.splice(i, 1)
    }
  })
}

function activateAndReturn(tick) {
  gsap.set(tick, { scaleY: 1, backgroundColor: '#E14942' })
  waveQueue.push(tick)
  if (waveQueue.length > MAX_WAVE) {
    const oldest = waveQueue.shift()
    if (oldest._tween) oldest._tween.timeScale(6)  // queue pleine : le plus vieux finit vite, bord doux
  }
  returnTick(tick)
}

function moveTicks() {
  line.style.transform = `translateX(${currentX}px)`

  const ci = Math.round((needleX - currentX - 0.25) / TICK_SPACING)
  // Hors des bornes du ruban de ticks : on réinitialise lastCi pour que la
  // ré-entrée reparte proprement (aiguille seule, sans gap fantôme).
  if (ci < 0 || ci >= allTicks.length) { lastCi = -1; return }

  // La vague ne se déclenche que si l'aiguille a changé de tick. En revanche le
  // bloc "aiguille" plus bas s'exécute à CHAQUE frame (même ci === lastCi) pour
  // ré-affirmer le tick rouge grand → il ne peut jamais rester rétréci ni perdu.
  if (ci !== lastCi && lastCi >= 0 && lastCi < allTicks.length) {
    const step = ci > lastCi ? 1 : -1
    const gap  = Math.abs(ci - lastCi)

    if (gap > 50) {
      // Téléportation de la boucle infinie : loopCheck a décalé currentX de
      // copyWidth, donc ci saute d'une copie entière alors que rien n'a bougé
      // visuellement (la même image reste sous l'aiguille). On resynchronise
      // sans aucune vague : on remet l'ancienne aiguille (désormais hors-centre)
      // au repos silencieusement — c'est le bloc ciTick plus bas qui repose la
      // bonne aiguille centrée en rouge. Aucun flash, aucun rétrécissement.
      const prev = allTicks[lastCi]
      if (prev._tween) { prev._tween.kill(); prev._tween = null }
      prev._ret = false
      const pqi = waveQueue.indexOf(prev)
      if (pqi !== -1) waveQueue.splice(pqi, 1)
      gsap.set(prev, { scaleY: 0.375, backgroundColor: '#191919' })
    } else {
      for (let j = lastCi; j !== ci; j += step) {
        if (j < 0 || j >= allTicks.length) continue
        const tick = allTicks[j]
        if (tick._ret) continue
        activateAndReturn(tick)
      }
    }
  }

  const ciTick = allTicks[ci]
  ciTick._ret = false
  // killTweensOf (et pas seulement _tween) : tue AUSSI le tween de révélation du
  // loader encore actif sur ce tick — sinon ce tween réimpose scaleY 0.375 frame
  // après frame et l'aiguille rouge rétrécit tant que le loader n'est pas terminé.
  gsap.killTweensOf(ciTick)
  ciTick._tween = null
  const qi = waveQueue.indexOf(ciTick)
  if (qi !== -1) waveQueue.splice(qi, 1)
  gsap.set(ciTick, { scaleY: 1, backgroundColor: '#E14942' })

  lastCi = ci
}

moveTicks()
// Seuls les ticks réellement visibles à l'écran démarrent cachés (scaleY 0) pour la
// vague d'intro du loader. Tous les autres (hors-champ) sont posés directement au
// repos (0.375) : le ruban est donc complet et FIXE hors écran, et un drag les
// pulsera (vague directionnelle) au lieu de les "révéler" depuis le bas — la
// révélation du loader ne portait que sur ~40-130 ticks visibles, pas sur ~990.
const ciInit      = Math.round((needleX - currentX - 0.25) / TICK_SPACING)
const visibleHalf = Math.ceil((window.innerWidth / 2) / TICK_SPACING) + 10
allTicks.forEach(function(tick, i) {
  gsap.set(tick, { scaleY: Math.abs(i - ciInit) <= visibleHalf ? 0 : 0.375 })
})

// Même principe pour les images du carousel : la révélation clipPath du loader
// (du centre vers l'extérieur, ~6.5s) porte sur les ~120 images alors que seules
// celles à l'écran sont vues pendant l'intro. On pré-révèle les images hors-champ
// (clipPath ouvert) pour que le tween du loader soit un no-op sur elles — sinon
// elles "réapparaissent" quand un drag les ramène à l'écran avant la fin du loader.
const REVEAL_MARGIN = 120  // px de marge autour de l'écran
allImgs.forEach(function(img, i) {
  const screenX = natCenters[i] + currentX
  if (screenX < -REVEAL_MARGIN || screenX > window.innerWidth + REVEAL_MARGIN) {
    gsap.set(img, { clipPath: 'inset(0% 0 0 0)' })
  }
})

if (window.onTicksReady) window.onTicksReady()

let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(function() {
    needleX = window.innerWidth / 2

    // Étendre le ruban si la fenêtre s'est élargie (ex. mobile responsive → desktop) :
    // TICK_COUNT est figé au chargement, donc sans ça il manque des ticks à droite.
    // On ajoute seulement les <span> manquants, au repos (scaleY 0.375 via le CSS).
    const neededTicks = Math.ceil((window.innerWidth - (needleX - midLeft)) / TICK_SPACING) + 10
    for (let i = allTicks.length; i < neededTicks; i++) {
      const tick = document.createElement('span')
      tick.classList.add('carousel__tick')
      line.appendChild(tick)
      allTicks.push(tick)
    }

    waveQueue.forEach(tick => {
      if (tick._tween) { tick._tween.kill(); tick._tween = null }
      tick._ret = false
      gsap.set(tick, { clearProps: 'transform,backgroundColor' })
    })
    waveQueue.length = 0

    if (lastCi >= 0 && lastCi < allTicks.length) {
      gsap.killTweensOf(allTicks[lastCi])
      gsap.set(allTicks[lastCi], { clearProps: 'transform,backgroundColor' })
    }
    lastCi = -1
    const centeredIdx = lastImgIdx + imgsPerCopy
    targetX = needleX - natCenters[centeredIdx]
    currentX = targetX
    gsap.set(carouselTrack, { x: currentX })
    moveTicks()
  }, 100)
})
// ─── Dropdown ─────────────────────────────────────────────────────────────────

const ctaButton = document.querySelector('.nav__cta')
const dropdown  = document.querySelector('.nav__dropdown')

ctaButton.addEventListener('click', function() {
  dropdown.classList.toggle('is-open')
})

// ─── Grille de dev (pixel-perfect) — toggle 'g', localhost uniquement ─────────
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'g') {
      const grid = document.querySelector('.grid-overlay')
      if (grid) grid.classList.toggle('is-visible')
    }
  })
}
