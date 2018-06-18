import React, { Component } from 'react';

import Immutable from 'immutable';

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

    this.setState({model: this.state.model.set('activated', event.target.checked)}, 
                  () => {this.saveConfig(); this.broadcastConfig()});
  }

  configHandler = (event) => {

    console.log('configHandler: ' + event.target.value);

    this.setState({
      model: this.state.model.set('config', event.target.value)
    });
    
  }

  /** Loads the Tabi config (state) on the config popup. */
  loadConfig = () => {    
    browser.storage.local.get('tabiconfig').then((item) => {

      if (!item || !item.tabiconfig) {
        this.setState({ model: new ConfigModel() });
        return;
      }

      this.setState({ model: new ConfigModel(item.tabiconfig) });            
    });
  }

  /** Stores the Tabi config (state). */
  saveConfig = () => {
    let contentToStore = {};
    contentToStore['tabiconfig'] = {activated: this.state.model.activated, config: this.state.model.config};
    browser.storage.local.set(contentToStore);
    console.log('Saved config: ' + JSON.stringify(contentToStore));
  }

  // when r or 1 is set then returns true, otherwise return false.
  isReload = (strValue) => {
    return strValue.match(/[r1]{1}/i);
  }

  broadcastConfig = () => {

    console.log('broadcastConfig: ' + this.state);

    // here we get array of config lines
    let parsedConfigLines = this.state.model.get('config').trim().split("\n");

    let configArray = [];

    parsedConfigLines.forEach(line => {
      let lineElements = line.split(',');
      let forceReload = lineElements.length > 1 ? this.isReload(lineElements[1]) : false;
      configArray.push({ timeout: lineElements[0], reload: forceReload });
    });


    browser.runtime.sendMessage(
      { type: "tabi-activation", activated: this.state.model.activated, configArray: configArray }
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
                <textarea rows="5" type="text" name="config" placeholder="2000,r" value={this.state.model.config} onChange={this.configHandler} />
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

/**
 * ConfigBox Model.
 */
var ConfigModel = Immutable.Record({ activated: false, config: '' });


/****************************************************************************************************************
 *  Export Section
 ***************************************************************************************************************/

export { ConfigPanel as ConfigPanel };
