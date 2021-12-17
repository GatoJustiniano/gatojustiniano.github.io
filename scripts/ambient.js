function init() {
  
  const ambient = document.querySelector('.ambient')
  
  // ambient.style.backgroundColor = 'red'

  const randomFlow = () =>{
    const newDiv = document.createElement('div')
    newDiv.classList.add('random_box')
    const randomSize = `${Math.ceil(Math.random() * 100) + 20}px`
    newDiv.style.height = randomSize
    newDiv.style.width = randomSize
    const left = Math.ceil(Math.random() * 100)
    newDiv.style.left = `${left}%`
    const transition = Math.ceil(Math.random() * 20) + 10
    newDiv.style.transition = `${transition}s`
    newDiv.style.opacity = Math.random() / 3

    setTimeout(()=>{
      newDiv.style.bottom = '100%'
      newDiv.style.left = `${left - 40}%`
    },100) 
    
    ambient.appendChild(newDiv)

    setTimeout(()=>{
      ambient.removeChild(newDiv)
    },transition * 1000)
  }

  randomFlow()

  setInterval(()=>{
    randomFlow()
  },800)


}

window.addEventListener('DOMContentLoaded', init)