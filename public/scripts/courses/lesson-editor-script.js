(function () {
    ace.require("ace/ext/language_tools");
    const ideConsole = document.querySelector('#ide-console')
    const runButton = document.querySelector('.run-code')

    let previousConsoleValue = ''
    let closeRun = false

    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");

    editor.setOptions({
        fontSize: "1.1rem",
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
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
        const args = ideConsole.value.split('\n').map(item => item.trim().toString()).filter(item => item !== '')
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
                if(data.result.derror) {
                    ideConsole.value = data.result.derror
                    return
                }
                previousConsoleValue = data.result
                ideConsole.value = data.result
            })
    })
})()