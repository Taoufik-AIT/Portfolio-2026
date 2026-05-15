const projects = [
   {
     name: 'Get Your Way',
     year: 2024,
     type: 'Design & Development',
     description: 'I designed and developed a modern e-commerce',
     client: 'Get Your Way',
     sector: 'Tech', 
     role: 'Product Designer',
     scope: 'UX / UI / Frontend',
   },
   {
     name: 'Adel&Adele',
     year: 2025,
     type: 'Design',
     description: 'I designed and developed',
     client: 'Get Your Way',
     sector: 'Tech', 
     role: 'frontend dev & motion',
     scope: 'UX / UI / Frontend',

   },
   {
     name: 'Dimagin-Studio',
     year: 2023,
     type: 'Design & Development',
     description: 'I designed and developed a creative studio site',
     client: 'Get Your Way',
     sector: 'Tech', 
     role: 'design engineer & motion',
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
  
 function updateProjectInfo () {
   projectName.textContent = projects[state.activeIndex].name
   projectType.textContent = projects[state.activeIndex].type
   projectYear.textContent = projects[state.activeIndex].year
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

