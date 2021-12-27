(function() {
    const signUpForm = document.querySelector('#signupform')
    const nameError = document.querySelector('.name.error')
    const surnameError = document.querySelector('.surname.error')
    const emailError = document.querySelector('.email.error')
    const passwordError = document.querySelector('.password.error')
    const repeatError = document.querySelector('.repeat.error')
    const checkNameSymbols = new RegExp(/^[a-zA-Zа-яА-ЯёЁ-]+$/)
    const checkPasswordSymbols = new RegExp(/^[\wа-яА-ЯёЁ\Q#$%|&\E]+$/)
    const loading = document.querySelector('.loading')
    let close = false
    function clearErrors() {
        nameError.textContent = ''
        surnameError.textContent = ''
        emailError.textContent = ''
        passwordError.textContent = ''
        repeatError.textContent = ''
    }
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault()

        if(close) {
            return
        }
        clearErrors()
        const name = signUpForm.name.value
        const surname = signUpForm.surname.value
        const email = signUpForm.email.value
        const password = signUpForm.password.value
        const repeat = signUpForm.repeat.value

        if(name.length < 3 || name.length > 24) {
             nameError.textContent = 'Имя пользователя должно быть длиной от 3 до 24 символов'
            return
        } else if(!checkNameSymbols.test(name)) {
            nameError.textContent = 'Имя пользователя может содержать только русские, латинские буквы и тире'
            return
        }
        if(surname.length < 3 || surname.length > 24)  {
            surnameError.textContent = 'Фамилия пользователя должна быть длиной от 3 до 24 символов'
            return
        } else if(!checkNameSymbols.test(surname)) {
            surnameError.textContent = 'Фамилия пользователя может содержать только русские, латинские буквы и тире'
            return
        }
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
        close = true
        loading.classList.add('active')
        fetch('/auth/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, surname, email, password, repeat})
        })
            .then(response => response.json())
            .then(data => {
                loading.classList.remove('active')
                clearErrors()
                if(data.errors) {
                    nameError.textContent = data.errors.name
                    surnameError.textContent = data.errors.surname
                    emailError.textContent = data.errors.email
                    if(data.errors.password == '') {
                        passwordError.textContent = data.errors.repeat
                        repeatError.textContent = data.errors.repeat
                    } else {
                        passwordError.textContent = data.errors.password
                    }
                    close = false
                    return
                }
                location.assign('/auth/needconfirm')
            })
    })
})()