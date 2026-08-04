// cursor, barV, barH, cursorMoved, mouseX, mouseY, revealCursor(), initHoverTargets()
// sont fournis par cursor-core.js chargé avant ce fichier

// ─── Ticks ────────────────────────────────────────────────────────────────────

const line      = document.querySelector('.carousel__line')
const tickCount = Math.ceil(window.innerWidth / 5.5)
const centerIdx = Math.floor(tickCount / 2)

for (let i = 0; i < tickCount; i++) {
  const tick = document.createElement('span')
  tick.classList.add('carousel__tick')
  if (i === centerIdx) {
    tick.style.backgroundColor = '#E14942'
    tick.style.transform = 'scaleY(1)'
  }
  line.appendChild(tick)
}

// ─── Cursor — révélation au premier mouvement ─────────────────────────────────

let cursorRevealDone = false
const isMobile404 = window.matchMedia('(max-width: 430px)').matches
window.addEventListener('mousemove', function() {
  if (!isMobile404 && !cursorRevealDone) {
    cursorRevealDone = true
    revealCursor()
  }
})

initHoverTargets('.error__cta')

// ─── VHS — injection des éléments FX + déphasage des animations ──────────────

document.querySelectorAll('.vhs-block').forEach(function(block, i) {
  const classes = ['vhs-roll', 'vhs-flash', 'vhs-beam', 'vhs-glitch', 'vhs-static']
  for (let c = 0; c < classes.length; c++) {
    const el = document.createElement('div')
    el.className = classes[c]
    block.appendChild(el)
  }

  const inner = block.querySelector('.vhs-inner')
  if (inner) inner.style.animationDelay = '-' + ((i * 1.7) % 11).toFixed(2) + 's'

  const layers = block.querySelectorAll('.vhs-layer')
  const cycles = [7, 9, 5, 13]
  const seeds  = [2.3, 1.9, 3.1, 2.7]
  for (let j = 0; j < layers.length; j++) {
    layers[j].style.animationDelay = '-' + ((i * seeds[j]) % cycles[j]).toFixed(2) + 's'
  }
})

// ─── Matter.js — physique HTML ────────────────────────────────────────────────

const { Engine, Runner, Bodies, Body, World, Events } = Matter

const engine = Engine.create()
engine.gravity.y      = 1
engine.enableSleeping = true

Runner.run(Runner.create(), engine)

const W = window.innerWidth
const H = window.innerHeight
const T = 60

World.add(engine.world, [
  Bodies.rectangle(W / 2,     H + T / 2, W + T * 2, T, { isStatic: true }),
  Bodies.rectangle(-T / 2,    H / 2,     T, H * 3,   { isStatic: true }),
  Bodies.rectangle(W + T / 2, H / 2,     T, H * 3,   { isStatic: true })
])

document.querySelector('.carousel').style.overflow = 'visible'

const previewWrapper = document.querySelector('.preview-wrapper')
const pvRect         = previewWrapper.getBoundingClientRect()
previewWrapper.style.left      = pvRect.left + 'px'
previewWrapper.style.top       = pvRect.top  + 'px'
previewWrapper.style.transform = 'none'

const physicsEls = []

function addBody(el, opts) {
  const rect = el.getBoundingClientRect()
  const w    = Math.max(rect.width,  1)
  const h    = Math.max(rect.height, 1)
  const cx   = rect.left + w / 2
  const cy   = rect.top  + h / 2
  const body = Bodies.rectangle(cx, cy, w, h, Object.assign({
    restitution: 0.3,
    friction:    0.3
  }, opts || {}))
  physicsEls.push({ el, body, cx0: cx, cy0: cy })
  World.add(engine.world, body)
}

document.querySelectorAll('.carousel__tick').forEach(function(tick) { addBody(tick) })
document.querySelectorAll('.carousel__img').forEach(function(img)  { addBody(img)  })
document.querySelectorAll('.carousel__separator').forEach(function(sep) { addBody(sep) })
const triangle = document.querySelector('.carousel__triangle')
if (triangle) addBody(triangle)
const label = document.querySelector('.carousel__label')
if (label) addBody(label)
addBody(previewWrapper, { restitution: 0.1, friction: 0.5 })

const cursorBody = Bodies.circle(W / 2, -200, 18, {
  isStatic:    true,
  restitution: 0.5,
  friction:    0
})
World.add(engine.world, cursorBody)

