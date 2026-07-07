// Slider auto des images dans la section "My approach" du popup About
const sliderImages = document.querySelectorAll('.about__approach-img')
let sliderIndex = 0

function updateSlider(activeIndex) {
  sliderImages.forEach(function(img) { img.classList.remove('active') })
  if (sliderImages[activeIndex]) sliderImages[activeIndex].classList.add('active')
}

updateSlider(sliderIndex)

setInterval(function() {
  if (!state.isAboutOpen) return
  sliderIndex = (sliderIndex + 1) % sliderImages.length
  updateSlider(sliderIndex)
}, 1000)
