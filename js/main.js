// Initialise Lenis principal sur la page globale 
window.lenis = new Lenis({
  autoRaf: true,
});

// ResizeObserver existant va mettre à jour ce scroll global
const popupInner = document.querySelector('.popup-about__inner');
const ro = new ResizeObserver(() => {
  window.lenis.resize();
});
ro.observe(popupInner);


// window.lenis = new Lenis({ autoRaf: true })
// const popupInner = ...
// const ro = new ResizeObserver(...)
// ro.observe(popupInner)


const projects = [
   {
     name: 'Get Your Way',
     year: 2024,
     type: 'Design & Development',
     description1: 'I designed and developed a modern e-commerce experience focused on making product discovery and purchasing simple, fast, and visually engaging. The goal was to create a digital storefront where users can easily explore products, understand their value, and complete purchases with minimal friction.',
     description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
     client: 'Get Your Way',
     sector: 'Tech', 
     role: 'Product Designer',
     scope: 'UX / UI / Frontend',
   },
   {
     name: 'Adel&Adele',
     year: 2025,
     type: 'Design',
     description1: 'I designed and developed a modern e-commerce experience focused on making product discovery and purchasing simple, fast, and visually engaging. The goal was to create a digital storefront where users can easily explore products, understand their value, and complete purchases with minimal friction.',
     description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
     client: 'Adel & Adele',
     sector: 'Tech', 
     role: 'frontend dev & motion',
     scope: 'UX / UI / Frontend',

   },
   {
     name: 'Dimagin-Studio',
     year: 2023,
     type: 'Design & Development',
     description1: 'I designed and developed a modern e-commerce experience focused on making product discovery and purchasing simple, fast, and visually engaging. The goal was to create a digital storefront where users can easily explore products, understand their value, and complete purchases with minimal friction.',
     description2: 'The project focused on clear product presentation, intuitive navigation, and a streamlined checkout flow to improve usability and conversion. The interface was designed to highlight the brand while maintaining a clean and scalable design system.',
     client: 'Dimagin-Studio',
     sector: 'Tech', 
     role: 'web engineer & motion',
     scope: 'UX / UI / Frontend',
   },
 ]
 
 const state = {
   activeIndex: 0,
   isPopupOpen: false,
   isAboutOpen: false,
 }
  
 
 const projectName = document.querySelector('.project__name')
 const projectType = document.querySelector('.project__type')
 const projectYear = document.querySelector('.project__year')
 const projectClient = document.querySelector('.popup__client')
 const projectSector = document.querySelector('.popup__sector')
 const projectRole = document.querySelector('.popup__role')
 const projectScope = document.querySelector('.popup__scope')
 const popupYear = document.querySelector('.popup__year')
 const projectDescription1 = document.querySelector('.popup__description:first-of-type')
 const projectDescription2 = document.querySelector('.popup__description:last-of-type')
 
 function updateProjectInfo () {
   projectName.textContent = projects[state.activeIndex].name
   projectType.textContent = projects[state.activeIndex].type
   projectYear.textContent = projects[state.activeIndex].year
   projectClient.textContent = projects[state.activeIndex].client
   projectSector.textContent = projects[state.activeIndex].sector
   projectRole.textContent = projects[state.activeIndex].role
   projectScope.textContent = projects[state.activeIndex].scope
   popupYear.textContent = projects[state.activeIndex].year
   projectDescription1.textContent = projects[state.activeIndex].description1
   projectDescription2.textContent = projects[state.activeIndex].description2
}
updateProjectInfo ()


function navigateProject (direction) {
  state.activeIndex = (state.activeIndex + direction + projects.length) % projects.length

  updateProjectInfo ()

}

window.addEventListener('wheel', function(event){

  if (event.deltaY > 0) {
    navigateProject(1)

   } else {
      navigateProject(-1)
 }
})

let startX = 0

window.addEventListener('mousedown', function (event){
 startX = event.clientX 
})

window.addEventListener('mouseup', function(event) {
  const distance = Math.abs(event.clientX - startX)
  
  if (distance > 50) {          // cas 1 et 2
    if (event.clientX > startX) {
      navigateProject(1)
    } else {
      navigateProject(-1)
    }
  } else {
  }
})

const ctaButton = document.querySelector('.nav__cta')
const dropdown = document.querySelector('.nav__dropdown')

ctaButton.addEventListener('click', function() {
  dropdown.classList.toggle('is-open')
})


const line = document.querySelector('.carousel__line')


let totalTicks = Math.floor(window.innerWidth / 5)
if (totalTicks % 2 === 0) totalTicks--
const centerIndex = Math.floor(totalTicks / 2)

for (let i = 0; i < totalTicks; i++) {
  const tick = document.createElement('span')
  tick.classList.add('carousel__tick')
  if (i === centerIndex) {
    tick.classList.add('carousel__tick--active')
  }
  line.appendChild(tick)
}