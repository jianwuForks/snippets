/* global ace */

// ace-builds must be imported before react-ace
// See https://github.com/securingsincity/react-ace/issues/725
import "ace-builds";

import React from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow_night";

// Tell webpack to include these files in the build. file-loader replaces
// these `require`'s with a string, the path to the file in the build output.
// Ace loads these dynamically at runtime. We don't use ace-builds/webpack-resolver
// because that pulls in the files for EVERY mode, theme, etc.
ace.config.setModuleUrl(
  "ace/ext/language_tools",
  require("file-loader?esModule=false!ace-builds/src-noconflict/ext-language_tools.js")
);
ace.config.setModuleUrl(
  "ace/mode/javascript",
  require("file-loader?esModule=false!ace-builds/src-noconflict/mode-javascript.js")
);
ace.config.setModuleUrl(
  "ace/theme/github",
  require("file-loader?esModule=false!ace-builds/src-noconflict/theme-github.js")
);
ace.config.setModuleUrl(
  "ace/theme/tomorrow_night",
  require("file-loader?esModule=false!ace-builds/src-noconflict/theme-tomorrow_night.js")
);

// Custom mode that uses ESLint
ace.config.setModuleUrl(
  "ace/mode/javascript-eslint",
  require("file-loader?esModule=false!../../mode-javascript-eslint/mode-javascript-eslint.js")
);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.lastUpdatedBy && props.lastUpdatedBy !== props.editorId) {
      return { value: props.value };
    } else {
      return null;
    }
  }

  handleChange = (value) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    return (
      <AceEditor
        mode="javascript-eslint"
        name="editor"
        width="100%"
        height="auto"
        theme={this.props.settings.theme}
        fontSize={this.props.settings.fontSize}
        value={this.state.value}
        onChange={this.handleChange}
        highlightActiveLine={false}
        enableBasicAutocompletion={this.props.settings.autoComplete}
        enableLiveAutocompletion={this.props.settings.autoComplete}
        tabSize={this.props.settings.tabSize}
        wrapEnabled={this.props.settings.lineWrap}
        editorProps={{
          $blockScrolling: Infinity,
          useSoftTabs: this.props.settings.softTabs,
        }}
        setOptions={{
          useWorker: this.props.settings.linter,
        }}
        onLoad={(ace) => {
          ace.container.addEventListener("keydown", (event) => {
            if (event.key === "?") {
              event.stopPropagation();
            }
          });
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(Editor);
