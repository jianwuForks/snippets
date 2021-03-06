import React from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import RefreshIcon from "@material-ui/icons/Refresh";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { pages } from "../constants";
import { actions } from "../actions/settings.js";
import SettingsGroup from "./SettingsGroup";
import { loadSnippets, loadLegacySnippets } from "../actions/snippets.js";

import logo from "../../../images/logo-transparent.png";

// TODO Move these to ../constants
const themes = {
  github: "Github",
  tomorrow_night: "Tomorrow Night",
};

const tabTypes = {
  true: "Spaces",
  false: "Tabs",
};

// This variable is injected by webpack
// eslint-disable-next-line no-undef
const VERSION = SNIPPETS_VERSION;

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAccessToken: false,
      initialAccessToken: props.settings.accessToken,
    };
  }

  handleBackButton = () => {
    if (this.state.initialAccessToken !== this.props.settings.accessToken) {
      this.props.loadSnippets();
    }
    this.props.history.push(pages.MAIN);
  };

  handleToggleAccessToken = () => {
    this.setState({ showAccessToken: !this.state.showAccessToken });
  };

  render() {
    return (
      <div className="settings">
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.handleBackButton}>
              <ArrowBackIcon />
            </IconButton>
            <h1 className="title">Snippets Settings</h1>
          </Toolbar>
        </AppBar>
        <main>
          <SettingsGroup label="About" className="about">
            <img className="logo" src={logo} />
            <p className="version">{VERSION}</p>
            <p className="author">By Sidney Nemzer</p>
            <a
              href="https://github.com/SidneyNemzer/snippets"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="repo">Github Repo</Button>
            </a>
          </SettingsGroup>
          <SettingsGroup label="Sync">
            <List>
              <ListItem>
                <ListItemText primary="Github Access Token" />
                <ListItemSecondaryAction>
                  <IconButton
                    className="toggle-access-token-button"
                    onClick={this.handleToggleAccessToken}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <TextField
                    className={
                      this.state.showAccessToken
                        ? "settings-input access-token-input-large"
                        : "settings-input access-token-input-small"
                    }
                    value={this.props.settings.accessToken}
                    onChange={(event) =>
                      this.props.accessToken(event.target.value)
                    }
                    type={this.state.showAccessToken ? "text" : "password"}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Github Gist ID" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input gist-id-input"
                    value={this.props.settings.gistId}
                    onChange={(event) => this.props.gistId(event.target.value)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Reload Snippets"
                  secondary="Reload Snippets from Github"
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      this.props.history.push(pages.MAIN);
                      this.props.loadSnippets();
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Autosave Frequency (seconds)"
                  secondary="Saves automatically after you stop typing for this many seconds. Set to 0 to disable."
                />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input small-number-input"
                    type="number"
                    value={this.props.settings.autosaveTimer}
                    onChange={(event) => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.autosaveTimer(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsGroup>
          <SettingsGroup label="Editor">
            <List>
              <ListItem>
                <ListItemText primary="Tab Size" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input small-number-input"
                    type="number"
                    value={this.props.settings.tabSize}
                    onChange={(event) => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.autosaveTimer(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Font Size" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input small-number-input"
                    type="number"
                    value={this.props.settings.fontSize}
                    onChange={(event) => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.fontSize(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Tab Character" />
                <ListItemSecondaryAction>
                  <Select
                    value={this.props.settings.softTabs}
                    onChange={(event) =>
                      this.props.softTabs(event.target.value)
                    }
                    className="settings-input"
                  >
                    {Object.keys(tabTypes).map((tabType) => (
                      <MenuItem key={tabType} value={tabType}>
                        {tabTypes[tabType]}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Theme" />
                <ListItemSecondaryAction>
                  <Select
                    value={this.props.settings.theme}
                    onChange={(event) => this.props.theme(event.target.value)}
                    className="settings-input"
                  >
                    {Object.keys(themes).map((theme) => (
                      <MenuItem key={theme} value={theme}>
                        {themes[theme]}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Autocomplete" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.autoComplete}
                    onChange={() =>
                      this.props.autoComplete(!this.props.settings.autoComplete)
                    }
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Line Wrap" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.lineWrap}
                    onChange={() =>
                      this.props.lineWrap(!this.props.settings.lineWrap)
                    }
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Linter" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.linter}
                    onChange={() =>
                      this.props.linter(!this.props.settings.linter)
                    }
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsGroup>
          <SettingsGroup label="Legacy">
            <List>
              <ListItem>
                <ListItemText
                  primary="Recover Legacy Snippets"
                  secondary="Check Chrome sync storage for snippets and move them to Gist storage"
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      this.props.loadLegacySnippets();
                      this.props.history.push(pages.MAIN);
                    }}
                  >
                    <PublishIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsGroup>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  settings: state.settings,
});

const mapDispatchToProps = {
  loadSnippets,
  loadLegacySnippets,
  ...actions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
