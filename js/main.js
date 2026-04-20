const projects = [
   {
     name: 'Get Your Way',
     year: 2024,
     type: 'Design & Development',
   },
   {
     name: 'Adel&Adele',
     year: 2024,
     type: 'Design & Development',
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
 
 projectName.textContent = projects[state.activeIndex].name
 projectType.textContent = projects[state.activeIndex].type