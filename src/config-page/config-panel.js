import React, { Component } from 'react';

import { configRepository } from '../model/config-repository';
import { ConfigModel, TabConfig } from '../model/config-model';

import {
  Box,
  FormField,
  CheckBox,
  Header,
  Heading,
  Image,
  TextArea
} from 'grommet';

class ConfigPanel extends Component {
  render() {
    return (
      <ConfigBox />
    );
  }
}

class ConfigBox extends Component {

  constructor(props) {
    super(props);

    this.state = { activated: false, tabConfig: '' };
  }

  activatedHandler = (event) => {
    console.log('activatedHandler: ' + event.target.checked);

    let activated = event.target.checked;

    let newState = { activated: activated };
    this.setState(_.merge(this.state, newState), () => this.applyChanges());
  }

  tabConfigHandler = (event) => {
    console.log('configHandler: ' + event.target.value);
    let newState = { tabConfig: event.target.value };
    this.setState(_.merge(this.state, newState));
  }

  /** Saves the current state and brodcast the changes to inform the background script about amendments. */
  applyChanges = (event) => {
    // save config
    let savedConfigModel = this.saveConfig();

    // broadcast changes
    this.broadcastConfig(savedConfigModel);
  }

  /** Loads the Tabi config (state) on the config popup. */
  loadConfig = () => {
    configRepository.loadOrDefault((loadedConfig) => {
      this.setState({ activated: loadedConfig.activated, tabConfig: TabConfig.toString(loadedConfig.tabConfig) });

      console.log('Loaded config: ' + JSON.stringify(this.state));
    });
  }

  /** Stores the Tabi config (state). */
  saveConfig = () => {
    let configModel = new ConfigModel(this.state.activated, TabConfig.fromString(this.state.tabConfig));

    configRepository.save(configModel);

    console.log('Saved config: ' + JSON.stringify(this.state));

    return configModel;
  }

  /** Notifies the background script about changes made in the configuration. */
  broadcastConfig = (configModel) => {
    browser.runtime.sendMessage(
      { type: "tabi-config-changed", config: configModel.toJSON() }
    );
  }

  render() {

    console.log('render: ' + this.state.tabConfig + ', ' + this.state.activated);

    const textureURL = browser.extension.getURL("icons/tabi48.png");
    const tabConfigError = this.state.tabConfig != "" && !TabConfig.isValidString(this.state.tabConfig) ? "Invalid configuration" : "";

    return (
      <Box direction="row" justify="center">
        <Box id="register-box" colorIndex="light-2" pad="medium" primary={true} size="medium">
          <Header>
            <Image src={textureURL} size="thumb" /><Heading>Tabi</Heading>
          </Header>
          <FormField htmlFor="activated">
            <CheckBox name="activated" label="Activate Tabi" checked={this.state.activated} onChange={this.activatedHandler} />
          </FormField>
          <FormField error={tabConfigError}>
            <TextArea name="config" placeholder="2,r" value={this.state.tabConfig} onChange={this.tabConfigHandler} />
          </FormField>
        </Box>
      </Box>
    );
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.loadConfig();
  }


}

/****************************************************************************************************************
 *  Export Section
 ***************************************************************************************************************/

export { ConfigPanel as ConfigPanel };
