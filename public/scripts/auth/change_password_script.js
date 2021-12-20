(function() {
    const changeForm = document.querySelector('#changeform')
    const passwordError = document.querySelector('.error.password')
    const repeatError = document.querySelector('.error.repeat')
    const checkPasswordSymbols = new RegExp(/^[\wа-яА-ЯёЁ\Q#$%|&\E]+$/)
    const loading = document.querySelector('.loading')
    let close = false
    changeForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if(close) {
            return
        }
        passwordError.textContent = ''
        repeatError.textContent = ''

        const password = changeForm.password.value
        const repeat = changeForm.repeat.value

        if(password.length < 8 || password.length > 36) {
            passwordError.textContent = 'Пароль должен быть длиной от 8 до 36 символов'
            return
        } else if(!checkPasswordSymbols.test(password)) {
            passwordError.textContent = 'Пароль может содержать только русские или латинские буквы, цифры, специальные символы #, $, %, &, |'
            return
        }
        if(repeat !== password) {
            repeatError.textContent = 'Пароли не совпадают'
            passwordError.textContent = 'Пароли не совпадают'
            return
        }
        loading.classList.add('active')
    fetch(location.pathname, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({password, repeat})
    })
        .then(response => response.json())
        .then(data => {
            loading.classList.remove('active')
            if(data.errors) {
                if(data.errors.password == '') {
                    passwordError.textContent = data.errors.repeat
                    repeatError.textContent = data.errors.repeat
                } else {
                    passwordError.textContent = data.errors.password
                }
                return
            }
            if(data.passError) {
                passwordError.textContent = data.passError
                repeatError.textContent = data.passError
            }
            if(data.linkError) {
                const linkError = document.createElement('div')
                linkError.classList.add('link-error')
                linkError.textContent = data.linkError
                document.querySelector('.change').innerHTML = ''
                document.querySelector('.change').append(linkError)
                return
            }
            if(data.status) {
                const changeStatus = document.createElement('div')
                changeStatus.classList.add('change-status')
                const img = document.createElement('img')
                img.classList.add('change-status-img')
                img.src = '/images/change-checked.svg'
                img.onload = () => {
                    const changeStatusText = document.createElement('div')
                    changeStatusText.classList.add('change-status-text')
                    changeStatusText.textContent = data.status
                    changeStatus.append(changeStatusText)
                    changeStatus.append(img)
                    document.querySelector('.change').innerHTML = ''
                    document.querySelector('.change').append(changeStatus)
                    setTimeout(() => {
                        changeStatus.classList.add('active')
                        setTimeout(() => {
                            location.assign('/')
                        }, 3000)
                    }, 0)
                    
                }
            }
        })
    })
})()