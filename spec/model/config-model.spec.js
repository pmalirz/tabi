import { ConfigModel, TabConfig } from '../../src/model/config-model';

describe("ConfigModel suite", function() {
    it("ConfigModel - toJSON and fromJSON", function() {
       let tabConfig1 = new TabConfig(1000, true);
       let tabConfig2 = new TabConfig(2000, false);

       let model = new ConfigModel(true, [tabConfig1]);

       model.addTabConfig(tabConfig2);

       let modelJSONized = model.toJSON();

       let modelFromJSON = ConfigModel.fromJSON(modelJSONized);

       expect(modelFromJSON.activated).toBe(true);
       expect(modelFromJSON.tabConfig.length).toBe(2);
       expect(modelFromJSON.tabConfig[0].timeout).toBe(1000);
       expect(modelFromJSON.tabConfig[0].reload).toBe(true);
       expect(modelFromJSON.tabConfig[1].timeout).toBe(2000);
       expect(modelFromJSON.tabConfig[1].reload).toBe(false);

    });

    it("ConfigModel - fromText", function() {
      let tabiConfigArray = TabConfig.fromString("2000,x\n1000,r\n8000");

      expect(tabiConfigArray.length).toBe(3);
      expect(tabiConfigArray[0].timeout).toBe(2000);
      expect(tabiConfigArray[0].reload).toBe(false);
      expect(tabiConfigArray[1].timeout).toBe(1000);
      expect(tabiConfigArray[1].reload).toBe(true);
      expect(tabiConfigArray[2].timeout).toBe(8000);
      expect(tabiConfigArray[2].reload).toBe(false);
   });

   it("ConfigModel - isValidString", function() {
      expect(TabConfig.isValidString("2000")).toBeTruthy();
      expect(TabConfig.isValidString("2000   ")).toBeTruthy();
      expect(TabConfig.isValidString("2000,r   ")).toBeTruthy();
      expect(TabConfig.isValidString("2000,R   ")).toBeTruthy();

      expect(TabConfig.isValidString("2000,r\r\n1   ")).toBeTruthy();

   });

  });