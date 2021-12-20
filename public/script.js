(function() {
    const ideForm = document.querySelector('#ide-form')
    const ideConsole = document.querySelector('.ide-console')

    ideForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if(ideConsole.value.length > 5000){
            ideConsole.value = 'So much data in console!'
            return
        }
        const code = ideForm.codearea.value
        const args = ideConsole.value.split('\n').map(item => item.trim().toString()).filter(item => item !== '')

        fetch('/run', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code, args})
        })  
            .then(response => response.json())
            .then(data => {
                if(data.response.error) {
                    ideConsole.value = data.response.error.errArray[1]
                    return
                }
                if(data.response.derror) {
                    ideConsole.value = data.response.derror
                    return
                }
                ideConsole.value = data.response
            })
    })
    
})()

