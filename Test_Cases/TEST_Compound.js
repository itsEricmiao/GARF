const Property = require('./Property.js')
const Component = require('./Component.js')
function TEST_COMPONENT_PROPERTY() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
        let name = "F" + i;
        let value = Math.random();
        let p = new Property();
        p.quickSetting(name, value);
        arr.push(p);
    }
}