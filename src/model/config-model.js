import _ from 'lodash';

class ConfigModel {
    constructor(activated = false, tabConfig = []) {
        this.activated = activated;
        this.tabConfig = tabConfig;
    }

    addTabConfig = (tabConfig) => {
        this.tabConfig.push(tabConfig);
    }

    toJSON = () => {
        let tabConfigJSON = [];

        this.tabConfig.forEach(element => {
            tabConfigJSON.push(element.toJSON());      
        });

        return {activated: this.activated, tabConfig: tabConfigJSON};
    }

    static fromJSON(json) {
        var model = new ConfigModel(json['activated']);

        json['tabConfig'].forEach(element => {
            model.addTabConfig(TabConfig.fromJSON(element));      
        });

        return model;
    }

}

class TabConfig {
    constructor(timeout = 0, reload = false) {
        this.timeout = timeout;
        this.reload = reload;
    }

    toJSON = () => {
        return {timeout: this.timeout, reload: this.reload};
    }

    static fromJSON(json) {
        return new TabConfig(json['timeout'], json['reload']);
    }

    static fromString(text) {

        // when r or 1 is set then returns true, otherwise return false.
        var isReload = (strValue) => {
            return (/[r1]{1}/i).test(strValue);
        }

        // here we get array of config lines
        let parsedConfigLines = text.trim().split("\n");

        let configArray = [];

        parsedConfigLines.forEach(line => {
            let lineElements = line.split(',');
            let forceReload = lineElements.length > 1 ? isReload(lineElements[1]) : false;
            configArray.push(new TabConfig( _.toNumber(lineElements[0]), forceReload ));
        });

        return configArray;
    }

    static toString(tabConfigArray) {
        if(!_.isArray(tabConfigArray)) {
            return "";
        }

        let text = "";

        tabConfigArray.forEach(tabConfig => {
            text += tabConfig.timeout;
            text += tabConfig.reload ? ',r' : "";
            text += "\n";
        });

        return text.trim();
    }

} 

export { ConfigModel, TabConfig };