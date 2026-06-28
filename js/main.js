window.lenis = new Lenis({ autoRaf: true })

const popupInner = document.querySelector('.popup-about__inner')
const ro = new ResizeObserver(() => { window.lenis.resize() })
ro.observe(popupInner)

// ─── Projets ──────────────────────────────────────────────────────────────────

const projects = [
  {
    name: 'Get Your Way',
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
    year: 2026,
    type: 'Branding & Motion',
    client: 'Studio Fictif',
    sector: 'Creative',
    role: 'Art Director',
    scope: 'Branding / Motion / Web',
    description1: 'A fictitious creative studio project exploring brand identity and motion design. The goal was to build a cohesive visual language that spans digital and print, with a strong typographic system and animated brand elements.',
    description2: 'The project showcases a minimal but expressive design approach, combining bold typography with subtle motion to create a memorable brand experience that works across every touchpoint.',
  },
]

const state = {
  activeIndex: 0,
  isPopupOpen: false,
  isAboutOpen: false,
}

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
const previewImg          = document.querySelector('.preview__img')

function updateProjectInfo() {
  const p = projects[state.activeIndex]
  projectName.textContent         = p.name
  projectType.textContent         = p.type
  projectYear.textContent         = p.year
  projectClient.textContent       = p.client
  projectSector.textContent       = p.sector
  projectRole.textContent         = p.role
  projectScope.textContent        = p.scope
  popupYear.textContent           = p.year
  projectDescription1.textContent = p.description1
  projectDescription2.textContent = p.description2
}

updateProjectInfo()

// ─── Carousel infini ──────────────────────────────────────────────────────────

const carouselEl    = document.querySelector('.carousel')
const carouselTrack = document.querySelector('.carousel__track')

// Cloner le contenu 3× pour le loop infini
const originalHTML = carouselTrack.innerHTML
carouselTrack.innerHTML = originalHTML + originalHTML + originalHTML

const allImgs     = Array.from(document.querySelectorAll('.carousel__img'))
const imgsPerCopy = allImgs.length / 3

// Centres naturels avant tout transform
const natCenters = allImgs.map(function(img) {
  const r = img.getBoundingClientRect()
  return r.left + r.width / 2
})

const needleX   = window.innerWidth / 2
const copyWidth = natCenters[imgsPerCopy] - natCenters[0]

// Seuils de boucle : milieu du gap entre la dernière image d'une copie
// et la première de la suivante. Téléporter depuis midLeft → on atterrit
// exactement à midRight (et vice-versa) → pas d'oscillation possible.
const midRight = (natCenters[imgsPerCopy - 1]     + natCenters[imgsPerCopy])     / 2
const midLeft  = (natCenters[2 * imgsPerCopy - 1] + natCenters[2 * imgsPerCopy]) / 2

let targetX  = needleX - natCenters[imgsPerCopy]
let currentX = needleX - natCenters[imgsPerCopy]

gsap.set(carouselTrack, { x: currentX })

function loopCheck() {
  while (needleX - currentX > midLeft) {
    currentX += copyWidth
    targetX  += copyWidth
  }
  while (needleX - currentX < midRight) {
    currentX -= copyWidth
    targetX  -= copyWidth
  }
}

// Ticker GSAP : lerp fluide + correction de boucle + rendu
let lastImgIdx = -1

gsap.ticker.add(function() {
  const prevX = currentX
  currentX += (targetX - currentX) * 0.12
  loopCheck()

  if (Math.abs(currentX - prevX) > 0.01) {
    gsap.set(carouselTrack, { x: currentX })
    syncCarousel()
  }
})

function syncCarousel() {
  const target = needleX - currentX
  let best = 0, bestDist = Infinity

  // Chercher dans la copie 2 uniquement (indices imgsPerCopy à 2×imgsPerCopy-1)
  for (let i = imgsPerCopy; i < 2 * imgsPerCopy; i++) {
    const dist = Math.abs(natCenters[i] - target)
    if (dist < bestDist) { bestDist = dist; best = i - imgsPerCopy }
  }

  if (best === lastImgIdx) return
  lastImgIdx = best

  previewImg.src = allImgs[best].src

  const group  = allImgs[best].closest('.carousel__group')
  const pIndex = parseInt(group.dataset.project || 0)

  if (pIndex !== state.activeIndex) {
    state.activeIndex = pIndex
    updateProjectInfo()
  }
}

// ─── Wheel ────────────────────────────────────────────────────────────────────

window.addEventListener('wheel', function(event) {
  if (state.isPopupOpen || state.isAboutOpen) return
  targetX -= event.deltaY
})

// ─── Drag carousel ────────────────────────────────────────────────────────────

let carouselDragging  = false
let carouselDragStart = 0
let carouselStartX    = 0
let carouselMoved     = false

carouselEl.addEventListener('mousedown', function(event) {
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
  if (carouselMoved) snapToNearest()
})

function snapToNearest() {
  const target = needleX - currentX
  let best = imgsPerCopy, bestDist = Infinity

  for (let i = imgsPerCopy; i < 2 * imgsPerCopy; i++) {
    const dist = Math.abs(natCenters[i] - target)
    if (dist < bestDist) { bestDist = dist; best = i }
  }

  targetX = needleX - natCenters[best]
}

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


// ─── Dropdown ─────────────────────────────────────────────────────────────────

const ctaButton = document.querySelector('.nav__cta')
const dropdown  = document.querySelector('.nav__dropdown')

ctaButton.addEventListener('click', function() {
  dropdown.classList.toggle('is-open')
})

// ─── Ticks du ruler ───────────────────────────────────────────────────────────

const line = document.querySelector('.carousel__line')

let totalTicks = Math.floor(window.innerWidth / 5)
if (totalTicks % 2 === 0) totalTicks--
const centerIndex = Math.floor(totalTicks / 2)

for (let i = 0; i < totalTicks; i++) {
  const tick = document.createElement('span')
  tick.classList.add('carousel__tick')
  if (i === centerIndex) tick.classList.add('carousel__tick--active')
  line.appendChild(tick)
}
