const projects = [
   {
     name: 'Get Your Way',
     year: 2024,
     type: 'Design & Development',
   },
   {
     name: 'Adel&Adele',
     year: 2024,
     type: 'Design',
   },
   {
     name: 'Dimagin-Studio',
     year: 2025,
     type: 'Design & Development',
   },
 ]
 
 const state = {
   activeIndex: 0,
   isPopupOpen: false,
   isAboutOpen: false,
 }
  
 
 const projectName = document.querySelector('.project-name')
 const projectType = document.querySelector('.project-type')
  
 function updateProjectInfo () {
   projectName.textContent = projects[state.activeIndex].name
   projectType.textContent = projects[state.activeIndex].type
}
updateProjectInfo ()


const btnNext = document.querySelector('.btn-next')
const btnPrev = document.querySelector('.btn-prev')


function navigateProject (direction) {
  state.activeIndex = (state.activeIndex + direction + projects.length) % projects.length

  updateProjectInfo ()

}

btnNext.addEventListener('click', function (){
  navigateProject(1)
})

btnPrev.addEventListener('click', function(){
  navigateProject(-1)
})

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

window.addEventListener('mouseup', function (event){
  if (event.clientX > startX) {
    navigateProject(1)
  
  } else {
    navigateProject(-1)

  }

})

