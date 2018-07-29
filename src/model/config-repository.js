import _ from 'lodash';
import { ConfigModel, TabConfig } from './config-model';

/** Repository to store and load the configuration. It uses the browser storage. */
class ConfigRepository {

    save = (configModel) => {
        if(!(configModel instanceof ConfigModel)){
            throw "configModel parameters must be ConfigModel";
        }

        //let contentToStore = [];
        let contentToStore = configModel.toJSON();

        console.log(contentToStore);

        browser.storage.local.set(contentToStore);
    }

    loadOrDefault = (onload) => {
        browser.storage.local.get().then((modelJSON) => {

            if(!_.isObject(modelJSON)) {
                onload(new ConfigModel());
            }

            onload(ConfigModel.fromJSON(modelJSON));
        });
    }

}

// Export the repository as a singleton
export let configRepository = new ConfigRepository(); 
