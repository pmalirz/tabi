(function () {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    // rotating is enabled
    var enabled = false;

    var configArray = [];

    var currentTabIdx = 0;

    // active timeout
    var currentlySwitchingTimeout;

    /** A tab should be reloaded before it is activated. */
    function reloadNextTab(allTabs) {        
        let nextTabIndex = getNextTabIndex(allTabs);
        let configNextForTab = getConfigForTabIndex(nextTabIndex);

        let forceReload = configArray[configNextForTab].reload;

        if(forceReload) {
            browser.tabs.reload(allTabs[nextTabIndex].id);
        }
    }

    /** Get config array for a given tab index. */
    function getConfigForTabIndex(tabIndex) {    
        return tabIndex >= configArray.length ? configArray.length - 1 : tabIndex;
    }

    /** Gets the next tab index in relation to the current tab index. */
    function getNextTabIndex(allTabs) {
        return currentTabIdx + 1 == allTabs.length ? 0 : currentTabIdx + 1;
    }

    /** Makes the tab switch happen and schedules the next tab switch (in the time given by the tab config) . */
    function activateTab(allTabs) {
        // select next tab
        if (currentTabIdx >= allTabs.length) {
            currentTabIdx = 0;
        }

        if (configArray.length == 0) {
            return; // do nothing...
        }

        let configIdx = getConfigForTabIndex(currentTabIdx);
        // read the next timeout
        let nextTimeout = configArray[configIdx].timeout;
        
        console.log("Next timeout: " + nextTimeout + ", Current tab index: " + currentTabIdx);

        let currentTab = allTabs[currentTabIdx];

        reloadNextTab(allTabs);

        browser.tabs.update(currentTab.id, { active: true });

        currentTabIdx++;

        // lets go with the next
        currentlySwitchingTimeout = setTimeout(switchTabs, nextTimeout);
    }

    function switchTabs() {
        if (!enabled) {
            return; // just stop that madness... quit form the loop
        }

        var allTabsPromise = browser.tabs.query({ currentWindow: true });

        allTabsPromise.then(function (allTabs) {
            activateTab(allTabs);
        });

    }

    function clearSwitchingTimeout() {
        if(currentlySwitchingTimeout) {
            clearTimeout(currentlySwitchingTimeout);
        }
    }

    function enableTabi(_configArray) {
        clearSwitchingTimeout();

        console.log("Enable Tabi. Tabi config: " + _configArray);

        configArray = _configArray;
        enabled = true;

        switchTabs();
    }

    function disableTabi() {
        clearSwitchingTimeout();

        console.log("Disable Tabi");

        enabled = false;
    }

    // Browser Listeners ------------------------------------------

    browser.runtime.onMessage.addListener((message) => {

        console.log('background onMessage: ' + message);

        if (message.type === "tabi-activation") {
            if (message.activated) {
                enableTabi(message.configArray);
            } else {
                disableTabi();
            }
        }
    });

})();