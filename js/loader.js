gsap.registerPlugin(SplitText)

// ─── État initial ─────────────────────────────────────────────────────────────

gsap.set('.loader',             { display: 'flex' })
gsap.set('.carousel__triangle', { opacity: 0 })
gsap.set('.carousel__label',    { opacity: 0 })
gsap.set('.carousel__img',      { clipPath: 'inset(100% 0 0 0)' })
gsap.set('.preview-wrapper',    { autoAlpha: 0 })
gsap.set('.preview',            { clipPath: 'inset(100% 10% 0% 12%)', scale: 0.45 })
gsap.set('.nav',                { opacity: 0 })
gsap.set('.project-info',       { opacity: 0 })
gsap.set('.project-open-btn',   { opacity: 0 })
document.body.classList.add('is-loading')
gsap.set('.carousel__line', { opacity: 0 })  // ruban masqué pendant l'attente des polices

// ─── onTicksReady : stub synchrone ────────────────────────────────────────────
// main.js appelle window.onTicksReady() de façon synchrone, mais toute la timeline
// est différée jusqu'au chargement des polices (document.fonts.ready) — sinon
// SplitText mesure les lignes avec la police de repli et l'animation d'entrée du
// titre/expertise casse sur mobile (1er chargement, police pas encore en cache).
// On masque .carousel__line pendant l'attente pour éviter tout ruban partiel /
// glitch de ticks au resize ; buildLoader le réaffiche puis joue le loader.
let ticksReadyRequested = false
window.onTicksReady = function() { ticksReadyRequested = true }

