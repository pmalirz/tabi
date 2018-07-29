import React, { Component } from 'react';

import { configRepository } from '../model/config-repository';
import { ConfigModel, TabConfig } from '../model/config-model';

import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import CheckBox from 'grommet/components/CheckBox';
import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';

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
    this.state = { model: new ConfigModel() };
  }

  activatedHandler = (event) => {
    console.log('activatedHandler: ' + event.target.checked);

    this.state.model.activated = event.target.checked;

    this.setState({model: this.state.model }, () => {this.saveConfig(); this.broadcastConfig()});
  }

  configHandler = (event) => {
    console.log('configHandler: ' + event.target.value);

    this.state.model.tabConfig = TabConfig.fromString(event.target.value);

    this.setState({ model: this.state.model });
    
  }

  /** Loads the Tabi config (state) on the config popup. */
  loadConfig = () => {    
    configRepository.loadOrDefault((loadedConfig) => {
      this.setState({ model: loadedConfig }); 

      console.log('Loaded config: ' + JSON.stringify(this.state.model.toJSON()));
    });
  }

  /** Stores the Tabi config (state). */
  saveConfig = () => {
    configRepository.save(this.state.model);

    console.log('Saved config: ' + JSON.stringify(this.state.model.toJSON()));
  }

  broadcastConfig = () => {
    browser.runtime.sendMessage(
      { type: "tabi-config-changed", config: this.state.model.toJSON() }
    );
  }

  render() {
    return (
      <Box direction="row" justify="center">
        <Box id="register-box" colorIndex="light-2" pad="medium" primary={true} size="medium">
          <Form>
            <Header>
              <Title>Tabi</Title>
            </Header>
            <FormFields>
              <FormField htmlFor="activated">
                <CheckBox name="activated" label="Activate Tabi" checked={this.state.model.activated} onChange={this.activatedHandler} />
              </FormField>
              <FormField>
                <textarea rows="5" type="text" name="config" placeholder="2000,r" value={TabConfig.toString(this.state.model.tabConfig)} onChange={this.configHandler} />
              </FormField>
            </FormFields>
          </Form>
        </Box>
      </Box>
    );
  }

  componentDidMount() {
    this.loadConfig();
  }

}

/****************************************************************************************************************
 *  Export Section
 ***************************************************************************************************************/

export { ConfigPanel as ConfigPanel };
