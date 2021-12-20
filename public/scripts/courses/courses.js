(function() {
    const moduleList = document.querySelector('.module-list')
    moduleList.addEventListener('click', (event) => {
        let node
        if(event.target.classList.contains('module__item')) {
            node = event.target
        } else if (event.target.classList.contains('caret')) {
            node = event.target.parentElement
        }
        node.classList.toggle('active')
    })
})()