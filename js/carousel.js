const sliderImages = document.querySelectorAll('.about__approach-img');
let sliderIndex = 0; // 1. Initialisation de l'index de départ

function updateSlider(activeIndex) {
  sliderImages.forEach(img => {
    img.classList.remove('active');
  });

  if (sliderImages[activeIndex]) {
    sliderImages[activeIndex].classList.add('active');
  }
}

// 2. Affichage de la première image dès le chargement de la page
updateSlider(sliderIndex);

// 3. Défilement automatique toutes les 2 secondes (2000 ms)
setInterval(() => {
  // Le modulo (%) ramène l'index à 0 dès qu'il atteint le nombre total d'images
  sliderIndex = (sliderIndex + 1) % sliderImages.length;
  
  updateSlider(sliderIndex);
}, 1000);