// ─── Construction différée jusqu'au chargement des polices ────────────────────
function buildLoader() {

gsap.set('.carousel__line', { opacity: 1 })  // le loader va jouer : on réaffiche le ruban

// ─── SplitText ────────────────────────────────────────────────────────────────

const titleSplit  = SplitText.create('.loader__title',    { type: 'lines', mask: 'lines' })
const expertSplit = SplitText.create('.loader__expertise', { type: 'lines', mask: 'lines' })

// Marge droite sur les masques SplitText pour que les glyphes italiques ne soient pas clippés
titleSplit.lines.forEach(function(line) { line.parentElement.style.paddingRight = '6px' })

gsap.set(titleSplit.lines,  { yPercent: 100 })
gsap.set(expertSplit.lines, { yPercent: 100 })

// Lignes cachées dans les wrappers — on rend les wrappers visibles maintenant
gsap.set('.loader__title-wrapper, .loader__expertise-wrapper', { visibility: 'visible' })

// ─── Timeline ─────────────────────────────────────────────────────────────────

const loaderTl = gsap.timeline({
  delay: 0.1,
  onComplete: function() {
    gsap.set('.carousel__img', { clearProps: 'clipPath' })
    gsap.set('.preview',       { clearProps: 'clipPath, scale' })
  }
})

// Étape 1 — Titre
loaderTl.to(titleSplit.lines, { yPercent: 0, duration: 1, ease: 'power2.inOut', stagger: 0.12 })

// Étape 2 — Expertise (chevauchement avec titre)
loaderTl.to(expertSplit.lines, { yPercent: 0, duration: 1, ease: 'power3.inOut', stagger: 0.12 }, '-=0.8')

// Étape 3 — Triangle seul (le label apparaît à la toute fin, avec nav et project-info)
loaderTl.to('.carousel__triangle', { opacity: 1, duration: 0.2, ease: 'power1.out' }, '+=0.2')

// Étapes 4+5 — Ticks + images simultanés (construits par onTicksReady)
loaderTl.addLabel('ticksAndImages', '+=0.2')

// ─── Hook : appelé depuis main.js après création des ticks ───────────────────

function buildTicksAndExit() {
  const ci           = Math.round((needleX - currentX - 0.25) / TICK_SPACING)
  const centerImgIdx = lastImgIdx + imgsPerCopy
  const leftTicks    = allTicks.slice(0, ci)
  const rightTicks   = allTicks.slice(ci + 1)

  const TICK_DUR  = 0.5
  const IMG_DUR   = 0.7
  const EACH_TICK = window.matchMedia('(min-width: 1600px)').matches ? 0.008 : 0.009  // écart par tick — vague clairement perceptible, réduit sur grand écran (plus de ticks à balayer)

  const nTickMax = Math.max(leftTicks.length, rightTicks.length)
  const nImgMax  = Math.max(centerImgIdx, allImgs.length - 1 - centerImgIdx)

  // T_TOTAL dérivé depuis les ticks — les images s'alignent dessus
  const T_TOTAL  = (nTickMax > 1 ? nTickMax - 1 : 1) * EACH_TICK + TICK_DUR
  const eachTick = EACH_TICK
  const eachImg  = nImgMax > 0 ? (T_TOTAL - IMG_DUR) / nImgMax : 0.06

  // Init séparateurs — cachés, prêts à monter depuis le bas
  gsap.set('.carousel__separator', { scaleY: 0, transformOrigin: 'bottom center' })

  // Images carousel — clipPath, symétrique depuis l'image centre
  loaderTl.to(allImgs, {
    clipPath: 'inset(0% 0 0 0)',
    duration: IMG_DUR,
    ease: 'power3.out',
    stagger: { each: eachImg, from: centerImgIdx }
  }, 'ticksAndImages')

  // Séparateurs — chacun suit la vague des images (scaleY bas→haut)
  const allImgsArr = Array.from(allImgs)
  const allGroups  = Array.from(document.querySelectorAll('.carousel__group'))
  const allSeps    = Array.from(document.querySelectorAll('.carousel__separator'))

  allSeps.forEach(function(sep, i) {
    const prevGroupImgs  = Array.from(allGroups[i]?.querySelectorAll('.carousel__img') || [])
    const prevLastImg    = prevGroupImgs[prevGroupImgs.length - 1] || null
    const nextFirstImg   = allGroups[i + 1]?.querySelector('.carousel__img') || null

    const prevIdx = prevLastImg  ? allImgsArr.indexOf(prevLastImg)  : Infinity
    const nextIdx = nextFirstImg ? allImgsArr.indexOf(nextFirstImg) : Infinity
    if (prevIdx === Infinity && nextIdx === Infinity) return

    const closestIdx = prevIdx === Infinity ? nextIdx
                     : nextIdx === Infinity ? prevIdx
                     : Math.abs(prevIdx - centerImgIdx) <= Math.abs(nextIdx - centerImgIdx) ? prevIdx : nextIdx

    const imgFinish = Math.abs(closestIdx - centerImgIdx) * eachImg + IMG_DUR
    loaderTl.to(sep, {
      scaleY: 1,
      duration: TICK_DUR,
      ease: 'power1.out'
    }, 'ticksAndImages+=' + imgFinish.toFixed(3))
  })

  // Tick central — rouge, scaleY 1 (taille réelle)
  loaderTl.to(allTicks[ci], {
    scaleY: 1,
    backgroundColor: '#E14942',
    duration: TICK_DUR,
    ease: 'power1.out'
  }, 'ticksAndImages')

  // On ne révèle (tween) QUE les ticks visibles à l'écran. Les ticks hors-champ
  // sont déjà posés au repos (0.375) par main.js et ne reçoivent AUCUN tween :
  // sinon, sur mobile (lerp rapide), l'aiguille atteint un tick lointain avant sa
  // révélation, le tween démarre ensuite sous l'aiguille (scaleY 1 → 0.375) et la
  // fait rétrécir. Le timing global (nTickMax) reste basé sur le ruban complet.
  const VIS         = Math.ceil((window.innerWidth / 2) / TICK_SPACING) + 10
  const leftReveal  = leftTicks.slice(Math.max(0, leftTicks.length - VIS))
  const rightReveal = rightTicks.slice(0, VIS)

  // Ticks gauche — du centre vers la gauche
  if (leftReveal.length) {
    loaderTl.to(leftReveal, {
      scaleY: 0.375,
      duration: TICK_DUR,
      ease: 'power1.out',
      stagger: { each: eachTick, from: 'end' }
    }, 'ticksAndImages')
  }

  // Ticks droite — du centre vers la droite
  if (rightReveal.length) {
    loaderTl.to(rightReveal, {
      scaleY: 0.375,
      duration: TICK_DUR,
      ease: 'power1.out',
      stagger: { each: eachTick, from: 'start' }
    }, 'ticksAndImages')
  }

  // Étape 6 — Sortie quand le front de la vague atteint les bords
  const waveEdge      = (nTickMax > 1 ? nTickMax - 1 : 1) * EACH_TICK
  const isMobileLoader = window.matchMedia('(max-width: 430px)').matches
  const exitOffsetNum  = waveEdge * (isMobileLoader ? 0.1 : 0.3)
  const exitStart     = 'ticksAndImages+=' + exitOffsetNum.toFixed(3)

  loaderTl.to(titleSplit.lines, {
    yPercent: -100,
    duration: 0.6,
    ease: 'power3.in',
    stagger: 0.12
  }, exitStart)

  loaderTl.to(expertSplit.lines, {
    yPercent: -100,
    duration: 0.7,
    ease: 'power3.in',
    stagger: 0.12
  }, exitStart)

  // Étape 7 — Preview : clip-path symétrique 4 côtés → révèle depuis le centre
  const previewStart = 'ticksAndImages+=' + (exitOffsetNum + 0.7).toFixed(3)

  loaderTl.set('.preview-wrapper', { autoAlpha: 1 }, previewStart)
  loaderTl.to('.preview', {
    clipPath: 'inset(20% 10% 10% 12%)',
    duration: 1.3,
    ease: 'power3.inOut'
  }, previewStart)

  // Débloque le scroll dès que le clip-path est fini — le scale continue en fond
  loaderTl.call(function() {
    document.body.classList.remove('is-loading')
    gsap.set('.loader', { display: 'none' })
  }, null, '>')

  // Étape 8 — Scale 0.45 → 1
  loaderTl.to('.preview', {
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: 1.4,
    ease: 'power3.inOut'
  }, '<-=0.15')

  // Étape 9 — Fondu nav + project-info + label
  loaderTl.to(['.nav', '.project-info', '.carousel__label', '.project-open-btn'], {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '>+=0.1')

  loaderTl.call(function() { window.showCursor(); state.isLoading = false }, null, '>')

}

  // La vraie fonction est prête : on l'expose et on rejoue l'appel de main.js
  // s'il a déjà eu lieu pendant l'attente des polices.
  window.onTicksReady = buildTicksAndExit
  if (ticksReadyRequested) buildTicksAndExit()

} // ── fin buildLoader ──

// Attendre le chargement des polices avant de construire/lancer le loader
// (sinon SplitText mesure mal les lignes → animation d'entrée cassée sur mobile).
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(buildLoader)
} else {
  buildLoader()
}
