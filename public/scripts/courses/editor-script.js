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
        fontSize: "1.2rem",
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    console.log(editor)
    runButton.addEventListener('click', (event) => {
        if(closeRun) {
            return
        }
        if(ideConsole.value.length > 5000) {
            if(previousConsoleValue.includes('\r')) {
                if(previousConsoleValue.split('\r\n').join('') == ideConsole.value.split('\n').join('')) {
                    ideConsole.value = ''
                } else {
                    ideConsole.value = 'Слишком много данных в консоли'
                    return
                }
            } else {
                if(previousConsoleValue.split('\n').join('') == ideConsole.value.split('\n').join('')) {
                    ideConsole.value = ''
                } else {
                    ideConsole.value = 'Слишком много данных в консоли'
                    return
                }
            }
            
            
        }

        const code = editor.getValue()
        const args = ideConsole.value.split('\n').map(item => item.trim().toString()).filter(item => item !== '')
        closeRun = true
        fetch('/run', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code, args})
        })  
            .then(response => response.json())
            .then(data => {
                closeRun = false
                if(data.response.error) {
                    ideConsole.value = data.response.error.errArray[1]
                    return
                }
                if(data.response.derror) {
                    ideConsole.value = data.response.derror
                    return
                }
                previousConsoleValue = data.response
                ideConsole.value = data.response
            })
    })
})()