(function () {
    ace.require("ace/ext/language_tools");
    const ideConsole = document.querySelector('#ide-console')
    const runButton = document.querySelector('.run-code')
    const checkButton = document.querySelector('.check-code')
    const notification = document.querySelector('.notification')
    const informaiton = document.querySelector('.information')
    const closeNotification = document.querySelector('.close-notification')

    let previousConsoleValue = ''
    let closeRun = false
    let closeCheck = false

    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");

    editor.setOptions({
        fontSize: "1.1rem",
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    function notificate(data) {
        if(data.length === 1) {

            informaiton.textContent = data[0]
            notification.classList.add('task')
            notification.classList.add('active')

            const closeInfoTimeout = setTimeout(() => {
                notification.classList.remove('active')
                notification.classList.remove('task')
                closeNotification.onclick = () => {}
            }, 4000)

            closeNotification.onclick = (e) => {
                clearTimeout(closeInfoTimeout)
                notification.classList.remove('active')
                notification.classList.remove('task')
                closeNotification.onclick = () => {}
            }

        } else if(data.length === 2) {

            informaiton.textContent = data[0]
            notification.classList.add('task')
            notification.classList.add('active')

            const closeInfoTimeout = setTimeout(() => {
                notification.classList.remove('active')
                notification.classList.remove('task')
                
                informaiton.textContent = `Урок завершен!`
                notification.classList.add('lesson')
                notification.classList.add('active')
                const closeInfoTimeoutLesson = setTimeout(() => {
                    notification.classList.remove('active')
                    notification.classList.remove('lesson')
                }, 3000)
                closeNotification.onclick = (e) => {
                    clearTimeout(closeInfoTimeoutLesson)
                    notification.classList.remove('active')
                    notification.classList.remove('lesson')
                    closeNotification.onclick = () => {}
                }
            }, 4000)

            closeNotification.onclick = (e) => {
                clearTimeout(closeInfoTimeout)
                notification.classList.remove('active')
                notification.classList.remove('task')
                closeNotification.onclick = () => {}

                informaiton.textContent = `Урок завершен!`
                notification.classList.add('lesson')
                notification.classList.add('active')
                
                const closeInfoTimeoutLesson = setTimeout(() => {
                    notification.classList.remove('active')
                    notification.classList.remove('lesson')
                }, 3000)

                closeNotification.onclick = (e) => {
                    clearTimeout(closeInfoTimeoutLesson)
                    notification.classList.remove('active')
                    notification.classList.remove('lesson')
                    closeNotification.onclick = () => {}
                }
            }
        }
    }
    runButton.addEventListener('click', (event) => {
        if(closeRun) {
            return
        }
        
        if(ideConsole.value.length > 1000) {
            if(previousConsoleValue.includes('\r')) {
                if(previousConsoleValue.split('\r\n').join('') == ideConsole.value.split('\n').join('')) {
                    ideConsole.value = ''
                } else {
                    ideConsole.value = 'Слишком много данных в командной строке! Невозможно выполнить код!'
                    return
                }
            } else {
                if(previousConsoleValue.split('\n').join('') == ideConsole.value.split('\n').join('')) {
                    ideConsole.value = ''
                } else {
                    ideConsole.value = 'Слишком много данных в командной строке! Невозможно выполнить код!'
                    return
                }
            }
        }
        closeRun = true
        const code = editor.getValue()
        const args = ideConsole.value.split('\n').map(item => item.trim()).filter(item => item !== '')
        ideConsole.value = ''
        fetch('/run', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code, args})
        })  
            .then(response => response.json())
            .then(data => {
                closeRun = false
                if(data.result.error) {
                    ideConsole.value = data.result.error.string
                    return
                }
                if(data.derror) {
                    ideConsole.value = data.derror
                    return
                }
                previousConsoleValue = data.result
                ideConsole.value = data.result
            })
    })
    checkButton.addEventListener('click', (event) => {
        if(closeCheck) {
            return
        }
        if(ideConsole.value.length > 1000) {
            if(previousConsoleValue.includes('\r')) {
                if(previousConsoleValue.split('\r\n').join('') == ideConsole.value.split('\n').join('')) {
                    ideConsole.value = ''
                } else {
                    ideConsole.value = 'Слишком много данных в командной строке! Невозможно выполнить код!'
                    return
                }
            } else {
                if(previousConsoleValue.split('\n').join('') == ideConsole.value.split('\n').join('')) {
                    ideConsole.value = ''
                } else {
                    ideConsole.value = 'Слишком много данных в командной строке! Невозможно выполнить код!'
                    return
                }
            }
        }

        closeCheck = true
        const code = editor.getValue()
        const args = ideConsole.value.split('\n').map(item => item.trim()).filter(item => item !== '')
        ideConsole.value = ''
        fetch('/run/check', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code,
                args,
                path: location.pathname,
                date: new Date()
            })
        })
            .then(response => response.json())
            .then(data => {
                closeCheck = false
                if(data.error) {
                    ideConsole.value = data.error.string
                }
                if(data.pathError) {
                    notificate([data.pathError])
                }
                if(data.derror) {
                    notificate([data.derror])
                }
                if(data.formatError) {
                    notificate([data.formatError])
                }
                if(data.result || data.result === '') {
                    if(data.check_result) {
                        if(data.notifications.task && data.notifications.lesson) {
                            notificate([data.notifications.task, data.notifications.lesson])
                        } else if(data.notifications.task) {
                            notificate([data.notifications.task])
                        }
                    } else {
                        notificate([data.notifications.task])
                    }
                    previousConsoleValue = data.result
                    ideConsole.value = data.result
                }
            })
        
    })
})()