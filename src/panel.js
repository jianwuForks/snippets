// Debug
import Logger from 'logger'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Ace Editor
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'

// Style
import './style.css'

function evalInWindow(string) {
  chrome.devtools.inspectedWindow.eval(string)
}

const logger = new Logger('panel')
logger.debug('Initializing...')

ReactDOM.render(
  <AceEditor
    mode="javascript"
    onChange={newValue => logger.debug(newValue)}
    name="editor"
    height="100vh"
    width="100%"
    theme="github"
  />,
  document.getElementById('root')
)
