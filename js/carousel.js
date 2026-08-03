// Slider auto des images dans la section "My approach" du popup About
const sliderImages = document.querySelectorAll('.about__approach-img')
let sliderIndex = 0
let sliderTimer = null

function updateSlider(activeIndex) {
  sliderImages.forEach(function(img) { img.classList.remove('active') })
  if (sliderImages[activeIndex]) sliderImages[activeIndex].classList.add('active')
}

updateSlider(sliderIndex)

window.startSlider = function() {
  if (sliderTimer || !sliderImages.length) return
  sliderTimer = setInterval(function() {
    sliderIndex = (sliderIndex + 1) % sliderImages.length
    updateSlider(sliderIndex)
  }, 1000)
}

window.stopSlider = function() {
  clearInterval(sliderTimer)
  sliderTimer = null
}
