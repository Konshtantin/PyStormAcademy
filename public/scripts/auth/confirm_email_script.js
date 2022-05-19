(function() {
    const sendStatus = document.querySelector('.send-status')
    const resend = document.querySelector('.resend')
    let resendTime = document.querySelector('.resend-time')
    const loading = document.querySelector('.loading')
    let close = false
    function timerController(time) {
        let timer = `${(time-(time%60))/60}:${time%60}`
        if(timer.split(':')[0].length === 1) {
            timer = `0${timer}`
        }
        if(timer.split(':')[1].length === 1) {
            timer = `${timer.split(':')[0]}:0${timer.split(':')[1]}`
        }
        document.querySelector('.resend-timer').textContent = timer
        if(Number(timer.split(':')[0]) === 0 && Number(timer.split(':')[1]) < 2) {
            setTimeout(() => {
                resendTime.remove()
                resendTime.innerHTML = ''
                resend.append(createResendLink())
            }, 995)
        } else {
            setTimeout(() => {
                timerController(time-1)
            }, 995)
        }
    }
    
    function createResendTimer() {
        const resendTimer = document.createElement('span')
        resendTimer.classList.add('resend-timer')
        let timer = `${(180-(180%60))/60}:${180%60}`
        if(timer.split(':')[0].length === 1) {
            timer = `0${timer}`
        }
        if(timer.split(':')[1].length === 1) {
            timer = `${timer.split(':')[0]}:0${timer.split(':')[1]}`
        }
        resendTimer.textContent = timer
        return resendTimer
    }
    function createResendLink() {
        const resendLink = document.createElement('span')
        resendLink.classList.add('resend-link')
        resendLink.textContent = 'Отправить ещё раз'
        resendLink.addEventListener('click', (event) => {
            sendStatus.className = 'send-status'
            sendStatus.textContent = ''
            if(close) {
                return
            }
            close = true
            loading.classList.add('active')
            fetch('/auth/resend', {
                method: 'POST'
            })
                .then(response => response.json())
                .then(data => {
                    loading.classList.remove('active')
                    if(data.sendStatus) {
                        close = false
                        sendStatus.textContent = data.sendStatus
                        sendStatus.classList.add('send')
                    } else if(data.time) {
                        close = false
                        sendStatus.textContent = data.time
                        sendStatus.classList.add('time')
                    } else if(data.status) {
                        close = false
                        sendStatus.textContent = data.status
                        sendStatus.classList.add('ok')
                        document.querySelector('.resend-link').remove()
                        resendTime.textContent = 'Отправить ещё раз '
                        resendTime.append(createResendTimer())
                        resend.append(resendTime)
                        timerController(180)
                    }
                })
        })
        return resendLink
    }
    if(document.querySelector('.resend-timer').textContent == '') {
        resendTime.remove()
        resendTime.innerHTML = ''
        resend.append(createResendLink())
    } else {
        timerController(Number(document.querySelector('.resend-timer').textContent.split(':')[0])*60 + Number(document.querySelector('.resend-timer').textContent.split(':')[1]))
    }
   
})()