Events.on(engine, 'beforeUpdate', function() {
  if (!cursorMoved) return
  Body.setVelocity(cursorBody, { x: mouseX - cursorBody.position.x, y: mouseY - cursorBody.position.y })
  Body.setPosition(cursorBody, { x: mouseX, y: mouseY })
})

Events.on(engine, 'afterUpdate', function() {
  physicsEls.forEach(function(item) {
    const dx = item.body.position.x - item.cx0
    const dy = item.body.position.y - item.cy0
    item.el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + item.body.angle + 'rad)'
  })
})

// ─── VHS effets GSAP (flash / flare / glitch / noise) ────────────────────────

const vhsFlashes  = Array.from(document.querySelectorAll('.vhs-flash'))
const vhsBeams    = Array.from(document.querySelectorAll('.vhs-beam'))
const vhsGlitches = Array.from(document.querySelectorAll('.vhs-glitch'))

const cursorInner = cursor.querySelector('.vhs-inner')
if (cursorInner) cursorInner.style.animationDelay = '-3.5s'
const cursorLayers = cursor.querySelectorAll('.vhs-layer')
const cCycles = [7, 9, 5, 13]
const cSeeds  = [2.3, 1.9, 3.1, 2.7]
cursorLayers.forEach(function(layer, j) {
  layer.style.animationDelay = '-' + ((cSeeds[j] * 5) % cCycles[j]).toFixed(2) + 's'
})
const cf = cursor.querySelector('.vhs-flash')
const cb = cursor.querySelector('.vhs-beam')
const cg = cursor.querySelector('.vhs-glitch')
if (cf) vhsFlashes.push(cf)
if (cb) vhsBeams.push(cb)
if (cg) vhsGlitches.push(cg)

function triggerFlash() {
  if (Math.random() > 0.88) {
    const el   = vhsFlashes[Math.floor(Math.random() * vhsFlashes.length)]
    const reps = Math.random() > 0.6 ? 1 : 3
    gsap.killTweensOf(el)
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: Math.random() * 0.28 + 0.04, duration: 0.05, yoyo: true, repeat: reps, ease: 'none',
        onComplete: function() { gsap.set(el, { opacity: 0 }) } }
    )
  }
}

function triggerFlare() {
  if (Math.random() > 0.94) {
    const el = vhsBeams[Math.floor(Math.random() * vhsBeams.length)]
    gsap.killTweensOf(el)
    gsap.fromTo(el,
      { opacity: 0.75, xPercent: -200 },
      { opacity: 0, xPercent: 200, duration: 0.28, ease: 'power2.in' }
    )
  }
}

const GLITCH_COLORS = [
  'rgba(255, 30, 60, 0.55)',
  'rgba(0, 220, 255, 0.50)',
  'rgba(255, 255, 255, 0.35)'
]

function triggerGlitch() {
  if (Math.random() > 0.87) {
    const el  = vhsGlitches[Math.floor(Math.random() * vhsGlitches.length)]
    const y1  = Math.random() * 75
    const h   = Math.random() * 22 + 4
    const y2  = Math.max(0, 100 - y1 - h)
    const dx  = (Math.random() - 0.5) * 18
    const col = GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)]
    gsap.killTweensOf(el)
    gsap.set(el, { clipPath: 'inset(' + y1 + '% 0 ' + y2 + '% 0)', x: dx, backgroundColor: col, opacity: 1 })
    gsap.to(el, {
      opacity: 0,
      duration: Math.random() * 0.07 + 0.03,
      ease: 'none',
      onComplete: function() { gsap.set(el, { x: 0, clipPath: 'none', opacity: 0 }) }
    })
  }
}

// ─── Boucle unifiée — flash / flare / glitch / noise via gsap.ticker ─────────

const turbulence = document.getElementById('vhs-turbulence')
let noiseSeed  = 3
let noiseFrame = 0
let lastFlash  = 0
let lastFlare  = 0
let lastGlitch = 0

gsap.ticker.add(function(time) {
  // Flash  — toutes les ~190 ms
  if (time - lastFlash >= 0.190) { lastFlash = time; triggerFlash() }
  // Flare  — toutes les ~280 ms
  if (time - lastFlare >= 0.280) { lastFlare = time; triggerFlare() }
  // Glitch — toutes les ~130 ms
  if (time - lastGlitch >= 0.130) { lastGlitch = time; triggerGlitch() }
  // Noise  — seed change toutes les 2 frames (~30 fps)
  noiseFrame++
  if (noiseFrame % 2 === 0) {
    noiseSeed = (noiseSeed + 1) % 500
    turbulence.setAttribute('seed', noiseSeed)
  }
})
