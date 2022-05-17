(function () {
    const usernameElement = document.querySelector('.username')
    const profileMenuElement = document.querySelector('.profile-menu')
    const triangleElement = document.querySelector('.triangle')

    if(usernameElement && triangleElement && profileMenuElement) {
        usernameElement.addEventListener('click', () => {
            usernameElement.classList.toggle('active')
            profileMenuElement.classList.toggle('active')
        })
    
        triangleElement.addEventListener('click', () => {
            usernameElement.classList.remove('active')
            profileMenuElement.classList.remove('active')
        })
    }
})()