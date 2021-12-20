(function() {
    const changeForm = document.querySelector('#changeform')
    const emailError = document.querySelector('.email-error')
    const loading = document.querySelector('.loading')
    const log = document.querySelector('.log')
    log.onclick = () => {
        loading.classList.toggle('active')
    }
    let close = false
    changeForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if(close) {
            return
        }
        loading.classList.add('active')
        emailError.textContent = ''

        const email = changeForm.email.value
        close = true
        fetch('/auth/change', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        })
            .then(response => response.json())
            .then(data => {
                loading.classList.remove('active')
                console.log(data)
                close = false
                if(data.status) {
                    const sent = document.createElement('div')
                    sent.classList.add('sent')
                    sent.innerHTML = data.status
                    document.querySelector('.change').innerHTML = ''
                    document.querySelector('.change').append(sent)
                }
                if(data.emailError) {
                    emailError.textContent = data.emailError
                    return
                }
                if(data.sendError) {
                    emailError.textContent = data.sendError
                    return
                }
                if(data.confirmError) {
                    location.assign('/auth/change/needconfirm')
                } 
            })
    })
})()