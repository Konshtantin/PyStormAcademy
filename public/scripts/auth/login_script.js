(function() {
    const loginForm = document.querySelector('#loginform')
    const loginError = document.querySelector('.login-error')
    const loading = document.querySelector('.loading')
    let close = false
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if(close) {
            return
        }

        loginError.classList.remove('active')
        loginError.textContent = ''

        const email = loginForm.email.value
        const password = loginForm.password.value

        close = true
        loading.classList.add('active')
        fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
            .then(response => response.json())
            .then(data => {
                loading.classList.remove('active')
                if(data.confirmError) {
                    location.assign('/auth/login/needconfirm')
                    return
                }
                if(data.error) {
                    loginError.classList.add('active')
                    loginError.textContent = data.error
                    close = false
                    return
                }
                location.assign('/')
            })
    })
})()